import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";

const RequestService = ({ search, i }) => {
    const pet_type = search.type_pref;
    const caretaker_email = search.caretaker_email;
    const employment_type = search.employment_type;
    
    const[petList, setPets] = useState([]);
    
    const [inputs, setInputs] = useState({
        service_request_from: "",
        service_request_to: "",
        bidding_offer: 0,
    });

    const {service_request_from, service_request_to, bidding_offer } = inputs;
    
    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const [transfer_mode, setTransferMode] = useState(1);

    const [selected_pet, selectPet] = useState('');

    const getPetList = async () => {
        try {
            const response = await fetch("http://localhost:5000/pets", {
                                        method: "GET",
                                        headers: {token: localStorage.token}
                                        });
            const jsonData = await response.json();
            setPets(jsonData);
          
        } catch (error) {
          console.log(error.message)
        }
      };

    const submitBid = async (e) => {
        e.preventDefault();
        try {
            const service_request_period = service_request_from + ',' + service_request_to;
           
            const body = { caretaker_email, employment_type, pet_type, service_request_period, bidding_offer, transfer_mode, selected_pet};
            const response = await fetch("http://localhost:5000/submitbid", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                            token: localStorage.token },
                body: JSON.stringify(body)
            });
            
            const parseResponse = await response.json();
            let dateArr = parseResponse.split(',')
            const successMessage = 'You have submitted your offer for ' + dateArr[0] + ' to ' +
                                    dateArr[1] + '!';
            toast.success(successMessage);
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <Fragment>
            <button className="btn btn-success" data-toggle="modal" data-target={`#id${i}`}
              onClick={e => getPetList(e)}>Request service!</button>
              
            <div className="modal fade" id={`id${i}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Request Service from {search.full_name}!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body mx-3">
                        <label className="my-1 mr-2" htmlFor="modeOfPetXfer">Which pet?</label>
                        
                            <select className="custom-select mt-2 mb-4 mr-sm-2" value={selected_pet} 
                            onChange={e => selectPet(e.target.value)} required="required">
                                <option selected >Choose...</option>
                                {petList.map((pet, i) => (
                                    <option value={pet.pet_name}>{pet.pet_name}</option>
                                ))}
                            </select>

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Bidding Offer ($ per hr)</label>
                                <input type="number" 
                                pattern="[0-9]+" 
                                maxLength="4" 
                                name="bidding_offer"
                                value={bidding_offer}
                                onChange={e => onChange(e)}
                                id={`bid${search.full_name}`} 
                                className="form-control validate" 
                                required="required" />
                            </div>

                            <label className="my-1 mr-2" htmlFor="modeOfPetXfer">Mode of Pet Transfer</label>
                            <select className="custom-select mt-2 mb-4 mr-sm-2" id="modeOfPetXfer" value={transfer_mode} 
                            onChange={e => setTransferMode(e.target.value)} required="required">
                                <option selected disabled>Choose...</option>
                                <option value="1">Pet Owner deliver</option>
                                <option value="2">Care Taker pickup</option>
                                <option value="3">Transfer via building at PCS</option>
                            </select>

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right" htmlFor="startDate">Start Date</label>
                                <input type="datetime-local" 
                                id="startDate" 
                                name="service_request_from"
                                value={service_request_from}
                                onChange={e => onChange(e)}
                                className="form-control validate" 
                                min="2020-01-01T23:59" 
                                max="2099-12-31T23:59" 
                                required="required" />
                            </div>

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right" htmlFor="endDate">End Date</label>
                                <input type="datetime-local" 
                                id="endDate" 
                                name="service_request_to"
                                value={service_request_to}
                                onChange={e => onChange(e)}
                                className="form-control validate" 
                                min="2020-01-01T23:59" 
                                max="2099-12-31T23:59" 
                                required="required" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" data-dismiss="modal" 
                             onClick={e => submitBid(e)}>Submit Bidding</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default RequestService;