const mongoose = require('mongoose');

// Simple schema without middleware for import
const simpleProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  priceDiscount: Number,
  category: String,
  description: String,
  seller: String,
  postedDate: { type: Date, default: Date.now },
  productSlug: String,
  premiumProducts: { type: Boolean, default: false }
});

const SimpleProduct = mongoose.model('SimpleProduct', simpleProductSchema);

// Sample products data
const sampleProducts = [
  {
    name: "Wireless Headphones",
    price: 899,
    priceDiscount: 799,
    category: "Electronics",
    description: "High quality wireless headphones",
    seller: "Tech Store",
    premiumProducts: false
  },
  {
    name: "Smart Watch",
    price: 750,
    priceDiscount: 650,
    category: "Electronics",
    description: "Fitness tracking smart watch",
    seller: "Tech Store",
    premiumProducts: false
  },
  {
    name: "Running Shoes",
    price: 450,
    priceDiscount: 399,
    category: "Sports",
    description: "Comfortable running shoes",
    seller: "Sports Shop",
    premiumProducts: false
  },
  {
    name: "Yoga Mat",
    price: 299,
    priceDiscount: 249,
    category: "Sports",
    description: "Non-slip yoga mat",
    seller: "Sports Shop",
    premiumProducts: false
  },
  {
    name: "Coffee Maker",
    price: 650,
    priceDiscount: 599,
    category: "Home",
    description: "Automatic coffee maker",
    seller: "Home Store",
    premiumProducts: false
  },
  {
    name: "Premium Laptop",
    price: 2500,
    priceDiscount: 2300,
    category: "Electronics",
    description: "High performance laptop",
    seller: "Tech Store",
    premiumProducts: true
  },
  {
    name: "Designer Bag",
    price: 1800,
    priceDiscount: 1600,
    category: "Fashion",
    description: "Luxury designer handbag",
    seller: "Fashion Boutique",
    premiumProducts: true
  },
  {
    name: "Office Chair",
    price: 899,
    priceDiscount: 799,
    category: "Furniture",
    description: "Ergonomic office chair",
    seller: "Furniture Store",
    premiumProducts: false
  },
  {
    name: "Desk Lamp",
    price: 350,
    priceDiscount: 299,
    category: "Furniture",
    description: "LED desk lamp",
    seller: "Furniture Store",
    premiumProducts: false
  },
  {
    name: "Water Bottle",
    price: 150,
    priceDiscount: 120,
    category: "Sports",
    description: "Insulated water bottle",
    seller: "Sports Shop",
    premiumProducts: false
  }
];

async function importData() {
  try {
    // Connect to database
    await mongoose.connect('mongodb+srv://alfonsorafaelbarte_db_user:PsUYL3hGDKdy9Stp@cluster0.4rp93rq.mongodb.net/marketplace?appName=Cluster0');
    
    console.log('Connected to database');
    
    // Clear existing products
    await SimpleProduct.deleteMany();
    console.log('Existing products deleted');
    
    // Import new products
    await SimpleProduct.create(sampleProducts);
    console.log('Products imported successfully!');
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

importData();
