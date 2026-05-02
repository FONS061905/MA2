const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const productController = require('./controllers/productController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) SECURITY — HTTP headers
app.use(helmet());

// 2) LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) RATE LIMITING — 100 requests per hour per IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// 4) BODY PARSERS & COOKIE PARSER
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5) DATA SANITIZATION against NoSQL query injection
// express-mongo-sanitize can't write req.query in Express 5 (read-only), so sanitize body/params only
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// 6) DATA SANITIZATION against XSS
// xss-clean can't write req.query in Express 5, so use xss package directly on body/params
const sanitizeXSS = obj => {
  if (!obj || typeof obj !== 'object') return obj;
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'string') obj[key] = xss(obj[key]);
    else if (typeof obj[key] === 'object') sanitizeXSS(obj[key]);
  });
  return obj;
};
app.use((req, res, next) => {
  if (req.body) sanitizeXSS(req.body);
  if (req.params) sanitizeXSS(req.params);
  next();
});

// 7) PREVENT HTTP PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: ['price', 'priceDiscount', 'category', 'seller', 'premiumProducts']
  })
);

// 8) STATIC FILES
app.use(express.static(`${__dirname}/public`));

// 9) PAGE ROUTES
app.route('/').get(productController.getHomePage);
app.route('/overview').get(productController.getOverviewPage);
app.route('/item').get(productController.getItemPage);

// 10) API ROUTES
app.use('/api/v1/products', productRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/users', userRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Marketplace API is running'
  });
});

app.route('/api').get(productController.getAPIData);

app.route('/add-product')
  .get(productController.getAddProductPage)
  .post(productController.createProductForm);

// 11) UNHANDLED ROUTES
app.all('/{*path}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 12) GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
