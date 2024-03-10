import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { Button, Modal } from 'antd';
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedPhone, setUpdatedPhone] = useState('');

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/get-all-users-by-admin`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/auth/user-update-by-admin`,
                { userId: selectedUser._id, updates: { name: updatedName, email: updatedEmail, phone: updatedPhone } }
            );
            if (data?.success) {
                setVisible(false);
                setUpdatedName('');
                setSelectedUser(null);
                fetchAllUsers();
                toast.success('User details updated successfully');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            let answer = window.confirm('Are you sure you want to delete this user?');
            if (!answer) return;
            const { data } = await axios.delete(
                `${process.env.REACT_APP_API}/api/v1/auth/user-delete-by-admin`,
                { data: { userId } }
            );
            if (data.success) {
                fetchAllUsers();
                toast.success('User deleted successfully');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <Layout title="Dashboard - All Users">
            <div className="row mt-5" style={{ backgroundColor: '#FAF0E4', minHeight: '100vh' }}>
                <div className="col-md-3">
                    <div className="mt-5">
                        <AdminMenu />
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="mt-5">
                        <h3>All Users</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <Button
                                                type="danger"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    setVisible(true);
                                                    setUpdatedName(user.name);
                                                    setUpdatedEmail(user.email);
                                                    setUpdatedPhone(user.phone);
                                                    setSelectedUser(user);
                                                }}
                                                className="ms-2"
                                            >
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Modal
                            onCancel={() => setVisible(false)}
                            footer={null}
                            visible={visible}
                        >
                            <div>
                                <h3>Update User</h3>
                                <div>
                                    Name :
                                    <input
                                        type="text"
                                        value={updatedName}
                                        onChange={(e) => setUpdatedName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    Email :
                                    <input
                                        type="text"
                                        value={updatedEmail}
                                        onChange={(e) => setUpdatedEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    Phone :
                                    <input
                                        type="text"
                                        value={updatedPhone}
                                        onChange={(e) => setUpdatedPhone(e.target.value)}
                                    />
                                </div>
                                <Button type="primary" onClick={handleUpdate}>
                                    Update
                                </Button>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Users;
