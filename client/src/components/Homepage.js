import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import imposter from "../Assets/Images/imposter.jpg";
import RequestService from "./RequestService";

const Homepage = ({ setAuth }) => {
  const acc_type = localStorage.acc_type;
  const [name, setName] = useState("");
  const [searches, setSearches] = useState([]);
  const [form, setForm] = useState("");
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


  const getSearches = async () => {
    try {
      let available_pets;
      const response = await fetch("http://localhost:5000/caretakers");
      const jsonData = await response.json();
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
      const jsonData = await response.json();
      setSearches(jsonData);
    } catch (error) {
      console.log(error.message);
    }
  }

  const getFormSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/formsearch?' + new URLSearchParams({
        form: form,
      }), {
        method: "GET"
      });
      const jsonData = await response.json();
      setSearches(jsonData);
    } catch (error) {
      console.log(error.message);
    }
  }

  const onSelect = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const onChangeForm = (e) => {
    setForm(e.target.value)
  }


  useEffect(() => {
    getProfile();
    getSearches();
  }, [])

  useEffect(() => {
    // getFiltered();
  }, [filters])

  useEffect(() => {
    // getFormSearch();
  }, [form])

  return (
    <Fragment>
      {/* <div style={{ background: "transparent" }} className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1 className="display-4">Welcome back {name}!</h1>
          <hr className="my-4"></hr>
        </div>
      </div>
      <div className="input-group mb-3 mt-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="inputGroupSelect01">Employment Type</label>
        </div>
        <select value={filters.employment_type} name="employment_type" className="custom-select" id="inputGroupSelect01" onChange={(e) => onSelect(e)}>
          <option value="" disabled>Choose...</option>
          <option value="fulltime">Full-Time</option>
          <option value="parttime">Part-Time</option>
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

      <div className="active-purple-4 mb-4">
        <input className="form-control" type="text" placeholder="Search by name" aria-label="Search" value={form} onChange={(e) => onChangeForm(e)} />
      </div>

      {acc_type === "petowner" && <div className="card-deck">
        {searches.map((search, i) => (
          <div key={i} className="card mb-3" style={{ minWidth: 540, maxWidth: 540 }}>
            <div className="row no-gutters">
              <div className="col-md-4">
                <img src={imposter} className="card-img" alt="..." />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{search.full_name}</h5>
                  <p className="card-text" >Address: {search.user_address}</p>
                  <p className="card-text">Employment Type: {search.employment_type}</p>
                  <p className="card-text">Available: {search.service_avail}</p>
                  <p className="card-text" >Price/day: {search.daily_price}</p>
                  <p className="card-text">Pet type: {search.type_pref}</p>
                  <RequestService search={search} i={i} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>}
 */}

    </Fragment>

  );
};

export default Homepage;