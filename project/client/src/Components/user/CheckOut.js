import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productFetch } from '../features/Addtocart';
import esewa from '../Assets/esewa.png';
import { useFormik } from 'formik';
import Checkoutvalidate from '../../schemas/checkout';
import axios from '../api/api';
import { ToastContainer, toast } from 'react-toastify';

export default function CheckOut() {
  const [orderresult, setOrderresult] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionData = useSelector(state => state.authenticate);
  const { success, cartItems } = useSelector(state => state.cart);

  const [cart, setCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    dispatch(productFetch());
  }, [dispatch]);

  useEffect(() => {
    if (success === 'completed') {
      setCart(cartItems.allcart);
      let total = 0;
      cart.forEach(item => {
        total += item.quantity*item.product.price.sales_price;
      });
      setTotalCost(total);
    }
  }, [success, cartItems]);

  const initialValues = {
    name: sessionData.userInfo.name,
    email: sessionData.userInfo.email,
    street: '',
    city: '',
    state: '',
    postal: '',
    paymethod: 'cash',
    remember: false
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: Checkoutvalidate,
    onSubmit: (values) => {
      const shippingDetails = {
        name: values.name,
        email: values.email,
        street: values.street,
        city: values.city,
        state: values.state,
        postal: values.postal
      };
      const customer = sessionData.userInfo._id;
      const paymentMethod = values.paymethod;
      const items = cart.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price.sales_price
      }));
      console.log(paymentMethod, items, totalCost, shippingDetails, customer);
      const totalAmount = totalCost;
      const paymentStatus = 'pending';

      const order = { customer, shippingDetails, paymentMethod, items, totalAmount, paymentStatus};

      axios.post('orderplaceapi', order, {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.paymentmethod =='cod') {
            navigate('../order');
          }
          else {
            setOrderresult(res.data);
            if (res.data.success) {
              if (res.data.payment) {
                console.log('Form values:', {
                  amount: totalCost,
                  transaction_uuid: res.data.purchasedItemData?._id,
                  signed_field_names: res.data.payment?.signed_field_names,
                  signature: res.data.payment?.signature,
                });

                // Set form values before submitting
                document.getElementById('amount').value = totalCost;
                document.getElementById('total_amount').value = res.data.purchasedItemData?.totalAmount;
                document.getElementById('transaction_uuid').value = res.data.purchasedItemData?._id;
                document.getElementById('signed_field_names').value = res.data.payment?.signed_field_names;
                document.getElementById('signature').value = res.data.payment?.signature;

                document.getElementById('esewa_form').submit();
              }
            }
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          toast.error(`Error: ${error.response.data.message}`);
        });
    }
  });



  const sessiondata = useSelector(state => state.authenticate);
    let slug = ""; 
    const name = sessiondata.userInfo.name;
 
    if (name != null) {
        
        slug = name.replace(" ", "-");
    }



  return (
    <div>
      <ToastContainer/>

      <div class="font-[sans-serif] bg-white">
        <div class="max-lg:max-w-xl mx-auto w-full">
          <div class="grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 max-lg:order-1 p-6 !pr-0 max-w-4xl mx-auto w-full">
              <div class="text-center max-lg:hidden">
                <h2 class="text-3xl font-extrabold text-gray-800 inline-block border-b border-gray-800 pb-1">Checkout</h2>
              </div>

              <form class="lg:mt-16" onSubmit={handleSubmit}>
                <div >
                  <h2 class="text-xl font-bold text-gray-800">Shipping info</h2>

                  <div class="grid sm:grid-cols-2 gap-8 mt-8">
                    <input type="text" placeholder="Name" value={values.name} onChange={handleChange} onBlur={handleBlur} name="name"
                      class="px-2 pb-2 bg-white  text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none" />
                    {errors.name && touched.name ? <div class="text-red-500">{errors.name}</div> : null}
                  </div>

                  <div>
                    <input type="email" placeholder="Email address" value={values.email} onChange={handleChange} onBlur={handleBlur} name="email"
                      class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none" />
                    {errors.email && touched.email ? <div class="text-red-500">{errors.email}</div> : null}
                  </div> 
                  <div>
                    <input type="text" placeholder="Street address" vlaue={values.street} onChange={handleChange} onBlur={handleBlur} name="street"
                      class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none" />
                    {errors.street && touched.street ? <div class="text-red-500">{errors.street}</div> : null}
                  </div>
                  <div>
                    <input type="text" placeholder="City" value={values.city} onChange={handleChange} onBlur={handleBlur} name="city"
                      class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none" />
                    {errors.city && touched.city ? <div class="text-red-500">{errors.city}</div> : null}
                  </div>
                  <div>
                    <div>
                      <input type="text" placeholder="State" value={values.state} onChange={handleChange} onBlur={handleBlur} name="state"
                        class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none" />
                      {errors.state && touched.state ? <div class="text-red-500">{errors.state}</div> : null}
                    </div>
                    <div>
                      <input type="number" placeholder="Postal code" value={values.postal} onChange={handleChange} onBlur={handleBlur} name="postal"
                        class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none" />
                      {errors.postal && touched.postal ? <div class="text-red-500">{errors.postal}</div> : null}
                    </div>
                  </div>
                </div>

                <div class="mt-16">
                  <h2 class="text-xl font-bold text-gray-800">Payment method</h2>

                  <div>
                    <div class="grid gap-4 sm:grid-cols-2 mt-4">
                      <div class="flex items-center">
                        <input type="radio" name="paymethod" class="w-5 h-5 cursor-pointer" id="card" value="cash" checked={values.paymethod === "cash"} onChange={handleChange} onBlur={handleBlur}  />
                        <label for="card" class="ml-4 flex gap-2 cursor-pointer">
                          <img src={esewa} class="w-12" alt="card1" />

                        </label>
                      </div>

                      <div class="flex items-center">
                        <input type="radio" name="paymethod" class="w-5 h-5 cursor-pointer" id="paypal" value="cod"  checked={values.paymethod === "cod"} onChange={handleChange} onBlur={handleBlur} />
                        <label for="paypal" class="ml-4 flex gap-2 cursor-pointer">
                          <h1>Cash On Delivery</h1>
                        </label>

                      </div>

                    </div>
                    {errors.paymethod && touched.paymethod ? <div class="text-red-500">{errors.paymethod}</div> : null}
                  </div>

                  <div>
                    <div class="grid gap-8 mt-8">





                      <div class="flex items-center">
                        <input id="remember-me" name="remember" required type="checkbox" class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" value={values.remember} onChange={handleChange} onBlur={handleBlur} />
                        <label for="remember-me" class="ml-3 block text-sm">
                          I accept the <a href="javascript:void(0);" class="text-blue-600 font-semibold hover:underline ml-1">Terms and Conditions</a>
                        </label>
                      </div>
                    </div>
                    {errors.remember && touched.remember ? <div class="text-red-500">{errors.remember}</div> : null}
                  </div>
                </div>

                <div class="flex flex-wrap gap-4 mt-8">
                  <button type="button" class="min-w-[150px] px-6 py-3.5 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Back</button>
                  <button type="submit" name="submit" class="min-w-[150px] px-6 py-3.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900">Confirm payment Rs {totalCost}</button>
                </div>
              </form>
            </div>

            <div class="bg-gray-100 lg:h-screen lg:sticky lg:top-0">
              <div class="relative h-full">
                <div class="p-6 lg:overflow-auto lg:h-[calc(100vh-60px)] max-lg:mb-8">
                  <h2 class="text-xl font-bold text-gray-800">Order Summary</h2>

                  <div class="space-y-8 mt-8">
                    {success == "completed" ? (


                      cartItems.allcart.map((p, index) => (

                        <div key={index} class="flex flex-col gap-4">
                          <div class="max-w-[170px] p-4 shrink-0 bg-gray-200 rounded-lg">
                            <img src={`http://localhost:5000/${p.product.image}`} class="w-full object-contain" />
                          </div>

                          <div class="w-full">
                            <h3 class="text-base text-gray-800 font-bold">{p.product.title}</h3>

                            <ul class="text-sm text-gray-800 space-y-2 mt-2">
                              <li class="flex flex-wrap gap-4">Quantity <span class="ml-auto">{p.quantity}</span></li>
                              <li class="flex flex-wrap gap-4"> Price <span class="ml-auto">{p.product.price.sales_price}</span></li>
                              <li class="flex flex-wrap gap-4">Total Price <span class="ml-auto">{(p.quantity)*(p.product.price.sales_price)}</span></li>
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (<div>Cart is empty</div>)

                    }






                  </div>
                </div>



                <div class="lg:absolute lg:left-0 lg:bottom-0 bg-gray-200 w-full p-4">

                  <h4 class="flex flex-wrap gap-4 text-base text-gray-800 font-bold">Total <span class="ml-auto">Rs {totalCost}</span></h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>






      <form
        id="esewa_form" hidden
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
        target="_blank"
      >
        <br /><br />
        <table>
          <tbody>
            <tr>
              <td><strong>Parameter </strong></td>
              <td><strong>Value</strong></td>
            </tr>
            <tr>
              <td>Amount:</td>
              <td>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value="500"
                  class="form"
                  required=""
                />
                <br />
              </td>
            </tr>
            <tr>
              <td>Tax Amount:</td>
              <td>
                <input
                  type="text"
                  id="tax_amount"
                  name="tax_amount"
                  value="0"
                  class="form"
                  required=""
                />
              </td>
            </tr>
            <tr>
              <td>Total Amount:</td>
              <td>
                <input
                  type="text"
                  id="total_amount"
                  name="total_amount"
                  value="500"
                  class="form"
                  required=""
                />
              </td>
            </tr>
            <tr>
              <td>Transaction UUID (Item Purchase ID):</td>
              <td>
                <input
                  type="text"
                  id="transaction_uuid"
                  name="transaction_uuid"
                  value=""
                  class="form"
                  required=""
                />
              </td>
            </tr>
            <tr>
              <td>Product Code:</td>
              <td>
                <input
                  type="text"
                  id="product_code"
                  name="product_code"
                  value="EPAYTEST"
                  class="form"
                  required=""
                />
              </td>
            </tr>
            <tr>
              <td>Product Service Charge:</td>
              <td>
                <input
                  type="text"
                  id="product_service_charge"
                  name="product_service_charge"
                  value="0"
                  class="form"
                  required=""
                />
              </td>
            </tr>
            <tr>
              <td>Product Delivery Charge:</td>
              <td>
                <input
                  type="text"
                  id="product_delivery_charge"
                  name="product_delivery_charge"
                  value="0"
                  class="form"
                  required=""
                />
              </td>
            </tr>
            <tr>
              <td>Success URL:</td>
              <td>
                <input
                  type="text"
                  id="success_url"
                  name="success_url"
                  value="http://localhost:3000/users/esewacheckout"
                  // value="http://localhost:5000/esewapaymentverifyapi"
                  class="form"
                  required=""
                />
              </td>
            </tr>
            <tr>
              <td>Failure URL:</td>
              <td>
                <input
                  type="text"
                  id="failure_url"
                  name="failure_url"
                  value="https://developer.esewa.com.np/failure"
                  class="form"
                  required=""
                />
              </td>
            </tr>
            <tr>
              <td>signed Field Names:</td>
              <td>
                <input
                  type="text"
                  id="signed_field_names"
                  name="signed_field_names"
                  value="amount,total_amount,transaction_uuid,product_code"
                  class="form"
                  required=""
                />
              </td>
            </tr>
            <tr>
              <td>Signature:</td>
              <td>
                <input
                  type="text"
                  id="signature"
                  name="signature"
                  value=""
                  class="form"
                  required=""
                />
              </td>
            </tr>
            <tr>
              <td>Secret Key:</td>
              <td>
                <input
                  type="text"
                  id="secret"
                  name="secret"
                  value="8gBm/:&EnhH.1/q"
                  class="form"
                  required=""
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input
          value=" Pay with eSewa "
          type="submit"
          class="button"

        />
      </form>


    </div>
  )
}
