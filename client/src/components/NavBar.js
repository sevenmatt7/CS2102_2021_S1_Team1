import React, { Fragment } from "react"
import { Link } from "react-router-dom"

const NavBar = () => {
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Pet Society</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon">lol</span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExample07">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="/">Home<span className="sr-only">(current)</span></Link>
                {/* <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> */}
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/FAQ">FAQ</Link>
              </li>
              {/* <li className="nav-item">                                
                                <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                            </li> */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="dropdown07" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                <div className="dropdown-menu" aria-labelledby="dropdown07">
                  <a className="dropdown-item" href="#">Action</a>
                  <a className="dropdown-item" href="#">Another action</a>
                  <a className="dropdown-item" href="#">Something else here</a>
                </div>
              </li>
            </ul>
            <form className="form-inline my-2 my-md-0">
              <input className="form-control" type="text" placeholder="Search" aria-label="Search" />
            </form>
          </div>
        </div>
      </nav>
    </Fragment>
  )
}

export default NavBar

// import React, { Fragment } from 'react'
// import { Link } from 'react-router-dom'

// const Navbar = () => {
//   return (
//     <Fragment>
//       <nav className="navbar navbar-expand-lg " color-on-scroll="500">
//         <div className="container-fluid">
//           <Link className="navbar-brand" to="/dashboard">Dashboard</Link>
//           <div className="collapse navbar-collapse justify-content-end" id="navigation">
//             <ul className="navbar-nav ml-auto">
//               <li className="nav-item">
//                 <Link className="nav-link" to='/'>
//                   <span className="no-icon">Log out</span>
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </Fragment>
//   )
// }


// export default Navbar