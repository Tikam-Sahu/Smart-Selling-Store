// pages/AllCancelOrders.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import { Table, Select } from "antd";
const { Option } = Select;

const CancelOrders = () => {
    const [status, setStatus] = useState(["Payment Refund", "Hold", "Reject"]);
    const [cancelOrders, setCancelOrders] = useState([]);
    const [auth, setAuth] = useAuth();

    const getAllCancelOrders = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/all-cancel-orders`);
            setCancelOrders(data);
        } catch (error) {
            console.log(error);
        }
    };


    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/product/cancel-order-status/${orderId}`, {
                status: value,
            });
            getAllCancelOrders();
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        if (auth?.token) {
            getAllCancelOrders();
        }
    }, [auth?.token]);

    const columns = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text, record) => (
                <Select
                    bordered={false}
                    onChange={(value) => handleChange(record._id, value)}
                    defaultValue={text}
                >
                    {status.map((s, i) => (
                        <Option key={i} value={s}>
                            {s}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: "Buyer",
            dataIndex: ["user", "name"],
            key: "user",
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => moment(text).fromNow(),
        },
        {
            title: "Account Holder",
            dataIndex: "accountHolderName",
            key: "accountHolderName",
        },
        {
            title: "Account Number",
            dataIndex: "accountNumber",
            key: "accountNumber",
        },
        {
            title: "IFSC Code",
            dataIndex: "ifscCode",
            key: "ifscCode",
        },
    ];

    const data = cancelOrders.map((order, index) => ({ ...order, index: index + 1 }));

    return (
        <Layout title={"All Cancel Orders"}>
            <div className="row mt-5" style={{ backgroundColor: '#FAF0E4', minHeight: "100vh" }}>
                <div className="col-md-3">
                    <div className="mt-5">
                        <AdminMenu />
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="mt-5">
                        <h1 className="text-center">All Cancel Orders</h1>
                        <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CancelOrders;
