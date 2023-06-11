const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
//So just passing the result of requiring
// that package that we installed
//and this is going to add on out schema a username,
//it's going to add on a field for password
//it's going to make sure those username are unique and
//not duplicated.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);