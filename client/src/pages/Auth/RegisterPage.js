import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [answer, setAnswer] = useState('');

    // Hook to navigate any link
    const navigate = useNavigate();

    // Form function submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
                name,
                email,
                password,
                phone,
                address,
                answer,
            });
            if (res && res.data.success) {
                toast.success('Register successfully please login');
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    return (
        <Layout title="User Registration Smart Selling Store App">
            <div className="container-fluid" style={{ minHeight: '100vh', minWidth: '100vw' }}>
                <div className="row">
                    <div className="col-md-4">
                        {/* Add your image here if required */}
                    </div>
                    <div className="col-md-8">
                        <div className="form-container mt-5">
                            <form onSubmit={handleSubmit}>
                                <h4 className="title">REGISTER FORM</h4>
                                <div className="mb-3">
                                    <div className="form-outline">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            placeholder="Enter Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="exampleInputEmail1">
                                            Enter Your Name
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-outline">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            placeholder="Enter your Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="exampleInputEmail1">
                                            Enter your Email
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-outline">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="exampleInputPassword1"
                                            placeholder="Enter your Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="exampleInputPassword1">
                                            Enter your Password
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-outline">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            placeholder="Enter your Phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="exampleInputEmail1">
                                            Enter your Phone number
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-outline">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            placeholder="Enter Your Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="exampleInputEmail1">
                                            Enter Your Address
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-outline">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            placeholder="What is Your favorite sports?"
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="exampleInputEmail1">
                                            What is Your favorite sports?
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary"
                                >
                                    <Link
                                        to={`/otp-verification?name=${name}&email=${email}&phone=${phone}&address=${address}`}
                                        style={{ color: 'white', textDecoration: 'none' }}
                                    >
                                        Submit
                                    </Link>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
