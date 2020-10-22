import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import PetOwner from "./PetOwner";

const Homepage = ({ setAuth }) => {
  const acc_type = localStorage.acc_type;


  return (
    <Fragment>
      {acc_type == "petowner" && <PetOwner/>}

    </Fragment>


  );
};

export default Homepage;