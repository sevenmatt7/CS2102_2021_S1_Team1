import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import PetOwner from "./PetOwner";

const Homepage = ({ setAuth }) => {
  const acc_type = localStorage.acc_type;


  return (
    //This homepage can be the new dashboard for pcsadmin, caretaker and petowner information
    <PetOwner/>

  );
};

export default Homepage;