const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    username:{type: String, required: true, min: 3, max: 20, match: [/^[a-zA-Z0-9_]+$/, 'is invalid'], index: { unique: true }}, // String is shorthand for {type: String}
    password: {type: String, required: true, min:5,},
},{timestamps: true});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;