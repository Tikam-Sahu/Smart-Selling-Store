import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
    return (
        <Layout title="Privacy & Policy E-Dukaan App">
            <div className="row contactus " style={{ minHeight: "60vh", paddingTop: "15vh" }}>
                <div className="col-md-6 ">
                    <img
                        src="/images/privacyPolicy.jpg"
                        alt="contactus"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="col-md-4">
                    <p>add privacy policy</p>
                    <p>add privacy policy</p>
                    <p>add privacy policy</p>
                    <p>add privacy policy</p>
                    <p>add privacy policy</p>
                    <p>add privacy policy</p>
                    <p>add privacy policy</p>
                </div>
            </div>
        </Layout>
    );
};

export default Policy;
