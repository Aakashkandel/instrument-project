const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/UserController');
const productController = require('../controllers/ProductController');
const cartController = require('../controllers/CartController');
const profileController = require('../controllers/ProfileController');
const orderplaceController = require('../controllers/OrderController');
const adminbankController = require('../controllers/AdminBankController');
const auth = require('../middleware/auth');
const multer = require('multer');
const DashboardController = require('../controllers/DashboardController');
const AdminDashboardController= require('../controllers/AdminDashboard');
const AdminController=require('../controllers/AdminLogin');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage });
router.get('/dashboard',auth, DashboardController.dashboard);

// User Routes
router.post('/registerapi', userControllers.register);
router.post('/loginapi', userControllers.login);
router.post('/forgotpasswordapi', userControllers.forgotpassword);
router.post('/changepasswordapi', userControllers.changepassword);
router.get('/userprofileapi', auth, userControllers.userprofile);
router.post('/userprofileapiimage', auth, upload.single('profileimage'), userControllers.userprofileimage);
router.post('/profilepasswordchangeapi', auth, userControllers.profilepasswordchange);
router.post('/vendorprofileapiimage', auth, upload.single('profileimage'), userControllers.vendorprofileimage);
router.post('/vendorpasswordchangeapi', auth, userControllers.vendorpasswordchange);

// Product Routes
router.post('/productuploadsapi', auth, upload.single('image'), productController.productuploads);
router.get('/fetchproductbyvendorapi', auth, productController.fetchproductbyvendor);
router.get('/fetchproductbyidapi/:id', auth, productController.fetchproductbyid);
router.get('/allproductapi', productController.allProduct);
router.post('/productupdate/:id', auth, upload.single('image'), productController.uploadproduct);
router.get('/deleteproductapi/:id', auth, productController.deleteproduct);

// Order Routes
router.get('/fetchorderbyvendor', auth, orderplaceController.fetchorderbyvendor);
router.get('/fetchorderbyvendor/:id', auth, orderplaceController.fetchorderbyvendororderid);
router.post('/orderplaceapi', auth, orderplaceController.orderplace);
router.get('/fetchorderapi', auth, orderplaceController.fetchorder);
router.get('/esewapaymentverifyapi', orderplaceController.EsewaPaymentVerify);
router.delete('/deleteorderapi/:id', auth, orderplaceController.deleteorder);
router.post('/adminorderapi/:id', auth, orderplaceController.adminorder);

router.get('/fetchallorderapi', auth, orderplaceController.fetchallorder);

// Cart Routes
router.post('/addcartapi', auth, cartController.add_cart);
router.get('/fetchcartapi', auth, cartController.fetch_cart);
router.delete('/deletecartapi/:id', auth, cartController.delete_cart);
router.put('/increasequantity/:id', auth, cartController.increasequantity);
router.put('/decreasequantity/:id', auth, cartController.decreasequantity);

// Profile Routes
router.post('/profileapi', auth, profileController.profile);
router.post('/addesewaapi', auth, profileController.addesewa);
router.post('/updateesewaapi', auth, profileController.updateesewa);

// Admin Bank Routes
router.post('/addbankapi', adminbankController.addbank);

//admin login
router.post('/adminloginapi', AdminController.adminlogin);
router.get('/adminregisterapi', AdminController.updateadmin);
router.get('/adminvendorapi/:id',auth, AdminController.vendoredit);
router.post('/adminvendorapi/:id',auth, AdminController.vendorupdate);
router.get('/adminusers/:id',auth, AdminController.getUserById);
router.post('/adminusersupdate/:id',auth,upload.single('profileimage'),AdminController.updateUserById);
// router.get('/adminproductapi', AdminController.allProduct);
// router.get('/adminorderapi', AdminController.fetchorder);
router.get('/adminvendorapi', auth,userControllers.fetchallvendor);
router.get('/adminvendorapi/:id', auth,userControllers.deletevendor);
router.get('/fetchalluserapi', auth,userControllers.fetchalluser);
router.get('/adminusersdelete/:id', auth,userControllers.deleteuser);
// router.get('/adminuserapi', AdminController.fetchuser);
// router.get()

//admin dashboard
router.get('/totalusers',auth,AdminDashboardController.totaluser);
router.get('/totalvendors',auth,AdminDashboardController.totalvendor);
router.get('/totalorders',auth,AdminDashboardController.totalorder);
router.get('/totalproducts',auth,AdminDashboardController.totalproduct);
router.get('/latestproducts',auth,AdminDashboardController.latestproduct);
router.get('/latestorders',auth,AdminDashboardController.latestorder);
router.get('/latestusers',auth,AdminDashboardController.latestuser);





module.exports = router;
