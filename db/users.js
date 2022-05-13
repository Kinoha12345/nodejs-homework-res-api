const {Schema, model} = require('mongoose');
const bCrypt = require("bcryptjs")


const userSchema = new Schema ({
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password required"]
    },
    subscription: {
        type: String,
        enum: ['starter', 'pro', 'business'],
        default: 'starter',
    },
    token: {
        type: String,
        default: null,
    },
},
    { versionKey: false, timestamps: true },
)

userSchema.methods.setPassword = function (password) {
    this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6))
};

userSchema.methods.validPasswords = function(password) {
    return bCrypt.compareSync(password, this.password)
}

const User = model('user', userSchema)

module.exports = User;