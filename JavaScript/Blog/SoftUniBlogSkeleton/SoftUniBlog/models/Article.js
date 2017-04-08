/**
 * Created by Kamen on 31.3.2017 г..
 */
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let articleSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: ObjectId, required: true, ref: 'User' },
    date: { type: Date, default: Date.now() }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;