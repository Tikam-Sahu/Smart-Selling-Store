import React from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { useAuth } from '../../context/auth';

const AdminDashboard = () => {
    const [auth] = useAuth();

    return (
        <Layout title="Admin Dashboard">
            <div className="row mt-5" style={{ backgroundColor: '#FAF0E4', minHeight: "100vh" }}>
                <div className="col-md-3">
                    <div className="mt-5">
                        <AdminMenu />
                    </div>
                </div>

                {/* Admin Information */}
                <div className="col-md-9">
                    <div className="card p-4 mt-5">
                        <h2 className="mb-4">Welcome, {auth?.user?.name}</h2>
                        <div className="row">
                            <div className="col-md-6">
                                <h4>Admin Email:</h4>
                                <p>{auth?.user?.email}</p>
                            </div>
                            <div className="col-md-6">
                                <h4>Admin Phone:</h4>
                                <p>{auth?.user?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default AdminDashboard;
