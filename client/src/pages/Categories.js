import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import useCategory from '../hooks/useCategory';
import '../styles/Categories.css';
import { useCart } from '../context/cart';
import { toast } from 'react-hot-toast';


const Categories = () => {
    const [cart, setCart] = useCart();
    const categories = useCategory();
    const [separate_variable, setSeparateVariable] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});

    useEffect(() => {
        // Extract the 'name' property from the 'categories' object
        const names = Object.values(categories).map((category) => category.name);
        // Modify names with hyphen-separated values for multiple-word names
        const modifiedNames = names.map((name) => name.replace(/\s+/g, '-'));
        setSeparateVariable(modifiedNames);
    }, [categories]);

    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProductByCategory(); // Pass the category slug as an argument
    }, [separate_variable]);

    const getProductByCategory = async () => {
        try {
            const productsByCategory = {};

            await Promise.all(
                separate_variable.map(async (cat, index) => {
                    // console.log(cat);

                    try {
                        const { data } = await axios.get(
                            `${process.env.REACT_APP_API}/api/v1/product/product-category/${cat}`
                        );
                        productsByCategory[cat] = data?.products;
                    } catch (error) {
                        console.log(error);
                    }
                })
            );

            // Now productsByCategory object contains the products for each category
            // console.log(productsByCategory);
            setProductsByCategory(productsByCategory);
            // You can set the state or do other processing with the productsByCategory object here
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout title={'All Categories'}>
            <div className="container-fluid container-fluid-class">
                <div className="container">
                    {separate_variable.map((cat, index) => (
                        <div key={index}>
                            <div className="row ">
                                <div className="col-md-12 mb-3 category-start-row">
                                    {/* <div className="d-block">
                                    <Link to={`/category/${cat}`} className="category-div category-column">
                                        {cat}
                                    </Link>
                                </div> */}
                                    {/* Modify */}
                                    {productsByCategory[cat] && (
                                        <>
                                            <div className="row">
                                                <div className="col-12">
                                                    <h3 className="text-center text-info custom-shadow-blue">
                                                        Category: {cat.replace(/-/g, ' ')}
                                                    </h3>
                                                    <h6 className="text-center text-warning custom-shadow-blue">
                                                        {productsByCategory[cat].length} result(s) found
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row row-cols-1 row-cols-md-3 g-4">
                                                {productsByCategory[cat].map((p) => (
                                                    <div key={p._id} className="col">
                                                        <div className="card h-100 w-60 d-flex justify-content-center align-items-center">

                                                            <img
                                                                className="card-img-top img-fluid"
                                                                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                                                alt={p.name}
                                                                style={{ height: '150px', width: '100px', objectFit: 'contain' }} // Use objectFit: "contain"
                                                            />
                                                            <div className="card-body d-flex flex-column justify-content-between">
                                                                {/* Use flex-column and justify-content-between classes */}
                                                                <div>
                                                                    <h5 className="card-title">Name : {p.name}</h5>
                                                                    <p className="card-text">Description {p.description.substring(0, 100)}</p>
                                                                    <p className="card-text">Price : ₹ {p.price}</p>
                                                                </div>
                                                                <div className="d-flex justify-content-between">
                                                                    {/* Use justify-content-between class */}
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={() => navigate(`/product/${p.slug}`)}
                                                                        style={{ marginRight: '20px' }}
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
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Categories;
