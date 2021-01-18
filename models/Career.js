const mongoose = require('mongoose');
const slugify = require('slugify')

const CareerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Please add a career name'],
            maxlength: [50, 'Career cannot be more than 50 characters']
        },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
            index: true
        },
        image: {
            url: String,
            key: String
        },
        content: {
            type: String,
            maxlength: [500, 'Description cannot be more than 500 character']
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false
    }
);

CareerSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})

// Cascade delete
CareerSchema.pre('remove', async function(next) {
    console.log(`pre remove ${this.slug}`)
    await this.model('Link').deleteMany({ career: this.slug })
    next()
})

// Reverse populate with virtuals
CareerSchema.virtual('companies', {
    ref: 'Link',
    localField: 'slug',
    foreignField: 'career',
    justOne: false
})

module.exports = mongoose.model('Career', CareerSchema);
