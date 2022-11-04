const { response } = require('express');

const log = (req,res = response,next) => {
    console.log('Loggin....');
    next();
}

module.exports = {
    log
}
