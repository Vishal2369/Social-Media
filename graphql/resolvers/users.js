const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../utils/validtors');
const User = require('../../models/user');

const getToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, process.env.SECRET_KEY, {
        expiresIn: '1h'
    });
}


module.exports = {
    Mutation: {
        async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) {

            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);

            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            const existingUser = await User.findOne({ username: username });

            if (existingUser) {
                errors.username = 'This username is already taken';

                throw new UserInputError('Errors', { errors })
            }

            password = await bcrypt.hash(password, 10);

            const user = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await user.save();

            const token = getToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },


        async login(_, { username, password }, context, info) {

            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const existingUser = await User.findOne({ username });

            if (!existingUser) {
                errors.general = "User not found";
                throw new UserInputError('Errors', { errors });
            }

            const match = await bcrypt.compare(password, existingUser.password);

            if (!match) {
                errors.general = "Invalid credentials";
                throw new UserInputError('Errors', { errors })
            }

            const token = getToken(existingUser);

            return {
                ...existingUser._doc,
                id: existingUser._id,
                token
            }
        }
    }
}