import React from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import "../../styles/UserDashboard.css"; // Import the custom CSS file

const Dashboard = () => {
    const [auth] = useAuth();

    return (
        <Layout title={"User Dashboard"}>
            <div className="container-fluid m-3 p-3" style={{ minHeight: "100vh" }}>
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card w-75 p-3">
                            {/* Add the classes to apply the styles */}
                            <h3 className="name">Name:      {auth?.user?.name}</h3>
                            <h3 className="email">Email:    {auth?.user?.email}</h3>
                            <h3 className="address">Address:     {auth?.user?.address}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
