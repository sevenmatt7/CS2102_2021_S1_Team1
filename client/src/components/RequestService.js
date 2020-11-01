import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";

const RequestService = ({ search, i }) => {
    
    // const pet_type = search.type_pref;
    const caretaker_email = search.caretaker_email;
    const employment_type = search.employment_type;
    const avail_from = search.service_avail_from
    const avail_to = search.service_avail_to
    const daily_price = search.daily_price

    const[petList, setPets] = useState([]);
    
    const [inputs, setInputs] = useState({
        service_request_from: "",
        service_request_to: "",
    });

    const {service_request_from, service_request_to} = inputs;
    
    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const [transfer_mode, setTransferMode] = useState(1);
    const [payment_mode, setPaymentMode] = useState(1);

    const [selected_pet, selectPet] = useState('');
    const [selected_petType, selectPetType] = useState('');
    
    const setPetTypes = (value) => {
        selectPet(value);
        petList.map((pet) => {
            if (pet.pet_name === value) selectPetType(pet.pet_type);
        });
    }

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
           
            const body = { caretaker_email, employment_type, selected_petType, avail_from, avail_to, 
                           service_request_from, service_request_to, daily_price, transfer_mode, 
                           selected_pet, payment_mode};
            const response = await fetch("http://localhost:5000/submitbid", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                            token: localStorage.token },
                body: JSON.stringify(body)
            });
            
            const submittedData = await response.json();
            
            // Log successful if the bid has been inserted, if not show to user that there is an error
            if (submittedData.duration_from) {
                const start_date = submittedData.duration_from;
                const end_date = submittedData.duration_to;
                const successMessage = 'You have submitted your offer for ' + start_date + ' to ' +
                                    end_date + '!';
                toast.success(successMessage);
            } else {
                switch (submittedData) {
                    case 'new row for relation "transactions_details" violates check constraint "transactions_details_check1"':
                        toast.error("The caretaker cannot take care of pets in the specified period you are trying to bid for!")
                        break;
                    case 'insert or update on table "transactions_details" violates foreign key constraint "transactions_details_caretaker_email_pet_type_service_avai_fkey"':
                        toast.error("The caretaker cannot take care of the pet you have specified in your bid!")
                        break;
                    default:
                        toast.error("There is an error in submitting your bid, please check it again")
                        break;
                }
            }
            
        } catch (err) {
            console.error(err.message);
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
                            onChange={e => setPetTypes(e.target.value)} required="required">
                                <option selected >Choose...</option>
                                {petList.map((pet, i) => (
                                    <option value={pet.pet_name}>{pet.pet_name}</option>
                                ))}
                            </select>

                            <label className="my-1 mr-2" htmlFor="modeOfPetXfer">How would you like to pay?</label>
                            <select className="custom-select mt-2 mb-4 mr-sm-2" id="modeOfPetXfer" value={payment_mode} 
                            onChange={e => setPaymentMode(e.target.value)} required="required">
                                <option selected disabled>Choose...</option>
                                <option value="1">Cash</option>
                                <option value="2">Credit Card</option>
                            </select>

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
                                <input type="date" 
                                id="startDate" 
                                name="service_request_from"
                                value={service_request_from}
                                onChange={e => onChange(e)}
                                className="form-control validate" 
                                min="2020-01-01" 
                                max="2099-12-31" 
                                required="required" />
                            </div>

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right" htmlFor="endDate">End Date</label>
                                <input type="date" 
                                id="endDate" 
                                name="service_request_to"
                                value={service_request_to}
                                onChange={e => onChange(e)}
                                className="form-control validate" 
                                min="2020-01-01" 
                                max="2099-12-31" 
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