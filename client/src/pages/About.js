import React from 'react'
import Layout from '../components/Layout/Layout'

function About() {
    return (
        <Layout title="About us E-Dukaan App">
            <section className="container my-5" style={{ minHeight: "60vh", paddingTop: "15vh" }}>
                <div className="row">
                    <div className="col-lg-6">
                        <h2>About Us</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu est sed ex hendrerit
                            consectetur sed at quam. Nulla vel vestibulum ligula, ut luctus magna. Aliquam ac nibh et
                            nulla tristique consequat. Sed auctor dui mauris, sit amet finibus dolor fringilla at.</p>
                        <p>Phasellus eget elit in nisl ultrices suscipit eu vel lectus. Mauris in libero sapien. Morbi
                            vestibulum metus ac enim dapibus, nec auctor nisl ultrices. Fusce at orci in ipsum iaculis
                            ultrices. Nullam sed tortor nunc. Pellentesque in dignissim nulla, sit amet suscipit magna.</p>
                    </div>
                    <div className="col-lg-6">
                        <img src="/images/aboutUs.jpg" alt="About Us" className="img-fluid" />
                    </div>
                </div>
            </section>

        </Layout>

    );
}

export default About;
