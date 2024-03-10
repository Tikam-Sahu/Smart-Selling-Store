import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import '../styles/Homepage.css';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { toast } from 'react-hot-toast';


const HomePage = () => {
    const [cart, setCart] = useCart();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    //get total count product
    const getTotal = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    //filter by category
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    };

    //load more function
    const loadmore = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setProducts([...products, ...data?.products]);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    //get all category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //get filtered product
    const filterProduct = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`, {
                checked,
                radio,
            });
            setProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    //initial product display and more detail
    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);

    //for next page product
    useEffect(() => {
        if (page === 1) {
            return;
        }
        loadmore();
    }, [page]);

    //get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        if (!checked.length || !radio.length) {
            getAllProducts();
        }
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio]);

    return (
        <Layout title="HomePage Smart Selling Store App">
            <div className="row ml-md-4 home-page-body">
                <div className="col-md-2 sidebar sidebar-class">
                    {/* category filter */}
                    <h5 className="text-center filter-heading">Filter by Category</h5>
                    <div className="d-flex flex-column">
                        {categories?.map((c) => (
                            <div className="row g-1 mb-2 font-weight-normal" key={c._id}>
                                <Checkbox onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                    {c.name}
                                </Checkbox>
                            </div>
                        ))}
                    </div>

                    {/* price filter */}
                    <h5 className="text-center mt-4">Filter by Price</h5>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                            {Prices?.map((p) => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <button className="btn btn-danger" onClick={() => window.location.reload()}>
                            RESET
                        </button>
                    </div>
                </div>

                <div className="col-md-9 offset-1" style={{ marginLeft: "50px" }}>
                    <h1 className="text-center">All Products</h1>
                    <div className="d-flex flex-wrap justify-content-center">
                        {products?.map((p) => (
                            <div key={p._id} className="m-3 col-md-2" style={{ width: '17rem' }}>
                                <div className="card m-3" style={{ width: '100%' }}>
                                    <div className="card-body text-center">
                                        <img
                                            className="card-img-top mx-auto"
                                            style={{ width: '200px', height: '200px' }}
                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                            alt={p.name}
                                        />
                                        <h5 className="card-title">{p.name.substring(0, 30)}</h5>
                                        <p className="card-text">{p.description.substring(0, 50)}</p>
                                        <p className="card-text">₹ {p.price}</p>
                                        <p className="card-text">Total Product in stock :  {p.quantity}</p>
                                        <div className="button-container">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <button
                                                    className="btn btn-primary btn-sm"
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
                            </div>
                        ))}
                    </div>

                    <div className="m-2 p-3 text-center loadmore-btn-div">
                        {products && products.length < total && (
                            <button
                                className="btn btn-warning loadmore-btn-class"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page + 1);
                                }}
                            >
                                {loading ? 'Loading...' : 'Loadmore'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
