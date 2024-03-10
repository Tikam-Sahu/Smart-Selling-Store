import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import '../../styles/Products.css';
import { useCart } from '../../context/cart.js';


const Products = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useCart();

    //get all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    //lifecycle method
    useEffect(() => {
        getAllProducts();
    }, []);

    // Group products into rows of three
    const groupProductsIntoRows = (products) => {
        const rows = [];
        const numProducts = products.length;
        const numColumns = 3;
        const numRows = Math.ceil(numProducts / numColumns);

        for (let i = 0; i < numRows; i++) {
            const startIndex = i * numColumns;
            const endIndex = startIndex + numColumns;
            const row = products.slice(startIndex, endIndex);
            rows.push(row);
        }

        return rows;
    };

    return (
        <Layout>
            <div className="row mt-5" style={{ backgroundColor: '#FAF0E4' }}>
                <div className="col-md-3">
                    <div className="mt-5 ">
                        <AdminMenu />
                    </div>

                </div>
                <div className="col-md-9">
                    <div className="mt-5">
                        <h5 className="text-center bg-secondary bg-gradient">All product List</h5>


                        {/* {groupProductsIntoRows(products)?.map((row, rowIndex) => ( */}
                        {products.map((p) => (
                            <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`}>
                                <div className="row product-detail-row mt-3" key={p._id} style={{ height: "auto" }}>
                                    <div className="col-md-3">
                                        <img className="product-img" src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} alt={p.name} style={{ height: '100px', maxWidth: '100px' }} />
                                    </div>

                                    <div className="col-md-9">
                                        <h6 className="product-name">Product Name    :{p.name.substring(0, 30)}</h6>
                                        <h6 className="product-price">Price          : ${p.price}</h6>
                                        <p className="product-description">Description :{p.description.substring(0, 30)}</p>
                                        <p className="product-description">Product in Stock   : {p.quantity}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* ))} */}
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default Products;
