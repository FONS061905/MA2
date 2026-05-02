const mongoose = require('mongoose');
const Product = require('./models/productModel');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('DB connection successful!');
});

const products = [
  {
    name: 'Wireless Headphones',
    price: 79.99,
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation',
    seller: 'TechStore'
  },
  {
    name: 'Organic Coffee Beans',
    price: 24.99,
    category: 'Food',
    description: 'Premium organic coffee beans from Colombia',
    seller: 'CoffeeShop'
  },
  {
    name: 'Yoga Mat',
    price: 35.00,
    category: 'Sports',
    description: 'Non-slip exercise yoga mat with carrying strap',
    seller: 'FitnessGear'
  },
  {
    name: 'Smart Watch',
    price: 299.99,
    category: 'Electronics',
    description: 'Fitness tracking smartwatch with heart rate monitor',
    seller: 'TechStore'
  },
  {
    name: 'Leather Wallet',
    price: 45.50,
    category: 'Accessories',
    description: 'Genuine leather bifold wallet with RFID protection',
    seller: 'FashionHub'
  },
  {
    name: 'Running Shoes',
    price: 89.99,
    category: 'Sports',
    description: 'Lightweight running shoes with breathable mesh',
    seller: 'SportsWorld'
  },
  {
    name: 'Bluetooth Speaker',
    price: 59.99,
    category: 'Electronics',
    description: 'Portable waterproof Bluetooth speaker',
    seller: 'TechStore'
  },
  {
    name: 'Notebook Set',
    price: 15.99,
    category: 'Stationery',
    description: 'Set of 3 premium notebooks with different colors',
    seller: 'OfficeSupplies'
  },
  {
    name: 'Kitchen Knife Set',
    price: 129.99,
    category: 'Kitchen',
    description: 'Professional stainless steel knife set with wooden block',
    seller: 'KitchenPro'
  },
  {
    name: 'Backpack',
    price: 49.99,
    category: 'Accessories',
    description: 'Water-resistant laptop backpack with USB charging port',
    seller: 'TravelGear'
  },
  {
    name: 'Desk Lamp',
    price: 34.99,
    category: 'Home',
    description: 'LED desk lamp with adjustable brightness',
    seller: 'HomeDecor'
  },
  {
    name: 'Water Bottle',
    price: 19.99,
    category: 'Sports',
    description: 'Insulated stainless steel water bottle 32oz',
    seller: 'FitnessGear'
  }
];

const importData = async () => {
  try {
    await Product.deleteMany({});
    console.log('Old products deleted!');
    
    await Product.create(products);
    console.log('Products successfully loaded!');
    
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

importData();
