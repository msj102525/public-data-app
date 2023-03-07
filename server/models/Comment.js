const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String },
  article: { type: Schema.ObjectId, required: true },
  author: { type: Schema.ObjectId, required: true, ref: 'User' },
  created: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Comment', CommentSchema);