import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/Footer.css";

const Footer = () => {
    return (
        <div className="footer mt-5 pt-4">
            <div className="container text-center text-md-left">
                <h4 className="text-center text-md-left mb-3">All Rights Reserved &copy; Smart Selling Store</h4>
                <div className="row text-center text-md-left">
                    <div className="col-md-3 col-lg-2 col-xl-2 mx-auto">
                        <p className="links">
                            <Link to="/about">About</Link>
                        </p>
                    </div>
                    <div className="col-md-3 col-lg-2 col-xl-2 mx-auto">
                        <p className="links">
                            <Link to="/contact">Contact</Link>
                        </p>
                    </div>
                    <div className="col-md-3 col-lg-2 col-xl-2 mx-auto">
                        <p className="links">
                            <Link to="/policy">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
