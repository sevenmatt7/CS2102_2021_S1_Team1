import React, { Fragment, useEffect, useState } from "react";
import RequestService from "./RequestService";
import ViewReviews from "./ViewReviews";

const Sitters = ({ setAuth }) => {
  // helper function to parse date
  function parseDate(raw_date) {
    function parseMonth(month) {
      switch (month) {
        case "Jan":
          return "01";
        case "Feb":
          return "02";
        case "Mar":
          return "03";
        case "Apr":
          return "04";
        case "May":
          return "05";
        case "Jun":
          return "06";
        case "Jul":
          return "07";
        case "Aug":
          return "08";
        case "Sep":
          return "09";
        case "Oct":
          return "10";
        case "Nov":
          return "11";
        case "Dec":
          return "12";
      }
    }

    let date_string = new Date(raw_date).toDateString();
    let date_tokens = date_string.split(" ");
    return `${date_tokens[3]}-${parseMonth(date_tokens[1])}-${date_tokens[2]}`;
  }

  var starting = document.getElementById("from");
  var ending = document.getElementById("to");
  if (starting) {
    starting.addEventListener(
      "change",
      function () {
        if (starting.value) ending.min = starting.value;
      },
      false
    );
  }
  if (ending) {
    ending.addEventListener(
      "change",
      function () {
        if (ending.value) starting.max = ending.value;
      },
      false
    );
  }

  const acc_type = localStorage.acc_type;
  const [searches, setSearches] = useState([]);
  const [filters, setFilters] = useState({
    employment_type: "",
    avg_rating: "",
    type_pref: "",
    start_date: "",
    end_date: "",
    user_area: "",
    form: "",
  });

  const getAll = async () => {
    try {
      const response = await fetch("/caretakers");
      const jsonData = await response.json();
      setSearches(jsonData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getFiltered = async () => {
    const e_type = filters["employment_type"];
    const r_type = filters["avg_rating"];
    const p_type = filters["type_pref"];
    const s_date = filters["start_date"];
    const e_date = filters["end_date"];
    const area = filters["user_area"];
    const namesearch = filters["form"];
    try {
      const response = await fetch(
        "/caretakersq?" +
          new URLSearchParams({
            employment_type: e_type,
            avg_rating: r_type,
            type_pref: p_type,
            start_date: s_date,
            end_date: e_date,
            user_area: area,
            form: namesearch,
          }),
        {
          method: "GET",
          headers: { token: localStorage.token, acc_type: acc_type },
        }
      );
      const jsonData = await response.json();
      setSearches(jsonData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSelect = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const onReset = () => {
    setFilters({
      employment_type: "",
      avg_rating: "",
      type_pref: "",
      start_date: "",
      end_date: "",
      user_area: "",
      form: "",
    });
  };

  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    getFiltered();
  }, [filters]);

  return (
    <Fragment>
      <div className="card mx-auto">
        <div className="card-body">
          <div className="form-row">
            <div className="form-group col">
              <label htmlFor="emp_type">Employment Type</label>
              <select id="emp_type" name="employment_type" className="form-control" value={filters.employment_type} onChange={(e) => onSelect(e)}>
                <option selected value="">
                  Choose...
                </option>
                <option value="fulltime">Full-Time</option>
                <option value="parttime">Part-Time</option>
              </select>
            </div>
            <div className="form-group col">
              <label htmlFor="rating">Rating</label>
              <select id="rating" name="avg_rating" className="form-control" value={filters.avg_rating} onChange={(e) => onSelect(e)}>
                <option selected value="">
                  Choose...
                </option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>
            <div className="form-group col">
              <label htmlFor="inputPet">Pet</label>
              <select id="inputPet" name="type_pref" className="form-control" value={filters.type_pref} onChange={(e) => onSelect(e)}>
                <option selected value="">
                  Choose...
                </option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="reptile">Reptile</option>
              </select>
            </div>

            <div className="form-group col">
              <label htmlFor="area">Area</label>
              <select id="area" name="user_area" className="form-control" value={filters.user_area} onChange={(e) => onSelect(e)}>
                <option selected value="">
                  Choose...
                </option>
                <option value="Central">Central</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="from">From</label>
              <input type="date" id="from" name="start_date" value={filters.start_date} onChange={(e) => onSelect(e)} className="form-control validate" min="2020-01-01" max="2099-12-31" required="required" />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="to">To</label>
              <input type="date" id="to" name="end_date" value={filters.end_date} onChange={(e) => onSelect(e)} className="form-control validate" min="2020-01-01" max="2099-12-31" required="required" />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="searchname">Search by name:</label>
              <input className="form-control" name="form" type="text" placeholder="Enter name..." id="searchname" aria-label="Search" value={filters.form} onChange={(e) => onSelect(e)} />
            </div>
          </div>

          <button type="submit" className="btn btn-info" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="text-center">
        <h2> Browse for CareTakers!</h2>
        <br></br>
      </div>
      
      
      {acc_type === "petowner" && <div className="table-responsive">
        <table className="table table-stripped table-sm">
          <thead>
            <tr>
              {/* <th className="text-center" scope="col">Profile Pic</th> */}
              <th className="text-center" scope="col">Full Name</th>
              <th className="text-center" scope="col">Address</th>
              <th className="text-center" scope="col">Area</th>
              <th className="text-center" scope="col">Employment Type</th>
              <th className="text-center" scope="col">Available</th>
              <th className="text-center" scope="col">Price/day</th>
              <th className="text-center" scope="col">Pet Type</th>
              <th className="text-center" scope="col">Average Rating</th>
              <th className="text-center" scope="col">Request Service</th>
              <th className="text-center" scope="col">View Reviews</th>
            </tr>
          </thead>
          {searches.map((search, i) => (
            <tbody key={i}>
              <tr>
                {/* <th className="text-center" scope="row"><img src={search.profile_pic_address} className="img" alt="You!" /></th> */}
                <th className="text-center" scope="row">{search.full_name}</th>
                <td className="text-center" >{search.user_area}</td>
                <td className="text-center" >{search.user_address}</td>
                <td className="text-center" >{search.employment_type}</td>
                <td className="text-center" >{ `${new Date(search.service_avail_from).toDateString()} - ${new Date(search.service_avail_to).toDateString()}` }</td>
                <td className="text-center" >{search.daily_price}</td>
                <td className="text-center" >{search.type_pref}</td>
                <td className="text-center" >{search.avg_rating.slice(0,3)}</td>
                <td className="text-center" ><RequestService search={search} i={i} /></td>
                <td className="text-center" ><ViewReviews search={search} i={i} /></td>


      {acc_type === "petowner" && (
        <div className="table-responsive">
          <table className="table table-stripped table-sm">
            <thead>
              <tr>
                {/* <th className="text-center" scope="col">Profile Pic</th> */}
                <th className="text-center" scope="col">
                  Full Name
                </th>
                <th className="text-center" scope="col">
                  Address
                </th>
                <th className="text-center" scope="col">
                  Area
                </th>
                <th className="text-center" scope="col">
                  Employment Type
                </th>
                <th className="text-center" scope="col">
                  Available
                </th>
                <th className="text-center" scope="col">
                  Price/day
                </th>
                <th className="text-center" scope="col">
                  Pet Type
                </th>
                <th className="text-center" scope="col">
                  Average Rating
                </th>
                <th className="text-center" scope="col">
                  Request Service
                </th>
                <th className="text-center" scope="col">
                  View Reviews
                </th>
              </tr>
            </thead>
            {searches.map((search, i) => (
              <tbody key={i}>
                <tr>
                  {/* <th className="text-center" scope="row"><img src={search.profile_pic_address} className="img" alt="You!" /></th> */}
                  <th className="text-center" scope="row">
                    {search.full_name}
                  </th>
                  <td className="text-center">{search.user_area}</td>
                  <td className="text-center">{search.user_address}</td>
                  <td className="text-center">{search.employment_type}</td>
                  <td className="text-center">{`${new Date(search.service_avail_from).toDateString()} - ${new Date(search.service_avail_to).toDateString()}`}</td>
                  <td className="text-center">{search.daily_price}</td>
                  <td className="text-center">{search.type_pref}</td>
                  <td className="text-center">{parseFloat(search.avg_rating).toFixed(2)}</td>
                  <td className="text-center">
                    <RequestService search={search} i={i} />
                  </td>
                  <td className="text-center">
                    <ViewReviews search={search} i={i} />
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      )}
    </Fragment>
  );
};

export default Sitters;
