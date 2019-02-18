"use strict"

const ss = require('socket.io-stream'),
      path = require('path'),
      fs = require('fs'),
      crypto = require('crypto')

module.exports = socket => {
    ss(socket).on('upload', (stream, data) => {
        let filename,
            num = 0
        while (true) {
            filename = path.join(
                './public/images',
                crypto.createHash('sha256').update(
                    Date.now() + data.name + num++
                ).digest('hex') + path.extname(data.name)
            )
            try {
                fs.accessSync(filename, fs.constants.F_OK)
            } catch (err) {
                break
            }
        }
        stream.pipe(fs.createWriteStream(filename))
    })
}
