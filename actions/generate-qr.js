const qrCode = require('qrcode');
const path = require('path');
const mkdirp = require('mkdirp');

mkdirp(path.join(__dirname, '..', 'images'));

module.exports = function (label) {
    const filePath = path.join(__dirname, '..', 'images', label + '.png');
    return qrCode.toFile(filePath, label).then(() => ({ filePath, label }));
}
