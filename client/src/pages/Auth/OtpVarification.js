import React, { useState } from "react";
import Layout from "../../components/Layout/Layout.js";
import axios from "axios";
import "../../styles/Register.css";

import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [otp, setOtp] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const [spinner, setSpinner] = useState(false);

    const RegisterUser = async (e) => {
        e.preventDefault();
        if (otp === "") {
            toast.error("Enter Your OTP");
        } else if (/^[a-zA-Z]+$/.test(otp)) {
            toast.error("Enter Valid OTP");
        } else if (otp.length !== 6) {
            toast.error("Please Enter six digit OTP");
        } else {
            try {
                setSpinner(true);
                const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/otp-verify`, {
                    email: location.state, // Use location.state directly here
                    otp,
                });
                setSpinner(false);
                if (res && res.data.success) {
                    toast.success(res.data && res.data.message);
                    navigate("/register", { state: location.state }); // Navigate and send email as state
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                setSpinner(false);
                console.log(error);
                toast.error("Something went wrong. Try again.");
            }
        }
    };

    return (
        <Layout title="OTP Verification - Ecommer App">
            <div className="form-container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "90vh" }}>
                <form>
                    <h6>
                        Please Enter your OTP to verify your Email
                    </h6>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={location.state} // Use location.state directly to show the email
                            className="form-control"
                            id="exampleInputEmail"
                            disabled
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={otp}
                            className="form-control"
                            id="exampleInputOtp"
                            placeholder="Enter your OTP"
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={RegisterUser}
                        style={{ alignItems: "center", width: "100%" }}
                        disabled={spinner} // Disable the button while the spinner is active
                    >
                        {spinner ? (
                            <span className="d-flex align-items-center">
                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                Verifying...
                            </span>
                        ) : (
                            "VERIFY"
                        )}
                    </button>

                </form>
                <ToastContainer />
            </div>
        </Layout>
    );
};

export default Register;
