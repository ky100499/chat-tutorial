"use strict"

const router = require('express').Router(),
      crypto = require('crypto'),
      mongoose = require("mongoose")

let db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
    console.log("Connected to mongod server - /routes/auth")
})

mongoose.connect('mongodb://localhost/chat', {useNewUrlParser: true})

let User = require('../../models/user')

router
.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err)
        } else {
            res.redirect('/')
        }
    })
})
.get('/login', (req, res) => {
    res.render("auth/login", {
        'error': [],
        'id': ""
    })
})
.post('/login', (req, res) => {
    User.find({'id': req.body.id}, (err, data) => {
        let errors = []

        if (err) {
            console.error(err)
            errors.push("Error while logging in")
        } else {
            if (data[0].pwd === crypto.createHash('sha512').update(req.body.pwd).digest('hex')) {
                req.session.alerts.push('로그인 되었습니다')
                req.session.user_id = data[0].id
                req.session.user_name = data[0].name
                req.session.user_idx = data[0]._id
            } else {
                errors.push('일치하는 회원정보가 없습니다.')
            }
        }

        if (errors.length) {
            res.render("auth/login", {
                'error': errors,
                'id': req.body.id
            })
        } else {
            res.redirect('/')
        }
    })
})
.get('/signup', (req, res) => {
    res.render("auth/signup", {
        'error': [],
        'name': '',
        'id': '',
    })
})
.post('/signup', (req, res) => {
    let errors = []

    User.find({'id': req.body.id}, (err, data) => {
        if (err) {
            console.error(err)
        } else {
            if (
                req.body.name.length *
                req.body.id.length *
                req.body.pwd.length *
                req.body.pwd_check.length
                == 0
            ) {
                errors.push("모든 항목을 채워 주세요.")
            }
            if (req.body.name.length > 10) {
                errors.push("이름은 최대 10자를 넘을 수 없습니다.")
            }
            if (data.length > 0) {
                errors.push("이미 사용중인 ID입니다.")
            }
            if (req.body.id.length > 20) {
                errors.push("ID는 최대 20자를 넘을 수 없습니다.")
            }
            if (req.body.pwd != req.body.pwd_check) {
                errors.push("비밀번호가 일치하지 않습니다.")
            }
        }

        if (errors.length) {
            res.render("auth/signup", {
                'error': errors,
                'name': req.body.name,
                'id': req.body.id,
            })
        }
        else {
            let user = new User()

            user.name = req.body.name
            user.id = req.body.id
            user.pwd = crypto.createHash('sha512').update(req.body.pwd).digest('hex')

            user.save()

            req.session.alerts.push('회원가입에 성공하였습니다.')
            res.redirect('/auth/login')
        }
    })
})

module.exports = router
