const mongoose = require('mongoose')

const useSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType:{ type: String, required: true }, // buyer | seller
}, { timestamps: true })

const User = mongoose.model('User', useSchema)
module.exports = User