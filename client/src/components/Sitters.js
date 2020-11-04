import React, { Fragment, useEffect, useState } from "react";
import imposter from "../Assets/Images/imposter.jpg";
import RequestService from "./RequestService";
import ViewReviews from "./ViewReviews";

const Sitters = ({ setAuth }) => {

  var starting = document.getElementById('from');
  var ending = document.getElementById('to');
  if (starting) {
    starting.addEventListener('change', function () {
      if (starting.value)
        ending.min = starting.value;
    }, false);
  }
  if (ending) {
    ending.addEventListener('change', function () {
      if (ending.value)
        starting.max = ending.value;
    }, false);
  }

  const acc_type = localStorage.acc_type;
  const [searches, setSearches] = useState([]);
  const [filters, setFilters] = useState({
    employment_type: "",
    avg_rating: "",
    type_pref: "",
    start_date: "",
    end_date: "",
    form: ""
  });

  const getAll = async () => {
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
    const p_type = filters["type_pref"];
    const s_date = filters["start_date"];
    const e_date = filters["end_date"];
    const namesearch = filters["form"];
    try {
      const response = await fetch('http://localhost:5000/caretakersq?' + new URLSearchParams({
        employment_type: e_type,
        avg_rating: r_type,
        type_pref: p_type,
        start_date: s_date,
        end_date: e_date,
        form: namesearch
      }), {
        method: "GET",
        headers: { token: localStorage.token, acc_type: acc_type }
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

  const onReset = () => {
    setFilters({
      employment_type: "",
      avg_rating: "",
      type_pref: "",
      start_date: "",
      end_date: "",
      form: ""
    });
  }

  useEffect(() => {
    getAll();
  }, [])

  useEffect(() => {
    getFiltered();
  }, [filters])

  return (
    <Fragment>

      <div class="card mx-auto">
        <div class="card-body">
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="emp_type">Employment Type</label >
              <select id="emp_type" name="employment_type" class="form-control" value={filters.employment_type} onChange={(e) => onSelect(e)}>
                <option selected value="">Choose...</option>
                <option value="fulltime">Full-Time</option>
                <option value="parttime">Part-Time</option>
              </select>
            </div>
            <div class="form-group col-md-4">
              <label for="rating">Rating</label>
              <select id="rating" name="avg_rating" class="form-control" value={filters.avg_rating} onChange={(e) => onSelect(e)}>
                <option selected value="">Choose...</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>
            <div class="form-group col-md-4">
              <label for="inputPet">Pet</label>
              <select id="inputPet" name="type_pref" class="form-control" value={filters.type_pref} onChange={(e) => onSelect(e)}>
                <option selected value="">Choose...</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="reptile">Reptile</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="from">From</label>
              <input type="date"
                id="from"
                name="start_date"
                value={filters.start_date}
                onChange={e => onSelect(e)}
                className="form-control validate"
                min="2020-01-01"
                max="2099-12-31"
                required="required"/>
            </div>

            <div class="form-group col-md-4">
              <label for="to">To</label>
              <input type="date"
                id="to"
                name="end_date"
                value={filters.end_date}
                onChange={e => onSelect(e)}
                className="form-control validate"
                min="2020-01-01"
                max="2099-12-31"
                required="required"/>
            </div>

            <div class="form-group col-md-4">
              <label for="searchname">Search by name:</label>
              <input className="form-control" name="form" type="text" placeholder="Enter name..." id="searchname"
                aria-label="Search" value={filters.form} onChange={(e) => onSelect(e)} />
            </div>
          </div>
          <button type="submit" className="btn btn-info" onClick={onReset}>Reset</button>
        </div>
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
                  <p className="card-text">Available: { `${new Date(search.service_avail_from).toDateString()} TO ${new Date(search.service_avail_to).toDateString()}` }</p>
                  <p className="card-text" >Price/day: {search.daily_price}</p>
                  <p className="card-text">Pet type: {search.type_pref}</p>
                  <p className="card-text">Average Rating: {parseFloat(search.avg_rating).toFixed(2)}</p>
                  <div className="row">
                    <div className="col-md-5 col-sm-5 col-12"><RequestService search={search} i={i}/></div>
                    <div className="col-md-1 col-sm-1 col-12" />
                    <div className="col-md-5 col-sm-5 col-12"><ViewReviews search={search} i={i}/></div>
                  </div>                  
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>}


    </Fragment >

  );
};

export default Sitters;