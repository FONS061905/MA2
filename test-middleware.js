const mongoose = require('mongoose');
const Product = require('./models/productModel');

async function testDocumentMiddleware() {
  try {
    // Connect to database
    await mongoose.connect('mongodb+srv://alfonsorafaelbarte_db_user:PsUYL3hGDKdy9Stp@cluster0.4rp93rq.mongodb.net/marketplace?appName=Cluster0');
    
    console.log('Connected to database');
    
    // Test creating a new product to trigger document middleware
    const newProduct = await Product.create({
      name: "Test Product for Middleware",
      price: 500,
      priceDiscount: 450,
      category: "Test",
      description: "Test description",
      seller: "Test Seller",
      premiumProducts: false
    });
    
    console.log('New product created:', newProduct);
    console.log('Product slug:', newProduct.productSlug);
    console.log('Days posted:', newProduct.daysPosted);
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testDocumentMiddleware();
