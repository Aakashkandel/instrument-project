import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './Components/Pages/Index';
import Register from './Components/Pages/Register';
import Login from './Components/Pages/Login';
import Vendor from './Components/vendor/Index';
import User from './Components/user/IndexLoggedin';
import AddProduct from "./Components/vendor/AddProduct"
import VendorProfile from"./Components/Pages/Profile";
import PageRouter from './Components/PageRouter';
import AdminRouter from './Components/AdminRouter';


import VendorProtected from './ProtectedRouter/VendorRouter';
import UserRouter from './ProtectedRouter/UserRouter';
import PageNotFound from './Components/Global/PageNotFound';
import AddCart from './Components/user/AddCart';
import pageRouterUser from './Components/pageRouterUser';
import CheckOut from './Components/user/CheckOut';
import BankAdd from './Components/admin/BankAdd';
import Esewacheckout from './Components/user/Esewacheckout';
import Userorder from './Components/user/Userorder';
import Shop from './Components/user/Shop';
import Order from './Components/vendor/Order';
import Product from './Components/vendor/Product';
import Productview from './Components/user/Productview';
import OrderProduct from './Components/vendor/OrderProduct';
import Profile from './Components/user/Profile';
import EditProduct from './Components/vendor/EditProduct';
import AdminEditProduct from './Components/admin/EditProduct';
import Adminrouter from './ProtectedRouter/Adminrouter';
import AdminDashboard from './Components/admin/AdminDashboard';
import AdminLogin from './Components/admin/AdminLogin';
import Allproduct from './Components/admin/Product';
import Vendors from './Components/admin/Vendors';
import Users from './Components/admin/Users';
import Ordert from './Components/admin/Order';
import AboutUs from './Components/Aboutus';
import EditVendor from './Components/admin/EditVendor';
import UserEdit from './Components/admin/UserEdit';
// import { orderplace } from '../../server/controllers/OrderController';



// import IndexLoggedin from './Components/user/IndexLoggedin';
// import Forgotpassword from './Components/user/Forgotpassword';
// import OtpEnter from './Components/user/OtpEnter';
// import Changepassword from './Components/user/Changepassword';

function App() {
  return (
    <BrowserRouter>
      <div className="">


        {/* <UserNavbar/> */}
        <Routes>
      <Route path="/aboutus" element={<AboutUs/>}/>

          <Route path='/' element={<Index />} />
          <Route path='productview' element={<UserRouter Component={Productview}/>}/>

          <Route path='/vendors/' element={<VendorProtected Component={PageRouter}/>}>
            <Route index element={<Vendor/>}/>
            <Route path='dashboard'  element={<VendorProtected Component={Vendor}/>} />
            <Route path='addproduct'  element={<VendorProtected Component={AddProduct}/>} />
            <Route path='profile' element={<VendorProtected Component={VendorProfile} />} />
            <Route path='order' element={<VendorProtected Component={Order}/>} />
            <Route path='product' element={<VendorProtected Component={Product}/>} />
            <Route path='productview/:id' element={<VendorProtected Component={OrderProduct}/>}/>
            <Route path='productedit/:id' element={<VendorProtected Component={EditProduct}/>}/>
            
         
          </Route>
          <Route path='/users/' element={<UserRouter Component={pageRouterUser} />} >

            <Route index element={<User/>}/>
            <Route path='addtocart' element={<UserRouter Component={AddCart}/>}/>
        
            <Route path='checkout' element={<UserRouter Component={CheckOut}/>}/>
            <Route path='esewacheckout' element={<UserRouter Component={Esewacheckout}/>}/>
            <Route path='order' element={<UserRouter Component={Userorder}/>}/>
            <Route path='shop' element={<UserRouter Component={Shop}/>}/>
            <Route path='productview/:id' element={<UserRouter Component={Productview}/>}/>
            <Route path="profile" element={<UserRouter Component={Profile} />} />
    
           
           

          </Route>
          <Route path="admin/login" element={<Adminrouter Component={AdminLogin}/>}/>
          
          <Route path="/admin/" element={<Adminrouter Component={AdminRouter}/>}>
          <Route index element={<AdminDashboard/>}/>
          <Route path="dashboard" element={<Adminrouter Component={AdminDashboard}/>}/>
          <Route path="product" element={<Adminrouter Component={Allproduct}/>}/>
          <Route path="productedit/:id" element={<Adminrouter Component={AdminEditProduct}/>}/>
          <Route path="allvendor" element={<Adminrouter Component={Vendors}/>}/>
          <Route path="vendoredit/:id" element={<Adminrouter Component={EditVendor}/>}/>
          <Route path="users" element={<Adminrouter Component={Users}/>}/>
          <Route path="useredit/:id" element={<Adminrouter Component={UserEdit}/>}/>
          <Route path="orders" element={<Adminrouter Component={Ordert}/>}/>
          
            
          </Route>



          <Route path="/addbank" element={<BankAdd/>} />


          <Route path='register' element={<Register />} />
          <Route path='login' element={<Login />} />

          {/*<Route path='indexloggedin' element={<IndexLoggedin/>}/>
          <Route path='forgotpassword' element={<Forgotpassword/>}/>
          <Route path='confirmotp' element={<OtpEnter/>}/>
          <Route path='changepassword' element={<Changepassword/>}/> */}
          <Route path="*" element={<PageNotFound/>}/>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
