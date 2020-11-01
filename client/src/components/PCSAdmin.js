import React, { Fragment, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ChartistGraph from 'react-chartist'
import Chartist from 'chartist';
import MyLegend from 'chartist-plugin-legend';
import PCSTable from "./PCSTable"
import { toast } from "react-toastify";


const PCSAdmin = () => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [yearOptions, setYearOptions] = useState([])
  const [yearDisplayed, setYearDisplayed] = useState('')
  const [pieState, setPieState] = useState({
    monthDisplayed: '',
    data: {
      labels: ["Full-Time", "Part-Time"],
      series: []
    },
    options: {
      chartPadding: 10,
      labelOffset: 50,
      labelDirection: 'explode',
    }
  })

  const [lineState, setLineState] = useState({
    data: {
      labels: monthNames,
      series: []
    },
    options: {
      plugins: [
        Chartist.plugins.legend({
          legendNames: ['Full-Time', 'Part-Time', 'Total']
        })
      ]
    }
  })

  const [managed, setManagedCaretakers] = useState([])
  const [baseprice, setBasePrice] = useState();

  const onChange = (e) => {
    setBasePrice(e.target.value)
  }

  const getManagedCareTakers = async () => {
    try {
        const res = await fetch("http://localhost:5000/admin/caretakers", {
            method: "GET",
            headers: { token: localStorage.token }
        });
        const jsonData = await res.json();
        setManagedCaretakers(jsonData);
    } catch (err) {
        console.error(err.message);
    }
  };

  const changeBasePrice = async (e) => {
    try {
        const body = { baseprice };
        const response = await fetch("http://localhost:5000/admin/changeprice", {
            method: "PUT",
            headers: { "Content-Type": "application/json",
                        token: localStorage.token },
            body: JSON.stringify(body)
        });
        
        const submittedData = await response.json();
        toast.success("You have changed the base price!");
    } catch (err) {
        console.error(err.message);
    }
  }

  // get number of full-time & part-time jobs for each month of the year
  const getLineData = async () => {
    try {
      console.log("enter getLineData")
      const year = yearDisplayed.toString()
      const response = await fetch('http://localhost:5000/pcsline?' + new URLSearchParams({
        year: year
      }), {
        method: "GET"
      });
      const data = await response.json()
      let numFulltime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      let numParttime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      let numTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      data.map(datum => {
        let month = datum.startyearmonth.substring(5)
        if (month.includes('-')) {
          month = month.substring(0, 1)
        }
        if (datum.employment_type === 'fulltime') {
          numFulltime[parseInt(month) - 1] = parseInt(datum.count)
        } else if (datum.employment_type === 'parttime') {
          numParttime[parseInt(month) - 1] = parseInt(datum.count)
        }
      })
      for (let i = 0; i < numTotal.length; i++) {
        console.log(numFulltime[i])
        numTotal[i] = numFulltime[i] + numParttime[i]
      }
      setLineState(prevState => {
        return {
          ...prevState,
          data: {
            labels: monthNames,
            series: [
              numFulltime,
              numParttime,
              numTotal
            ]
          }
        };
      });

    } catch (err) {
      console.error(err.message)
    }
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
      };
    });
    setYearDisplayed(d.getFullYear().toString())
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

  const getCurrentDate = () => {
    var dt = new Date();
    return dt.getDate() + " " + (monthNames[dt.getMonth()]) + " " + dt.getFullYear();
  }

  const getPieData = async () => {
    try {
      const duration = yearDisplayed + "-" + (parseInt(pieState.monthDisplayed) + 1).toString()
      const response = await fetch('http://localhost:5000/pcspie?' + new URLSearchParams({
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
    getManagedCareTakers()
  }, [])

  useEffect(() => {
    getLineData()
    getPieData()
  }, [yearDisplayed])

  useEffect(() => {
    getPieData()
  }, [pieState.monthDisplayed])

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">

          <main role="main" className="col-md-12 ml-sm-auto col-lg-12 px-md-4">
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
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="yearDisplayed">Year</label>
              </div>
              <select className="form-control" value={yearDisplayed} onChange={e => setYearDisplayed(e.target.value)} >
                {
                  yearOptions.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))
                }
              </select>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="card ">
                  <div className="card-header ">
                    <h4 className="card-title">No. of pets taken care of</h4>
                    <div className="card-category">

                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <label className="input-group-text" htmlFor="monthDisplayed">Month</label>
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
                    <ChartistGraph data={lineState.data} type="Line" options={lineState.options} />
                  </div>
                  <div className="card-footer ">
                    <div className="legend">
                    </div>
                    <hr />
                    <div className="stats">
                      <i className="fa fa-history"></i> Updated {getCurrentDate()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            
            <div className="row">

              <div className="col-md-6">
                <div className="card ">
                  <div className="card-header ">
                    <h4 className="card-title">Caretakers under management</h4>
                    <div className="input-group mb-3">
                      
                      <input type="text"
                       name="baseprice"
                       placeholder="Enter base price here to change"
                       className="form-control"
                      value={baseprice}
                      onChange={e => onChange(e)} />
                    <div className="input-group-append">
                      <button className="btn btn-warning" type="button" onClick={e => changeBasePrice(e)}>Change</button>
                    </div>
                    </div>
                  </div>
                  
                  <div className="card-body ">
                  {managed.map((caretaker, i) => (
                      <div className="card mb-3">
                        <div className="card-body">
                          <h5>Name: {caretaker.full_name}</h5>
                          <p>Rating: {caretaker.avg_rating}</p>
                          <p>Base price/day: ${caretaker.base_price}</p>
                        </div>
                     </div>)
                  )}
                  </div>
                </div>
              </div>

            
            </div>






            <PCSTable />
          </main>
        </div>
      </div>
    </Fragment>
  )
}

export default PCSAdmin