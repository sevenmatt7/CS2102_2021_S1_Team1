import React, { Fragment, useState } from "react"

import NavBar from "./NavBar"

const ContactUs = () => {
    const [state, setState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const sendEmail = event => {
        event.preventDefault();

        console.log('We will fill this up shortly.');
        // code to trigger Sending email
    };

    const onInputChange = event => {
        const { name, value } = event.target;

        setState({
            ...state,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('hi')
    }

    return (
        <Fragment>
            <NavBar />

            <h1>Submit your enquiries here!</h1>

            <form id="contact-form" onSubmit={handleSubmit} method="POST">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">User ID</label>
                    <input type="email" className="form-control" aria-describedby="emailHelp" />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Enquiry</label>
                    <textarea className="form-control" rows="5"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

            {/* <form onSubmit={sendEmail}> */}

            {/* <div className="form-group" controlId="name">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={state.name}
                        placeholder="Enter your full name"
                    // onChange={onInputChange}
                    />
                </Form.Group> */}
            {/* <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        name="email"
                        value={state.email}
                        placeholder="Enter your email"
                        onChange={onInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="subject">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                        type="text"
                        name="subject"
                        value={state.subject}
                        placeholder="Enter subject"
                        onChange={onInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="subject">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="message"
                        value={state.message}
                        rows="3"
                        placeholder="Enter your message"
                        onChange={onInputChange}
                    />
                </Form.Group> */}
            {/* <button className="btn btn-warning" variant="primary" type="submit">
                    Submit
                </button>
            </form> */}
        </Fragment>
    )
}

export default ContactUs