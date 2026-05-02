const fs = require('fs');
const path = require('path');
const Product = require('../models/productModel');
const replaceTemplate = require('../modules/replaceTemplate');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const tempOverview = fs.readFileSync(`${__dirname}/../public/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/../public/template-card.html`, 'utf-8');
const tempItem = fs.readFileSync(`${__dirname}/../public/template-item.html`, 'utf-8');

exports.checkID = (req, res, next, val) => {
  console.log(`Product id is: ${val}`);
  if (!val.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid ID format', 400));
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return next(new AppError('Missing name or price', 400));
  }
  next();
};

exports.getHomePage = (req, res) => {
  res.status(200).sendFile(`${__dirname}/../public/index.html`);
};

exports.getOverviewPage = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).set('Content-Type', 'text/html');
  const cardsHtml = products.map(el => replaceTemplate(tempCard, el)).join('');
  const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
  res.send(output);
});

exports.getItemPage = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const format = req.query.format;
  const product = await Product.findById(id);

  if (!product) {
    if (format === 'json') {
      return next(new AppError('Product not found', 404));
    }
    res.status(404).set('Content-Type', 'text/html');
    return res.send('<h1>Product not found</h1>');
  }

  if (format === 'json') {
    res.status(200).set('Content-Type', 'application/json');
    return res.send(JSON.stringify({ status: 'success', data: { product } }));
  }

  res.status(200).set('Content-Type', 'text/html');
  const output = replaceTemplate(tempItem, product);
  res.send(output);
});

exports.getAPIData = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products }
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // BUILD QUERY
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // ADVANCED FILTERING
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Product.find(JSON.parse(queryStr));

  // SORTING
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // FIELD LIMITING
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // PAGINATION
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // EXECUTE QUERY
  const products = await query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products }
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { product: newProduct }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getProductCategoryStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    { $match: { price: { $lt: 1000 } } },
    {
      $group: {
        _id: { $toUpper: '$category' },
        numProducts: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    { $sort: { avgPrice: 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});

exports.getAddProductPage = (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'add-product.html');
  res.status(200).sendFile(filePath);
};

exports.getTopCheapestProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort('price').limit(3);

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products }
  });
});

exports.createProductForm = catchAsync(async (req, res, next) => {
  await Product.create(req.body);
  res.redirect('/overview');
});
