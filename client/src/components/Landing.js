import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Navbar, Nav, Container, Form, Row, Col, Jumbotron as Jumbo } from 'react-bootstrap';

const LandingPage = () => {

    const [pet, setPet] = useState([
        "Dog",
        "Cat",
        "Fish",
        "Rabbit",
        "Bird",
        "Reptile"
    ]);
    const [name, setName] = useState("");
    const addPet = (name) => {
        setPet([...pet, name])
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        addPet(name)
        setName("");
    };

    const [query, setQuery] = useState([
        { animal_type: "Dog", from: "", to: "" }
    ]);

    const handleSubmitForm = async () => {
        try {
            const a_type = query['animal_type'];
            const ffrom = query['from'];
            const tto = query['to'];
            const res = await fetch('http://localhost:5000/caretakersh?' + new URLSearchParams({
                animal_type: a_type,
                from: ffrom,
                to: tto
            }), {
                method: "GET"
            });
            const homeSelect = await res.json(); //homeSelect is the state to be sent to sitters for display
            this.setState({ homeSelect });
            this.props.history.push({
                pathname: "/sitters",
                state: homeSelect
            });
        } catch (error) {
            console.log(error.message)
        }

    };

    return (
        <Fragment>

            <Jumbo fluid className="jumbo">
                <div className="overlay"></div>

                <div class="container mt-4 text-center">
                    <h1 class="display-3 font-weight-bold">Welcome to Pet Society!</h1>
                    <hr color="white"></hr>
                    <p>Browse services offered by our trusted sitters, based on what you or your beloved pet needs.</p>
                </div>

            </Jumbo>

            <div>
                <ul>
                    {pet.map(pet => {
                        return (
                            <li key={pet}> {pet} </li>
                        );
                    })}
                </ul>
                <form onSubmit={handleSubmit}>
                    <label> Pet Name </label>
                    <input type="text" value={name} required placeholder="Enter pet..." onChange={(e) => setName(e.target.value)} />
                    <input type="submit" value="Add Pet" />
                </form>
            </div>

            <div class="card mx-auto" style={{ width: "30rem", backgroundColor: "#eaddf7" }}>
                <div class="card-body">
                    <label> Select your pet:</label>
                    <div>
                        <button type="button" id="btnDog" class="btn btn-outline-info">Dog</button>
                        <button type="button" id="btnCat" class="btn btn-outline-info">Cat</button>
                        <button type="button" id="btnFish" class="btn btn-outline-info">Fish</button>
                        <button type="button" id="btnRabbit" class="btn btn-outline-info">Rabbit</button>
                        <button type="button" id="btnBird" class="btn btn-outline-info">Bird</button>
                        <button type="button" id="btnReptile" class="btn btn-outline-info">Reptile</button>
                    </div>
                </div>
            </div>

            {/* <div class="container-fluid  p-3" style={{backgroundColor: "#ffffff"}}>
                <div class="card mx-auto" style={{ width: "30rem", backgroundColor: "#eaddf7" }}>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="formGroupExampleInput">Select your pet:</label>
                            <select class="form-control form-control-lg">
                                <option value="">-NIL-</option>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Fish">Fish</option>
                                <option value="Rabbit">Rabbit</option>
                                <option value="Bird">Bird</option>
                                <option value="Repltile">Reptile</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput">Select service type:</label>
                            <select class="form-control form-control-lg">
                                <option value="">-NIL-</option>
                                <option>Large select</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput">Select (?)</label>
                            <select class="form-control form-control-lg">
                                <option value="">-NIL-</option>
                                <option>Large select</option>
                            </select>
                        </div>
                        <div class="text-right">
                        <button type="button" class="btn btn-success">Search!</button>
                        </div>
                    </div>
                </div>
            </div> */}



        </Fragment >
    );

};

export default LandingPage;