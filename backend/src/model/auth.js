import mongoose, { Schema } from "mongoose";
import bcrypt, { hash } from 'bcrypt';
import JWT from 'jsonwebtoken';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String
    },
    refreshToken: {
        type: String
    },
    googleId: {
        type: String
    }
})

userSchema.pre('save', function (next) {
    if (!this.isModified("password")) return next();

    const user = this
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash
        next()
    })
})

userSchema.methods.isPasswordCorrect = async function (enteredPssword) {
    const user = this;
    return await bcrypt.compare(enteredPssword, user.password);
}

userSchema.methods.generateRefreshToken = async function () {
    return JWT.sign({
        userId: this._id
    },
        process.env.REFRESH_TOKEN_KEY, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

userSchema.methods.generateAccessToken = async function () {
    return JWT.sign({
        userId: this._id,
        email: this.email,
        username: this.username,
        name: this.name
    },

        process.env.ACCESS_TOKEN_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}

const User = mongoose.model('User', userSchema)
export default User;