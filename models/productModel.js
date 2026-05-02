const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'Discount price {{VALUE}} should be below regular price'
    }
  },
  category: {
    type: String,
    required: [true, 'A product must have a category'],
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxLength: [50, 'Description must not exceed 50 characters']
  },
  seller: {
    type: String,
    required: [true, 'A product must have a seller'],
    trim: true,
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  productSlug: String,
  premiumProducts: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.virtual('daysPosted').get(function() {
  const currentDate = new Date();
  const postedDate = new Date(this.postedDate);
  const diffTime = Math.abs(currentDate - postedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Document Middleware (temporarily disabled due to Mongoose version compatibility)
// productSchema.pre('save', async function(next) {
//   this.productSlug = slugify(this.name, { upper: true });
//   next();
// });

// productSchema.post('save', function(doc) {
//   console.log('Product saved:', doc.name);
// });

// Query Middleware (temporarily disabled for testing)
// productSchema.pre(/^find/, function(next) {
//   this.find({ premiumProducts: { $ne: true } });
//   this.start = Date.now();
//   next();
// });

// productSchema.post(/^find/, function(docs) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
// });

// Aggregate Middleware (temporarily disabled for testing)
// productSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { premiumProducts: { $ne: true } } });
//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;