"use strict"

const router = require('express').Router(),
      crypto = require('crypto'),
      mongoose = require("mongoose")

let db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
    console.log("Connected to mongod server")
})

mongoose.connect('mongodb://localhost/chat', {useNewUrlParser: true})

let User = require('../../models/user')

router
.get('/login', (req, res) => {
    res.render("auth/login", {
        'error': [],
        'id': ""
    })
})
.post('/login', (req, res) => {
    User.find({'id': req.body.id}, (err, data) => {
        if (err) {
            console.error(err)
        } else {
            if (data[0].pwd === crypto.createHash('sha512').update(req.body.pwd).digest('hex')) {
                req.session.alerts.push('로그인 되었습니다')
                req.session.user_id = data.id
                req.session.user_name = data.name
                req.session.user_idx = data._id
                res.redirect(301, '/')
            } else {
                res.render("auth/login", {
                    'error': [
                        '일치하는 회원정보가 없습니다.'
                    ],
                    'id': req.body.id
                })
            }
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
