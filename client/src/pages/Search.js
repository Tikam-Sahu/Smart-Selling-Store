import React, { useState } from 'react';
import Layout from "./../components/Layout/Layout";
import { useSearch } from '../context/search';
import '../styles/Search.css';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/cart';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [values, setValues] = useSearch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModel = () => {
    setSelectedProduct(null);
  };

  return (

    <Layout title={"Search Results"}>
      <div className='container'>
        <div className='text-center'>
          <h1>Search Results</h1>
          <div className="mb-4">
            <h6 className={`text-${values?.results.length < 1 ? 'danger' : 'success'}`}>
              {values?.results.length < 1 ? 'No product found' : `Found ${values?.results.length} Product`}
            </h6>
          </div>

          <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
            {values.results?.map((p) => (
              <div key={p._id} className="col">
                <div className="card h-100 d-flex">

                  <div className=' justify-align-center'>
                    <img className="card-img-top img-fluid " src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} alt={p.name} style={{ height: "150px", width: "150px" }} />
                    <div className="card-body">

                      <h5 className="card-title">Name: {p.name}</h5>
                      <p className="card-text">Description: {p.description.substring(0, 30)}</p>
                      <p className="card-text">Price : ₹{p.price}</p>
                      <button className='btn btn-primary ms-1 l-0 ' onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>



                      <button className='btn btn-secondary ms-1'
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem('cart', JSON.stringify([...cart, p]))
                          toast.success('Item added to cart successfully');
                        }}>Add to Cart</button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Popup for Product Details */}
      {selectedProduct && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          {/* ... modal content ... */}
        </div>
      )}
    </Layout>
  )
}

export default Search;
