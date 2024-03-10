import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetails.css";
import { toast } from 'react-hot-toast';
import { useCart } from '../context/cart';

const ProductDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [cart, setCart] = useCart();

    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);

    const getProduct = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
            );
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    };

    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
            );
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <Layout>
            <div className="row container-fluid product-details">
                <div className="col-md-4 product-details-info d-flex align-items-center justify-content-center ">
                    <div className="img-fluid text-center">
                        <img
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                            className="card-img-top product-image"
                            alt={product.name}
                            height="300"
                            width="350"
                        />
                    </div>
                </div>
                <div className="col-md-8 product-details-info">
                    <h1 className="text-center">Product Details</h1>
                    <hr />
                    <h6>Name: {product.name}</h6>
                    <h6>Description: {product.description}</h6>
                    <h6 className="text-primary">
                        Price: ₹ {product?.price?.toLocaleString("en-IN")}
                    </h6>
                    <h6>Category: {product?.category?.name}</h6>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                            if (product.quantity > 0) {
                                setCart([...cart, product]);
                                localStorage.setItem('cart', JSON.stringify([...cart, product]));
                                toast.success('Item added to cart successfully');
                            }
                        }}
                        disabled={product.quantity <= 0}
                    >
                        {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            </div>
            <hr />
            <div className="container similar-products">
                <h4>Similar Products ➡️</h4>
                {relatedProducts.length < 1 && (
                    <p className="text-center">No Similar Products found</p>
                )}
                <div className="row">
                    {relatedProducts?.map((p) => (
                        <div key={p._id} className="col-md-4 mb-4">
                            <div className="card">
                                <img
                                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                    className="card-img-top product-image"
                                    alt={p.name}
                                    height="200"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name.substring(0, 30)}</h5>
                                    <h3> Price :  ₹ {p.price.toLocaleString("en-IN")} </h3>
                                    <p>{p.description.substring(0, 60)}...</p>
                                    <div className="card-name-price mt-3 d-flex justify-content-center gap-2">
                                        <button
                                            className="btn btn-info my-btn"
                                            onClick={() => navigate(`/product/${p.slug}`)}
                                        >
                                            More Details
                                        </button>
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

export default ProductDetails;
