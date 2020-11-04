import React, { Fragment, useState, useEffect } from "react";
import EditProfile from "./EditProfile";

const Profile = ({ setAuth }) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user_address, setAddress] = useState("");
  const [profile_pic_URL, setProfilepic] = useState("");
  const [transactions, setTransactions] = useState([]);
  const acc_type = localStorage.acc_type;
  const [avg_rating, setRating] = useState("")
  const [employment_type, setEmploymentType] = useState("")
  const [totalNumOfRatings, setTotalNumOfRatings] = useState("")
  const [enquiries, setEnquiries] = useState([])

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

  const getAvgRating = async () => {
    if (acc_type === 'caretaker') {
      try {
        const res = await fetch("http://localhost:5000/avgrating", {
          method: "GET",
          headers: { token: localStorage.token }
        })
        const jsonData = await res.json()
        setRating(parseFloat(jsonData.avg_rating).toFixed(2))
        setEmploymentType(jsonData.employment_type)
      } catch (error) {
        console.log(error.message)
      }
    }
  }

  const getTotalNumOfRatings = async () => {
    if (acc_type === 'caretaker') {
      try {
        const res = await fetch("http://localhost:5000/numrating", {
          method: "GET",
          headers: { token: localStorage.token }
        })
        const jsonData = await res.json()
        setTotalNumOfRatings(jsonData.count)
      } catch (error) {
        console.log(error.message)
      }
    }
  }

  const getEnquiries = async () => {
    try {
      console.log('enter getenquiries')
      const res = await fetch("http://localhost:5000/ownerenquiries", {
        method: "GET",
        headers: { token: localStorage.token }
      })
      const jsonData = await res.json()
      setEnquiries(jsonData)
    } catch (error) {
      console.log(error.message)
    }

  }

  function parseDate(dateString) {
    return dateString.split('T')[0]
  }

  function calcEarnings(daily_price, from, to) {
    const start = Date.parse(from)
    const end = Date.parse(to)
    const numDays = (end - start) / 1000 / 60 / 60 / 24
    return numDays * daily_price
  }

  useEffect(() => {
    getProfile();
    getTransactions();
    getAvgRating();
    getTotalNumOfRatings();
    getEnquiries()
  }, [])


  return (
    <Fragment>
      <div>
      <div className="container emp-profile">
          <div className="row" id="profile-pic-name-rating">
            <div className="col-md-4">
              <div className="profile-img mb-5">
                <img src={profile_pic_URL} alt="Your profile picture goes here!" />
              </div>
            </div>
            <div className="col-md-6">
            <div className="profile-head">
              <h5>
                {name}
              </h5>
              <h6>
                {acc_type === 'caretaker' ? acc_type + " (" + employment_type + ")"
                  : acc_type}
              </h6>
              <h6>
                {acc_type === 'caretaker' && <p className="profile-rating">Current average rating : <span>{avg_rating}</span></p>}
              </h6>
              <h6>
                {acc_type === 'caretaker' && <p className="profile-rating">Total number of ratings : <span>{totalNumOfRatings}</span></p>}
              </h6>
            </div>
            </div>
            <div className="col-md-2">
              <EditProfile name={name} address={user_address} profile_pic_URL={profile_pic_URL}/>
            </div>
          </div>
        </div>
        <div className="profile-head">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a>
            </li>
            {acc_type === 'caretaker' && <li className="nav-item">
              <a className="nav-link" id="review-tab" data-toggle="tab" href="#review" role="tab" aria-controls="review" aria-selected="true">Past Reviews and Ratings</a>
            </li>}
            <li className="nav-item">
              <a className="nav-link" id={acc_type === 'caretaker' ? "transaction-tab" : "transaction-tab2"} data-toggle="tab" href={acc_type === 'caretaker' ? "#transaction" : "#transaction2"} role="tab" aria-controls={acc_type === 'caretaker' ? "transaction" : "transaction2"} aria-selected="true">Past Transactions</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="enquiry-tab" data-toggle="tab" href="#enquiry" role="tab" aria-controls="enquiry" aria-selected="true">Past Enquiries</a>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="true">
                {acc_type === "petowner" ? "Other Info" : "Other Info"}
              </a>
            </li> */}
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
                    <p>{acc_type === 'caretaker' ? acc_type + " (" + employment_type + ")"
                      : acc_type}
                    </p>
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

              <div className="tab-pane fade" id="review" role="tabpanel" aria-labelledby="review-tab">
                {
                  (transactions.filter(transaction => (transaction.owner_rating !== null)).map(filteredTransaction => (
                    <div className="row">
                      <div class="card">
                        <div class="card-header">
                          <h6>
                            {`Pet Owner: ${filteredTransaction.full_name}`}
                          </h6>
                          <h6>
                            {`Pet: ${filteredTransaction.pet_name} (${filteredTransaction.pet_type})`}
                          </h6>
                        </div>
                        <div class="card-body">
                          <h5 class="card-title">{`Rating Given: ${filteredTransaction.owner_rating}/5`}</h5>
                          <p class="card-text">{(filteredTransaction.owner_review !== '') ? filteredTransaction.owner_review : "--"}</p>
                        </div>
                        <div class="card-footer text-muted">
                          {`Date of job: ${parseDate(filteredTransaction.duration_from)} to ${parseDate(filteredTransaction.duration_to)}`}
                        </div>
                      </div>
                    </div>
                  )))
                }
              </div>
              <div className="tab-pane fade" id="transaction" role="tabpanel" aria-labelledby="transaction-tab">
                <div className="row">
                  {
                    transactions.filter(transaction => (transaction.t_status >= 4)).map(filteredTransaction => (
                      <div className="container" >
                        <div class="card">
                          <div class="card-header">
                            <h6>
                              {`Pet Owner: ${filteredTransaction.full_name}`}
                            </h6>
                            <h6>
                              {`Pet: ${filteredTransaction.pet_name} (${filteredTransaction.pet_type})`}
                            </h6>
                          </div>
                          <div class="card-body">
                            <div className="row card-text">
                              <div className="col-md-6">
                                <label>Owner email:</label>
                              </div>
                              <div className="col-md-6">
                                <p>{filteredTransaction.owner_email}</p>
                              </div>
                            </div>
                            <div className="row card-text">
                              <div className="col-md-6">
                                <label>Type:</label>
                              </div>
                              <div className="col-md-6">
                                <p>{filteredTransaction.pet_type}</p>
                              </div>
                            </div>
                            <div className="row card-text">
                              <div className="col-md-6">
                                <label>Gender:</label>
                              </div>
                              <div className="col-md-6">
                                <p>{filteredTransaction.gender}</p>
                              </div>
                            </div>
                            <div className="row card-text">
                              <div className="col-md-6">
                                <label>Special Requirements:</label>
                              </div>
                              <div className="col-md-6">
                                <p>{filteredTransaction.special_req}</p>
                              </div>
                            </div>
                            <div className="row card-text">
                              <div className="col-md-6">
                                <label>Earnings:</label>
                              </div>
                              <div className="col-md-6">
                                <p>{`$${calcEarnings(filteredTransaction.cost, filteredTransaction.duration_from, filteredTransaction.duration_to)}`}</p>
                              </div>
                            </div>
                          </div>
                          <div class="card-footer text-muted">
                            {`Date of job: ${parseDate(filteredTransaction.duration_from)} to ${parseDate(filteredTransaction.duration_to)}`}
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="tab-pane fade" id="transaction2" role="tabpanel" aria-labelledby="transaction2-tab">
                <div className="row">
                  {
                    transactions.filter(transaction => (transaction.t_status >= 4)).map(filteredTransaction => (
                      <div className="container" >
                        <div class="card">
                          <div class="card-header">
                            <h6>
                              {`Caretaker: ${filteredTransaction.full_name}`}
                            </h6>
                            <h6>
                              {`Pet: ${filteredTransaction.pet_name} (${filteredTransaction.pet_type})`}
                            </h6>
                          </div>
                          <div class="card-body">
                            <div className="row card-text">
                              <div className="col-md-6">
                                <label>Caretaker email:</label>
                              </div>
                              <div className="col-md-6">
                                <p>{filteredTransaction.caretaker_email}</p>
                              </div>
                            </div>

                            <div className="row card-text">
                              <div className="col-md-6">
                                <label>Special Requirements:</label>
                              </div>
                              <div className="col-md-6">
                                <p>{filteredTransaction.special_req}</p>
                              </div>
                            </div>
                            <div className="row card-text">
                              <div className="col-md-6">
                                <label>Cost:</label>
                              </div>
                              <div className="col-md-6">
                                <p>{`$${calcEarnings(filteredTransaction.cost, filteredTransaction.duration_from, filteredTransaction.duration_to)}`}</p>
                              </div>
                            </div>
                          </div>
                          <div class="card-footer text-muted">
                            {`Date of job: ${parseDate(filteredTransaction.duration_from)} to ${parseDate(filteredTransaction.duration_to)}`}
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="tab-pane fade" id="enquiry" role="tabpanel" aria-labelledby="enquiry-tab">
                <div className="row">
                  {
                    (enquiries.map(enquiry => (
                      <div className="container">
                        <div class="card">
                          <div class="card-header">
                            <h6>
                              {`Subject: ${enquiry.enq_type}`}
                            </h6>
                            <p>
                              {`Question: ${enquiry.enq_message}`}
                            </p>
                          </div>
                          <div class="card-body">
                            <p class="card-text">{(enquiry.answer !== null) ? `Reply: ${enquiry.answer}` : "Admin has not replied to this yet!"}</p>
                          </div>
                          <div class="card-footer text-muted">
                            {`Date of submission: ${parseDate(enquiry.submission)}`}
                          </div>
                        </div>
                      </div>
                    )))
                  }
                </div>
              </div>

              {/* <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <div className="row">
                  <div className="col-md-6">

                  </div>
                  <div className="col-md-6">
                    <p><label>Can add other details here (Enquiries for Pet Owners/ Transaction history for CareTakers)</label></p>
                  </div>
                </div>
              </div> */}


              
            </div>
          </div>
        </div>
      </div>
    
    </Fragment >
  );
};

export default Profile;