import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth'; // Make sure this path is correct
import moment from 'moment';
import { Modal } from 'antd';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth(); // Using the custom auth hook
    const [showCancellationForm, setShowCancellationForm] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
    });

    const getOrders = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`);
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancellation = async (orderId) => {
        try {
            const changeStatusUrl = `${process.env.REACT_APP_API}/api/v1/product/change-order-status/${orderId}`;

            const response = await axios.put(changeStatusUrl);

            if (response.status === 200) {
                // Update the local orders state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, status: 'cancel' } : order
                    )
                );
                // Close the cancellation form
                setShowCancellationForm(null);

                // Call the endpoint to update product quantity
                await axios.put(
                    `${process.env.REACT_APP_API}/api/v1/product/after-cancel-update-product-stock/${orderId}`
                );


                //detail save of cancel product
                // Inside the handleCancellation function
                await axios.post(
                    `${process.env.REACT_APP_API}/api/v1/product/after-cancel-detail-save/${orderId}`,
                    {
                        accountHolderName: paymentDetails.accountHolderName,
                        accountNumber: paymentDetails.accountNumber,
                        ifscCode: paymentDetails.ifscCode,
                        user_email: auth?.user?.email
                    }
                );


            }
        } catch (error) {
            console.log(error);
        }
    };



    useEffect(() => {
        if (auth.token) {
            getOrders();
        }
    }, [auth?.token]);

    return (
        <Layout title="Your Orders">
            <div className="container-fluid p-3 m-3">
                <div className="row">
                    <div className="col-md-3">
                        <div className='mt-5'>
                            <UserMenu />
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className='mt-5'>
                            <h5 className='text-center'> Your All Orders</h5>
                            {orders?.map((order, index) => {
                                return (
                                    <div className='border shadow' key={order._id}>
                                        <table className='table table table-striped table-hover'>
                                            <caption>List of Products</caption>
                                            <thead className='table-info'>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Buyer</th>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Payment</th>
                                                    <th scope="col">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th>{index + 1}</th>
                                                    <th>
                                                        {order.status === 'cancel' ? 'cancel' : order.status}
                                                    </th>
                                                    <th>{order.buyer.name}</th>
                                                    <th>{moment(order.createAt).fromNow()}</th>
                                                    <th>{order.payment.success ? "success" : "Failed"}</th>
                                                    <th>{order.products.length}</th>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="container">
                                            {order.products.map((product_map_var, index_inner_map_var) => (
                                                <div className="row mb-2 p-3 card flex-row" key={product_map_var._id}>
                                                    <div className="col-md-4">
                                                        <img
                                                            className="card-img-top mx-auto"
                                                            style={{ width: '100px', height: '100px' }}
                                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product_map_var._id}`}
                                                            alt={product_map_var.name}
                                                        />
                                                    </div>
                                                    <div className="col-md-8 ">
                                                        <h5>Product Name: {product_map_var.name}</h5>
                                                        <p>Product Description: {product_map_var.description.substring(0, 40)}</p>
                                                        <p>Product Price: {product_map_var.price} ₹</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {order.status !== 'cancel' && (
                                            <div>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => setShowCancellationForm(order._id)}
                                                    disabled={order.status === 'cancel'}
                                                >
                                                    Cancel Order
                                                </button>
                                                <Modal
                                                    title="Provide Payment Details to Cancel Order"
                                                    visible={showCancellationForm === order._id}
                                                    onCancel={() => setShowCancellationForm(null)}
                                                    footer={[
                                                        <button
                                                            key="cancel"
                                                            className="btn btn-secondary"
                                                            onClick={() => setShowCancellationForm(null)}
                                                        >
                                                            Cancel
                                                        </button>,
                                                        <button
                                                            key="submit"
                                                            className="btn btn-primary"
                                                            onClick={() => handleCancellation(order._id)}
                                                        >
                                                            Submit
                                                        </button>
                                                    ]}
                                                >
                                                    <div>
                                                        <div className="form-group">
                                                            <label>Account Holder Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={paymentDetails.accountHolderName}
                                                                onChange={(e) =>
                                                                    setPaymentDetails({ ...paymentDetails, accountHolderName: e.target.value })
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Account Number</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={paymentDetails.accountNumber}
                                                                onChange={(e) =>
                                                                    setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>IFSC Code</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={paymentDetails.ifscCode}
                                                                onChange={(e) =>
                                                                    setPaymentDetails({ ...paymentDetails, ifscCode: e.target.value })
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </Modal>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
