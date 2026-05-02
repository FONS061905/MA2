const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router.param('id', productController.checkID);

router
  .route('/top-3-cheapest')
  .get(productController.getTopCheapestProducts);

router
  .route('/product-category')
  .get(productController.getProductCategoryStats);

router
  .route('/')
  .get(authController.protect, productController.getAllProducts)
  .post(productController.checkBody, productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

module.exports = router;
