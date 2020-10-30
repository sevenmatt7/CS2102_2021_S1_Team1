import React, { Fragment, useState, useEffect } from "react";
import EditProfile from "./EditProfile";

const Profile = ({ setAuth }) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user_address, setAddress] = useState("");
  const [profile_pic_URL, setProfilepic] = useState("");
  const [transactions, setTransactions] = useState([]);
  const acc_type = localStorage.acc_type;

  const getTransactions = async () => {
    try {
        const res = await fetch("http://localhost:5000/transactions", {
            method: "GET",
            headers: { token: localStorage.token, acc_type: acc_type }
        });
        const jsonData = await res.json();
        setTransactions(jsonData);
    } catch (err) {
        console.error(err.message);
    }
  };

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/home/", {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const jsonData = await res.json();
      setName(jsonData.full_name);
      setEmail(jsonData.email);
      setAddress(jsonData.user_address)
      setProfilepic(jsonData.profile_pic_address)
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
    getTransactions();
  }, [])


  return (
    <Fragment>

      <div className="container emp-profile">
          <div className="row">
            <div className="col-md-4">
              <div className="profile-img mb-5">
                <img src={profile_pic_URL} alt="You do not have a profile picture!" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-head">
                <h5>
                  {name}
                </h5>
                <h6>
                  {acc_type}
                </h6>
                <p className="profile-rating">RATINGS : <span>8/10</span></p>
              </div>
            </div>
            <div className="col-md-2">
              <EditProfile name={name} address={user_address} profile_pic_URL={profile_pic_URL}/>
            </div>
          </div>
          <div className="profile-head">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">
                  {acc_type === "petowner" ? "Other Info" : "Other Info"}
                </a>
              </li>
            </ul>
            <div className="row">
            </div>
            <div className="col-md-8">
              <div className="tab-content profile-tab" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <div className="row">
                    <div className="col-md-6">
                      <label>Name</label>
                    </div>
                    <div className="col-md-6">
                      <p>{name}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Profession</label>
                    </div>
                    <div className="col-md-6">
                      <p>{localStorage.acc_type}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Email</label>
                    </div>
                    <div className="col-md-6">
                      <p>{email}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Residential Address</label>
                    </div>
                    <div className="col-md-6">
                      <p>{user_address}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label>Your Bio</label><br />
                      <p>Insert details here/ Other info</p>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <div className="row">
                    <div className="col-md-6">

                    </div>
                    <div className="col-md-6">
                      <p><label>Can add other details here (Enquiries for Pet Owners/ Transaction history for CareTakers)</label></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
      </div>

    </Fragment>
  );
};

export default Profile;