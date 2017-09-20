
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const AUTH_REGEX = /bearer (.*)$/i;

module.exports = {
    authenticate: async (req, Users) => {
        const auth = req.get('Authorization');
        if (!auth) {
            return null;
        }
        const token = AUTH_REGEX.exec(auth)[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        return Users.findOne({ username: decoded.username });
    },

    login: async (user, password) => {
        const match = await bcrypt.compare(password, user.encryptedPassword);
        if (match) {
            return jwt.sign({ username: user.username }, process.env.SECRET);
        }
        return null;
    },

    encrypt: async (password) => {
        return bcrypt.hash(password, 10);
    },
};
