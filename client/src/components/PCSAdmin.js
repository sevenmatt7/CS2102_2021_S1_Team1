import React, { Fragment, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ChartistGraph from 'react-chartist'




const PCSAdmin = () => {
  const [yearOptions, setYearOptions] = useState([])
  const [pieState, setPieState] = useState({
    monthDisplayed: '',
    yearDisplayed: '',
    data: {
      labels: ["Full-Time", "Part-Time"],
      series: []
    },
    options: {
      // width: '100%',
      // total: 200,
      // donut: true,
      // donutSolid: true,
      chartPadding: 10,
      labelOffset: 50,
      labelDirection: 'explode',
      // labelPosition: 'outside'
    }

  })

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var data = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
    series: [
      [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
    ]
  };

  // var options = {
  //   high: 10,
  //   low: -10,
  //   axisX: {
  //     labelInterpolationFnc: function (value, index) {
  //       return index % 2 === 0 ? value : null;
  //     }
  //   }
  // };

  let dataSales = {
    labels: [
      "9:00AM",
      "12:00AM",
      "3:00PM",
      "6:00PM",
      "9:00PM",
      "12:00PM",
      "3:00AM",
      "6:00AM"
    ],
    series: [
      [287, 385, 490, 492, 554, 586, 698, 695],
      [67, 152, 143, 240, 287, 335, 435, 437],
      [23, 113, 67, 108, 190, 239, 307, 308]
    ]
  }

  const getCurrentDate = () => {
    var dt = new Date();
    return dt.getDate() + " " + (monthNames[dt.getMonth()]) + " " + dt.getFullYear();
  }

  const setMonthDisplayed = e => {
    const monthIndex = e.target.value
    setPieState(prevState => {
      return {
        ...prevState,
        monthDisplayed: monthIndex
      }
    })
  }

  const setYearDisplayed = e => {
    const year = e.target.value
    setPieState(prevState => {
      return {
        ...prevState,
        yearDisplayed: year
      }
    })
  }

  const getCurrMonthYear = () => {
    var d = new Date();
    var years = new Array(10);
    for (var i = 0; i < 10; i++) {
      years[i] = d.getFullYear() - i
    }
    setYearOptions(years)
    setPieState(prevState => {
      return {
        ...prevState,
        monthDisplayed: d.getMonth().toString(),
        yearDisplayed: d.getFullYear().toString()
      };
    });



  }

  const getPieData = async () => {
    try {
      const duration = pieState.yearDisplayed + "-" + (parseInt(pieState.monthDisplayed) + 1).toString()
      const response = await fetch('http://localhost:5000/PCS?' + new URLSearchParams({
        duration: duration
      }), {
        method: "GET"
      });
      const data = await response.json()
      setPieState(prevState => {
        return {
          ...prevState,
          data: {
            labels: ["Full-Time", "Part-Time"],
            series: [data[0].count, data[1].count]
          }
        };
      });
    } catch (err) {
      console.error(err.message)
    }
  }

  // get prev month on mount
  useEffect(() => {
    getCurrMonthYear()
  }, [])

  // get pie data whenever monthDisplayed and yearDispalyed gets updated
  useEffect(() => {
    getPieData()
  }, [pieState.monthDisplayed, pieState.yearDisplayed])

  return (
    <Fragment>

      {/* <NavBar /> */}
      {/* <div className="wrapper">

        <Sidebar />
        <div className="main-panel">
          <NavBar />
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/profile" component={UserProfile} />
            <Redirect from='*' to='/dashboard' />
          </Switch>
          <Footer />
        </div>
      </div> */}


      {/* <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <Link className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" to="/home">Pet Society</Link>

        <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" />
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <a className="nav-link" href="#">Sign out</a>
          </li>
        </ul>
      </nav> */}


      <div className="container-fluid">
        <div className="row">
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="sidebar-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link className="nav-link active" to="/PCS">
                    <span data-feather="home"></span>
                    Dashboard <span className="sr-only">(current)</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">
                    <span data-feather="file"></span>
                    Enquiries
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="shopping-cart"></span>
                    Products
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="users"></span>
                    Customers
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="bar-chart-2"></span>
                    Reports
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="layers"></span>
                    Integrations
                  </a>
                </li>
              </ul>

              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span>Saved reports</span>
                <a className="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
                  <span data-feather="plus-circle"></span>
                </a>
              </h6>
              <ul className="nav flex-column mb-2">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file-text"></span>
                    Current month
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file-text"></span>
                    Last quarter
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file-text"></span>
                    Social engagement
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file-text"></span>
                    Year-end sale
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Dashboard</h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
                  <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
                </div>
                <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                  <span data-feather="calendar"></span>
                  This week
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="card ">
                  <div className="card-header ">
                    <h4 className="card-title">No. of pets taken care of</h4>
                    <div className="card-category">
                      {pieState.dateDisplayed}
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <label class="input-group-text" for="yearDisplayed">Year</label>
                        </div>
                        <select className="form-control" value={pieState.yearDisplayed} onChange={setYearDisplayed} >
                          {
                            yearOptions.map((year, index) => (
                              <option key={index} value={year}>{year}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <label class="input-group-text" for="monthDisplayed">Month</label>
                        </div>
                        <select
                          className="form-control"
                          value={pieState.monthDisplayed}
                          onChange={setMonthDisplayed}
                        >
                          {
                            monthNames.map((month, index) => (
                              <option key={index} value={index}>{month}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="card-body ">
                    <ChartistGraph data={pieState.data} type="Pie" options={pieState.options} />
                    <div className="legend">
                      {/* <i className="fa fa-circle text-info"></i> Open
                      <i className="fa fa-circle text-danger"></i> Bounce
                      <i className="fa fa-circle text-warning"></i> Unsubscribe */}
                      <p>Total number of jobs: {parseInt(pieState.data.series[0]) + parseInt(pieState.data.series[1])}</p>
                      <p>Number of Full-timer jobs: {pieState.data.series[0]}</p>
                      <p>Number of Part-timer jobs: {pieState.data.series[1]}</p>
                    </div>
                    <hr />
                    <div className="stats">
                      <i className="fa fa-clock-o"></i> Today's date: {getCurrentDate()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="card">
                  <div className="card-header ">
                    <h4 className="card-title">Number of jobs this year</h4>
                    <p className="card-category">2020</p>
                  </div>
                  <div className="card-body ">
                    <ChartistGraph data={dataSales} type="Line" />
                  </div>
                  <div className="card-footer ">
                    <div className="legend">
                      {/* <i className="fa fa-circle text-info"></i> Open
                      <i className="fa fa-circle text-danger"></i> Click
                      <i className="fa fa-circle text-warning"></i> Click Second Time */}
                    </div>
                    <hr />
                    <div className="stats">
                      <i className="fa fa-history"></i> Updated 3 minutes ago
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <h2>Overview</h2>
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>C_id</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Number of jobs taken</th>
                    <th>Salary</th>
                  </tr>
                </thead>
              </table>
            </div>
          </main>
        </div>
      </div>
    </Fragment>
  )
}

export default PCSAdmin