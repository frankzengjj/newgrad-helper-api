const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const slugify = require('slugify')

const LinkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            max: 256
        },
        url: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            lowercase: true,
            index: true
        },
        company: {
            type: String,
            required: true,
            index: true,
            lowercase: true
        },
        career: {
            type: String,
            ref: 'Career',
            required: true
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        clikes: { type: Number, default: 0 }
    },
    { timestamps: true }
);

LinkSchema.pre('save', function (next) {
    console.log('link schema')
    this.slug = slugify(this.title, { lower: true })
    next()
})

module.exports = mongoose.model('Link', LinkSchema);
