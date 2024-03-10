import React, { useState, useEffect } from 'react';
import Layout from "./../components/Layout/Layout";
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import toast from 'react-hot-toast';


const CartPageHandle = () => {
    const [cart, setCart] = useCart();
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const [clientToken, setClientToken] = useState("");



    //total price show 
    const TotalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => {
                total = total + item.price;
            });
            // Format the total price with the Indian Rupee symbol
            return total.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
            });

        } catch (error) {
            console.log(error);
        }
    };


    //remve item from cart 
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart]
            let index = myCart.findIndex(item => item._id === pid)
            myCart.splice(index, 1)
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    };





    //get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getToken();
    }, [auth?.token]);


    //handle payments
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`, {
                nonce,
                cart,
            });

            // Update product stock quantities
            const stockUpdateResponse = await axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-stock`, {
                cart
            });

            if (stockUpdateResponse.data.success) {
                setLoading(false);

                localStorage.removeItem("cart");
                setCart([]);
                toast.success("Payment Completed Successfully ");
                navigate("/dashboard/user/orders");
            } else {
                setLoading(false);
                toast.error("Failed to update product quantities");
            }

        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error("An error occurred during payment processing.");
        }
    };



    return (
        <Layout>
            <div className="container " style={{ minHeight: "100vh", minWidth: "100vw" }}>
                <div className="row">
                    <div className="col-md-12 bg-secondary bg-gradient">
                        <h1 className='text-center bg-light p-2'>
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className='text-center'>
                            {cart?.length ?
                                `You have ${cart.length} items added in your cart
                             ${auth?.token ? "" : "Please login to checkout"}` : "Your Cart is Empty"}
                        </h4>
                    </div>
                </div>

                <div className="row" style={{ backgroundColor: "#F5F5F5" }}>
                    <div className="col-md-8">
                        <div className="m-3">
                            {
                                cart?.map((c) => (
                                    <div className="row mb-2 p-3 card flex-row " key={c._id} style={{ backgroundColor: "#C5DFF8" }}>
                                        <div className="col-md-4">
                                            <img
                                                className="card-img-top mx-auto"
                                                style={{ width: '130px', height: '130px' }}
                                                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${c._id}`}
                                                alt={c.name}
                                            />
                                        </div>
                                        <div className="col-md-8 ">
                                            <h6>Product Name :{c.name}</h6>
                                            <p>Description   :{c.description.substring(0, 30)}</p>
                                            <p>Price         : {c.price} ₹</p>
                                            <button className='btn btn-danger' onClick={() => removeCartItem(c._id)}>Remove From Cart</button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="col-md-4 text-center" >

                        <h3 className='text-center' style={{ backgroundColor: "#FBD85D" }} >Cart Summary</h3>
                        <h5> Total | Checkout | Payment</h5>
                        <hr style={{ height: "4px", borderWidth: "0", color: "##000000", backgroundColor: " #000000" }} />
                        <h4 className='text-center'>Total :{TotalPrice()} </h4>

                        {
                            auth?.user?.address ? (
                                <>
                                    <div className="mb-3">
                                        <h6 className='bg-dark bg-gradient text-white'>Current Address</h6>
                                        <h5>{auth?.user?.address}</h5>
                                        <button className='btn btn-outline-warning'
                                            onClick={() => navigate('/dashboard/user/profile')}>
                                            Update Address
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="mb-3">
                                    {
                                        auth?.token ?
                                            (<button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>Update Address </button>) : (<button className='btn btn-outline-warning' onClick={() => navigate('/login', { state: "/cart" })}>Please login to Checkout</button>)
                                    }
                                </div>
                            )
                        }
                        <div className="mt-2">
                            {!clientToken || !auth?.token || !cart?.length ? (
                                ""
                            ) : (
                                <>
                                    <DropIn
                                        options={{
                                            authorization: clientToken,
                                            paypal: {
                                                flow: "vault",
                                            },
                                        }}
                                        onInstance={(instance) => setInstance(instance)}
                                    />

                                    <button
                                        className="btn bg-warning bg-gradient"
                                        onClick={handlePayment}
                                        disabled={loading || !instance || !auth?.user?.address}
                                    >
                                        {loading ? "Processing ...." : "Make Payment"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default CartPageHandle
