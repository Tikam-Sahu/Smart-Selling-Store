import React from 'react';
import { useSearch } from '../../context/search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/SearchInput.css';

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/search/${values.keyword}`);
            setValues({ ...values, results: data });
            navigate("/search");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <form className="d-flex" onSubmit={handleSubmit}>
                <input
                    className="form-control rounded-pill me-2 "
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={values.keyword}
                    onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                    style={{ width: "235px", marginLeft: "20%" }} />
                {/* Use the btn-primary and btn-rounded classes */}
                <button className="btn btn-primary btn-rounded" type="submit">
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchInput;
