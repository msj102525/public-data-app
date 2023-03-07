const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const ArticleSchema = new Schema({
  images: [{ type: String, required: true }],
  description: { type: String },
  created: { type: Date, default: Date.now },
  author: { type: Schema.ObjectId, required: true, ref: 'User' },
  favoriteCount: { type: Number, default: 0 },
})

// 보여주기용 날짜 생성
ArticleSchema.virtual('displayDate').get(function () {
  return DateTime
   .fromJSDate(this.created)
   .toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model('Article', ArticleSchema);