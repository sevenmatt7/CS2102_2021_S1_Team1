import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import imposter from "../Assets/Images/imposter.jpg";
import RequestService from "./RequestService";

const Homepage = ({ setAuth }) => {
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
    getFiltered();
  }, [filters])

  useEffect(() => {
    getFormSearch();
  }, [form])

  return (
    <Fragment>
      <div style={{ background: "transparent" }} className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1 className="display-4">Welcome {name}</h1>
          <p className="lead">There is 1 Imposter among pets.</p>
          <hr className="my-4"></hr>
          <p className="lead">
            <button onClick={e => logout(e)} className="btn btn-primary btn-lg">
              Logout
          </button>
          </p>
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

      <div className="active-purple-4 mb-4">
        <input className="form-control" type="text" placeholder="Search by name" aria-label="Search" value={form} onChange={(e) => onChangeForm(e)} />
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
                  <RequestService search={search}/>
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