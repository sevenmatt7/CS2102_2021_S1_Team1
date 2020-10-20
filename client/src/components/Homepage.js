import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import PCSAdmin from "./PCSAdmin";

const Homepage = ({ setAuth }) => {
  const acc_type = localStorage.acc_type;
  // const [name, setName] = useState("");
  // const [searches, setSearches] = useState([]);
  // const [form, setForm] = useState("");
  // const [filters, setFilters] = useState({
  //   employment_type: "",
  //   avg_rating: ""
  // });

  // const getProfile = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5000/home/", {
  //       method: "GET",
  //       headers: { token: localStorage.token }
  //     });

  //     const parseData = await res.json();
  //     setName(parseData.full_name);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };


  // const getSearches = async () => {
  //   try {
  //     let available_pets;
  //     const response = await fetch("http://localhost:5000/caretakers");
  //     const jsonData = await response.json();
  //     setSearches(jsonData);
  //   } catch (error) {
  //     console.log(error.message)
  //   }
  // };

  // const getFiltered = async () => {
  //   const e_type = filters["employment_type"];
  //   const r_type = filters["avg_rating"];
  //   try {
  //     const response = await fetch('http://localhost:5000/caretakersq?' + new URLSearchParams({
  //       employment_type: e_type,
  //       avg_rating: r_type,
  //     }), {
  //       method: "GET"
  //     });
  //     const jsonData = await response.json();
  //     setSearches(jsonData);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  // const getFormSearch = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/formsearch?' + new URLSearchParams({
  //       form: form,
  //     }), {
  //       method: "GET"
  //     });
  //     const jsonData = await response.json();
  //     setSearches(jsonData);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  // const onSelect = (e) => {
  //   setFilters({ ...filters, [e.target.name]: e.target.value })
  // }

  // const onChangeForm = (e) => {
  //   setForm(e.target.value)
  // }


  // useEffect(() => {
  //   getProfile();
  //   getSearches();
  // }, [])

  // useEffect(() => {
  //   // getFiltered();
  // }, [filters])

  // useEffect(() => {
  //   // getFormSearch();
  // }, [form])

  return (
    //This homepage can be the new dashboard for pcsadmin, caretaker and petowner information
    <Fragment>
      {acc_type === "admin" && <PCSAdmin />}
    </Fragment>

  );
};

export default Homepage;