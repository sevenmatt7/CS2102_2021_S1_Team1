import React, { Fragment } from "react";
import PCSAdmin from "./PCSAdmin";
import PetOwner from "./PetOwner";
import Caretaker from "./Caretaker";

const Homepage = ({ setAuth }) => {
  const acc_type = localStorage.acc_type;

  return (
    <Fragment>
      {acc_type === "admin" && <PCSAdmin />}
      {acc_type === "petowner" && <PetOwner/>}
      {acc_type === "caretaker" && <Caretaker/>}
    </Fragment>
  );
};

export default Homepage;