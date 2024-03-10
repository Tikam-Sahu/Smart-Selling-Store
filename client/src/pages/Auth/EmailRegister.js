import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import "../../styles/Register.css";
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import axios from "axios";

const EmailRegister = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [spinner, setSpinner] = useState(false);

    // sendotp
    const sendOtp = async (e) => {
        e.preventDefault();

        if (email === "") {
            toast.error("Enter Your Email !");
        } else if (!email.includes("@")) {
            toast.error("Enter Valid Email !");
        } else {
            try {
                setSpinner(true); // Start the spinner
                const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/otp`, {
                    email,
                });
                if (res && res.data.success) {
                    toast.success(res.data && res.data.message);
                    setSpinner(false); // Stop the spinner
                    navigate("/otp-varification", { state: email });
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong. Try again.");
                setSpinner(false); // Stop the spinner on error
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <Layout title="Register - Smart Selling Store">
                <div className="form-container">
                    <form>
                        <h4 className="title">REGISTER FORM</h4>
                        <div className="mb-3">
                            <input
                                type="email"
                                value={email}
                                className="form-control"
                                id="exampleInputEmail1"
                                placeholder="Enter Your Email"
                                required
                                autoFocus
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button className="btn" onClick={sendOtp}>
                            Register
                            {spinner && (
                                <span>
                                    <Spinner animation="border" role="status"></Spinner>
                                </span>
                            )}
                        </button>
                        <p>Already Have an account <NavLink to="/login">Sign in</NavLink></p>
                    </form>
                </div>
            </Layout>
        </>
    );
};

export default EmailRegister;
