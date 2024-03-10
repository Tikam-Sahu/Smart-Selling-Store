import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import {
    createProductController,
    deleteProductController,
    getProductController,
    getSingleProductController,
    productCountController,
    productFilterController,
    productListController,
    productPhotoController,
    searchProductController,
    updateProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    braintreePaymentController,
    updateProductStockController,
    changeProductStatusController,
    afterCancelUpdateProductStockController,
    savePaymentDetailsController,
    getAllCancelOrders,
    cancelOrderStatusController,


} from '../controllers/productController.js';
import formidable from 'express-formidable';


//initialize router from expressjs
const router = express.Router()



//routes for create product 
//herer - isAdmin, requireSignIn is a middlewares
// formidable() - package used for handle photo store retreive
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

//update product details route
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

//get products
router.get('/get-product', getProductController);

//get single product
router.get('/get-product/:slug', getSingleProductController);

//get photo router
router.get('/product-photo/:pid', productPhotoController);

//delete product
router.delete('/delete-product/:pid', deleteProductController);

//filter product
router.post('/product-filters', productFilterController);

//product count
router.get('/product-count', productCountController);

//product per-page
router.get('/product-list/:page', productListController);

//serch product route
router.get('/search/:keyword', searchProductController);

//similar product display recommandation
router.get("/related-product/:pid/:cid", relatedProductController);

//category wise product 
router.get("/product-category/:slug", productCategoryController);


//payment routes
//token
router.get('/braintree/token', braintreeTokenController)

//payments routes
router.post('/braintree/payment', requireSignIn, braintreePaymentController)

//update stock route for stock details
router.put('/update-stock', requireSignIn, updateProductStockController);

// Route for cancelling orders
router.put('/change-order-status/:orderId', requireSignIn, changeProductStatusController);

//product stock update after cancel
router.put('/after-cancel-update-product-stock/:orderId', requireSignIn, afterCancelUpdateProductStockController);

// Route for saving cancel order details
router.post('/after-cancel-detail-save/:orderId', requireSignIn, savePaymentDetailsController);



//all cancel orders get 
router.get('/all-cancel-orders', requireSignIn, isAdmin, getAllCancelOrders);


router.put("/cancel-order-status/:orderId",
    requireSignIn,
    isAdmin,
    cancelOrderStatusController
);

export default router