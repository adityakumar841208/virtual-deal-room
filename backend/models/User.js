const mongoose = require('mongoose')

const useSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType:{ type: String, required: true }, // buyer | seller
  // chatIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }], // Array of chat IDs
}, { timestamps: true })

const User = mongoose.model('User', useSchema)
module.exports = User