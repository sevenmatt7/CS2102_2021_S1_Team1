import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"
import NavBar from "./NavBar"

const Homepage = ({ setAuth }) => {
  const [name, setName] = useState("");

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

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      <NavBar />
      <h1 className="mt-5">Pet Caring app </h1>
      <h2>Welcome {name}</h2>
      <Link to="/PCS">
        <button className="btn btn-secondary btn-block mt-3">PCSAdmin</button>
      </Link>
      <button onClick={e => logout(e)} className="btn btn-primary mt-5">
        Logout
      </button>
    </div>
  );
};

export default Homepage;