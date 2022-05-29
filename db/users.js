const {Schema, model} = require('mongoose');
const crypto = require('crypto')
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
    avatarUrl: {
        type: String,
        default: function () {
            return gravatar.url(this.email, { s: '250' }, true)
          },
    },
    isVerified: { type: Boolean, default: false },
    verifyToken: {
      type: String,
      required: true,
      default: crypto.randomUUID(),
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