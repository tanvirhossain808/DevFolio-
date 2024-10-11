const bcrypt = require("bcrypt")

const encryptedPassword = async (password, salt = 10) => {
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword
}

module.exports = encryptedPassword
