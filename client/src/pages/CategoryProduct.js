// CategoryProduct.js
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CategoryProduct.css';
import toast from 'react-hot-toast';
import { useCart } from '../context/cart';


const CategoryProduct = () => {
    const [cart, setCart] = useCart();
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState({});


    useEffect(() => {
        if (params?.slug) getProductByCategory();
    }, [params?.slug]);

    const getProductByCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className="container" style={{ marginTop: "100px" }}>
                <div className="row ">
                    <div className="col-12">
                        <h3 className="text-center text-info  custom-shadow-blue ">Category: {category.name}</h3>
                        <h6 className="text-center text-warning custom-shadow-blue">{products.length} result(s) found</h6>
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {products.map((p) => (
                        <div key={p._id} className="col">
                            <div className="card h-100 d-flex justify-content-center align-items-center"> {/* Use justify-content-center and align-items-center */}
                                <img
                                    className="card-img-top img-fluid"
                                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                    alt={p.name}
                                    style={{ height: "150px", width: "150px", objectFit: "contain" }} // Use objectFit: "contain"
                                />
                                <div className="card-body d-flex flex-column justify-content-between"> {/* Use flex-column and justify-content-between classes */}
                                    <div>
                                        <h5 className="card-title">Name : {p.name}</h5>
                                        <p className="card-text">Description {p.description.substring(0, 50)}</p>
                                        <p className="card-text">Price : ₹ {p.price}</p>
                                    </div>

                                    <div className="d-flex justify-content-between "> {/* Use justify-content-between class */}
                                        <button className="btn btn-primary" onClick={() => navigate(`/product/${p.slug}`)} style={{ marginRight: "20px" }}>More Details</button>

                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => {
                                                if (p.quantity > 0) {
                                                    setCart([...cart, p]);
                                                    localStorage.setItem('cart', JSON.stringify([...cart, p]));
                                                    toast.success('Item added to cart successfully');
                                                }
                                            }}
                                            disabled={p.quantity <= 0}
                                        >
                                            {p.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                                        </button>

                                    </div>


                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default CategoryProduct;
