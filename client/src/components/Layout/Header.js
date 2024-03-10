import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FcShop } from 'react-icons/fc';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import { Badge, Space } from 'antd';
import '../../styles/Header.css';

const Header = () => {
    const [auth, setAuth] = useAuth();
    const [showDropdown, setShowDropdown] = useState(null);
    const [cart] = useCart();
    const categories = useCategory();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: '',
        });
        localStorage.removeItem('auth');
        toast.success('Logout Successfully');
    };

    const handleDropdownToggle = (category) => {
        setShowDropdown((prevCategory) => (prevCategory === category ? null : category));
    };

    const handleAllCategoriesClick = () => {
        setShowDropdown(null);
        navigate('/categories');
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" onClick={() => handleDropdownToggle('')}>
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className={`collapse navbar-collapse ${showDropdown ? 'show' : ''}`}>
                        <Link to="/" className="navbar-brand">
                            <FcShop /> {'\u00A0'}Smart Selling Store
                        </Link>

                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <div style={{ marginLeft: '65px', marginRight: '81px' }}>
                                <SearchInput />
                            </div>

                            <li className="nav-item">
                                <NavLink to="/" className="nav-link" aria-current="page">
                                    Home
                                </NavLink>
                            </li>

                            <li className={`nav-item dropdown ${showDropdown === 'categories' ? 'show' : ''}`}>
                                <span className="nav-link dropdown-toggle" onClick={() => handleDropdownToggle('categories')}>
                                    Categories
                                </span>
                                <ul className={`dropdown-menu ${showDropdown === 'categories' ? 'show' : ''}`}>
                                    <li>
                                        <NavLink
                                            className="dropdown-item"
                                            to="/categories"
                                            isActive={() => !showDropdown}
                                            onClick={handleAllCategoriesClick}
                                        >
                                            All Categories
                                        </NavLink>
                                    </li>
                                    {categories?.map((c) => (
                                        <li key={c._id}>
                                            <Link className="dropdown-item" to={`/category/${c.slug}`}>
                                                {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {!auth.user ? (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/email-register" className="nav-link">
                                            Register
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/login" className="nav-link">
                                            Login
                                        </NavLink>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className={`nav-item dropdown ${showDropdown === 'user' ? 'show' : ''}`}>
                                        <span className="nav-link dropdown-toggle" onClick={() => handleDropdownToggle('user')}>
                                            {auth?.user?.name}
                                        </span>
                                        <ul className={`dropdown-menu ${showDropdown === 'user' ? 'show' : ''}`}>
                                            <li>
                                                <NavLink
                                                    to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                                                    className="dropdown-item"
                                                >
                                                    Dashboard
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/login" onClick={handleLogout} className="dropdown-item">
                                                    Logout
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            )}

                            <li className="nav-item">
                                <Space>
                                    <NavLink to="/cart" className="nav-link">
                                        Cart (<Badge count={cart?.length} showZero color="#f5222d" />)
                                    </NavLink>
                                </Space>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
