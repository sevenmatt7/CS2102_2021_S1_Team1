import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import imposter from "../Assets/Images/imposter.jpg";

const Homepage = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [searches, setSearches] = useState([]);
  const [filters, setFilters] = useState({
    employment_type: "",
    avg_rating: ""
  });

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/home/", {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const parseData = await res.json();
      setName(parseData.full_name);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  const getSearches = async () => {
    try {
      const response = await fetch("http://localhost:5000/caretakers");
      const jsonData = await response.json();
      console.log(jsonData);
      setSearches(jsonData);
    } catch (error) {
      console.log(error.message)
    }
  };

  const getFiltered = async () => {
    const e_type = filters["employment_type"];
    const r_type = filters["avg_rating"];
    try {
      const response = await fetch('http://localhost:5000/caretakersq?' + new URLSearchParams({
        employment_type: e_type,
        avg_rating: r_type,
      }), {
        method: "GET"
      });
      const jsonData = await response.json()
      setSearches(jsonData);
    } catch (error) {
      console.log(error.message)
    }
  }

  const onSelect = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    getProfile();
    getSearches();
    getFiltered();
  }, [filters])

  return (
    <Fragment>
      <div class="jumbotron jumbotron-fluid">
        <div class="container">
          <h2 class="display-4">Welcome {name}</h2>
          <p class="lead">This is 1 Imposter among pets.</p>
          <button onClick={e => logout(e)} className="btn btn-primary mt-5">
            Logout
          </button>
        </div>
      </div>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputGroupSelect01">Employment Type</label>
        </div>
        <select value={filters.employment_type} name="employment_type" className="custom-select" id="inputGroupSelect01" onChange={(e) => onSelect(e)}>
          <option value="" disabled>Choose...</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
        </select>
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputGroupSelect02">Rating</label>
        </div>
        <select value={filters.avg_rating} name="avg_rating" className="custom-select" id="inputGroupSelect02" onChange={(e) => onSelect(e)}>
          <option value="" disabled>Choose...</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </div>
      <div className="input-group mb-3">

      </div>

      <div className="card-deck">
        {searches.map((search, i) => (
          <div key={i} className="card mb-3" style={{ minWidth: 540, maxWidth: 540 }}>
            <div className="row no-gutters">
              <div className="col-md-4">
                <img src={imposter} className="card-img" alt="..." />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title" style={{ fontFamily: 'verdana', fontSize: 20 }}>{search.full_name}</h5>
                  <p className="card-text" style={{ fontFamily: 'Arial', fontSize: 15 }}>Address: {search.user_address}</p>
                  <p className="card-text" style={{ fontFamily: 'Arial', fontSize: 13 }}>Employment Type: {search.employment_type}</p>
                  <p className="card-text" style={{ fontFamily: 'Arial', fontSize: 13 }}>Rating: {search.avg_rating}</p>
                  <a href="#" className="btn btn-success">Request service!</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Fragment>

  );
};

export default Homepage;