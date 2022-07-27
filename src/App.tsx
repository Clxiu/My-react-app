/* eslint-disable react/style-prop-object */
import axios from "axios";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import "./App.css";

function App() {
  // declare new state variables
  const [countryLst, setCountryLst] = useState([{"countryCode":"","name":""}]);
  const [countryName, setcountryName] = useState("");
  const [countryInfo, setcountryInfo] = useState<undefined | any>(undefined);
  const [year, setyear] = useState("");
  const [holidayInfo, setholidayInfo] = useState([{"date":"","localName":"","name":"","countryCode":"","fixed":true,"global":true,"counties":null,"launchYear":"","types":["Public"]}]);

  // api address
  const COUNTRY_URL = "https://date.nager.at/api/v3";

  // get all available countries, store the names in countryLst
  const initializeCountries = () => {
    axios
      .get(COUNTRY_URL + "/AvailableCountries")
      .then((res) => {
        setCountryLst(JSON.parse(JSON.stringify(res.data)));
    });
  }
  useEffect(() => {
    initializeCountries();
  }, []);

  // initialize the public holidays 
  const initializeHoliday = () => {
    axios
      .get(COUNTRY_URL + "/NextPublicHolidaysWorldwide")
      .then((res) => {
        setholidayInfo(res.data.slice(0,10));
      });
  }
  useEffect(() => {
    initializeHoliday();
  }, []);

  return (
    <div>
      <h1 style={{"textAlign":"center"}}>Worldwide Public Holiday</h1>

      <div id="search-div">
        <TextField
          id="search-bar"
          className="text"
          value={countryName}
          onChange={(prop: any) => {
            setcountryName(prop.target.value);
          }}
          label="Enter a Country..."
          variant="outlined"
          placeholder="Search..."
          size="small"
        />
        <IconButton
          aria-label="search"
          onClick={() => {
            search();
          }}
        >
          <SearchIcon style={{ fill: "blue" }} />
        </IconButton>
      </div>
      <p id="search-content">You have entered {countryName}</p>
      <p style={{"fontSize":"5px","textAlign":"center"}}>(Click search button to find more.)</p>
      
      <h3>Available Countries:</h3>
      <div id = "parent">
        <div id = "search-result">
        {
          countryLst.filter(search => {
            if (countryName === ''){
              return search;
            }else if (search.name.toLowerCase().includes(countryName.toLowerCase())){
              return search;
            }
          }).map(search => (
            <button onClick = {() => setcountryName(search.name)} className="button"><span>{search.name} ({search.countryCode})</span></button>
          ))
        }
        </div>
      </div>
      {countryInfo === undefined ? (
        <p></p>
      ) : (
        <div id={countryInfo.region} 
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "10px 10px 10px 10px",
        }}>
          <h3>Country Information:</h3>
          <p>Common Name: {countryInfo.commonName}</p>
          <p>Official Name: {countryInfo.officialName}</p>
          <p>Region: {countryInfo.region}</p>
        </div>
      )}
      <br></br>

      <div id="year-bar">
        <TextField
          id="search-year"
          className="text"
          value={year}
          onChange={(prop: any) => {
            setyear(prop.target.value);
          }}
          label="Enter a year (From 1922)..."
          variant="outlined"
          placeholder="Search..."
          size="small"
        />
        <IconButton
          aria-label="search"
          onClick={() => {
            holidaySearch();
          }}
        >
          <SearchIcon style={{ fill: "blue" }} />
        </IconButton>
      </div>
      <p id="year-content">You have entered {year}</p>
      <p style={{"fontSize":"5px","textAlign":"center"}}>(Click search button to find more.)</p>
      
      <h3>Public Holidays:</h3>
      <table className="holiday-table">
        <thead>
          <tr style={{height:"50px"}}>
            <th style={{width:"15%"}}>Date</th>
            <th style={{width:"30%"}}>Local Name</th>
            <th style={{width:"40%"}}>Name</th>
            <th style={{width:"15%"}}>Launch Year</th>
          </tr>
        </thead>
        <tbody id = "year-result">
        {
          holidayInfo.map(searchYear => (
            <tr style={{border:"1px solid black", height:"80px"}}>
              <td>{searchYear.date}</td>
              <td>{searchYear.localName}</td>
              <td>{searchYear.name}</td>
              <td>{(searchYear.launchYear === null) ? "Not available." : searchYear.launchYear}</td>
            </tr>
            ))
        }
        </tbody>
      </table>
    </div>
  );
  
  // country info
  function search(){
    if (countryName === undefined || countryName === "") {
      return;
    }
    const code = countryLst.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    axios
      .get(COUNTRY_URL + "/CountryInfo/" + code?.countryCode)
      .then((res) => {
        setcountryInfo(res.data);
      })
      .catch(() => {
        setcountryInfo(null);
    });
  }

  // holiday info
  function holidaySearch(){
    if (year === undefined || year === "") {
      return;
    }
    if (parseInt(year) < 1922 || parseInt(year) > 2122) {
      alert("Please use year between 1922 and 2122.");
    }
    const code = countryLst.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    axios
      .get(COUNTRY_URL + "/PublicHolidays/" + year + "/" + code?.countryCode)
      .then((res) => {
        setholidayInfo(res.data);
      })
      .catch(() => {
        alert("Please check your entry.");
        setholidayInfo([{"date":"404 Not Found","localName":"404 Not Found","name":"404 Not Found","countryCode":"404 Not Found","fixed":true,"global":true,"counties":null,"launchYear":"404 Not Found","types":["Public"]}]);
    });
  }
}

export default App;