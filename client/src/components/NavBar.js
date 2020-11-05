import React, { Fragment } from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import { toast } from "react-toastify";


export default function NavBar({ isAuth, setAuth }) {

    const acc_type = localStorage.acc_type;
    const emp_type = localStorage.emp_type;
    const logout = async e => {
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("acc_type");
            if (localStorage.emp_type) {
                localStorage.removeItem("emp_type");
            }
            setAuth(false);
            toast.success("Logout successfully");
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            <Navbar variant="dark" expand="md" sticky="top" style={{ padding: "0", backgroundColor: "#b19cd9" }}>
                <Container>
                    <Navbar.Brand style={{ paddingTop: "0", marginRight: "2rem" }} href="/c/home">
                        <img
                            alt=""
                            src={process.env.PUBLIC_URL + '/PetSocietyShadow.png'}
                            width="175"
                            height="50"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            {acc_type !== "caretaker" && <Nav.Link href="/c/sitters">Caretakers</Nav.Link>}
                            <Nav.Link href="/c/contact">Contact Us</Nav.Link>
                            {acc_type === "caretaker" && emp_type === "parttime" && <Nav.Link href="/c/setavail">Indicate availabilites</Nav.Link>}
                            {acc_type === "caretaker" && emp_type === "fulltime" && <Nav.Link href="/c/takeleave">Take Leave</Nav.Link>}
                            {acc_type === "petowner" && <Nav.Link href="/c/registerpet">Pet registration</Nav.Link>}
                            {acc_type === "admin" && <Nav.Link href="/c/pcsenquiries">Enquiries</Nav.Link>}
                        </Nav>
                        <Nav>
                            {!isAuth && <Nav.Link id="login" href="/c/login">Login</Nav.Link>}
                            {!isAuth && <Nav.Link id="register" eventKey={2} href="/c/register">Register</Nav.Link>}
                            {isAuth && <Nav.Link id="logout" eventKey={3} href="/c" onClick={e => logout(e)}>Logout</Nav.Link>}
                            {isAuth && <Nav.Link id="profile" eventKey={4} href="/c/profile">My Profile</Nav.Link>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Fragment>
    );
}
