import React, { Fragment, useState, useEffect } from "react"

import NavBar from "./NavBar"

const ContactUs = () => {
    const [state, setState] = useState({
        subject: '',
        message: '',
        date: new Date()
    });

    const [enquiries, setEnquiries] = useState([])

    const onInputChange = event => {
        console.log("enter onInputChange")
        const { name, value } = event.target;

        setState({
            ...state,
            [name]: value
        });
        console.log(state)
    };

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            // console.log(e)
            console.log((new Date()).getDate())
            setState({
                ...state,
                datetime: new Date().toLocaleDateString()
            })
            const body = state
            // console.log(body)
            const response = await fetch(
                "http://localhost:5000/contact",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            )
            window.location.reload(false)
        } catch (err) {
            console.error(err.message)
        }
    }

    const getEnquiries = async () => {
        try {
            const response = await fetch("http://localhost:5000/contact")
            const data = await response.json()
            setEnquiries(data)
        } catch (err) {
            console.error(err.message)
        }
    }



    // get enquiries on mount
    useEffect(() => {
        getEnquiries()
    }, [])

    return (
        <Fragment>
            <h1>Submit your enquiries here!</h1>

            <form onSubmit={handleSubmit}>

                <div className="form-group" controlId="subject">
                    <label>Subject</label>
                    <input
                        type="text"
                        className="form-control"
                        name="subject"
                        value={state.subject}
                        placeholder="Enter subject"
                        onChange={onInputChange}
                    />
                </div>

                <div className="form-group" controlId="subject">
                    <label>Message</label>
                    <textarea
                        className="form-control"
                        name="message"
                        value={state.message}
                        rows="3"
                        placeholder="Enter your message"
                        onChange={onInputChange}
                    />
                </div>
                <button className="btn btn-primary" variant="primary" type="submit">
                    Submit
                </button>
            </form>
            <br></br>
            <h2>FAQ</h2>
            <table className="table mt-5">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                        <td>John</td>
                        <td>Doe</td>
                        <td>john@example.com</td>
                    </tr> */}
                    {
                        enquiries.map(enquiry => (
                            <tr key={enquiry.e_id}>
                                <td>{enquiry.enq_type}</td>
                                <td>
                                    {enquiry.enq_message}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </Fragment>
    )
}

export default ContactUs