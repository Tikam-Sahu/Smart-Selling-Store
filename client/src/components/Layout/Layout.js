import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';

// const Layout = ({ props, title, description, keywords, author }) => 
function Layout({ children, title, description, keywords, author }) {
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>
            </Helmet>
            <Header />
            <main >
                <Toaster />
                {children}
            </main>
            <Footer />
        </div>
    )
}

Layout.defaultProps = {
    title: "E-Dukaan App- A quick online shppping store",
    description: 'A online Dukaan where user can buy product easily and quickly',
    keywords: "MERN- MongoDB, ExpressJs, ReactJs, NodeJs Project",
    author: "Tikam Sahu "
}
export default Layout;

