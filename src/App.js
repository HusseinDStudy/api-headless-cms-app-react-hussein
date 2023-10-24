import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const App = () => {
  const [inputValue, setInputValue] = useState('');// Input value For Gouv API Fetch
  const [addressData, setAddressData] = useState(null);// Gouv API
  const [addressesOnStrapiDb, setAddresses] = useState([]);// Strapi DB

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const fetchDataFromGouv = async () => {
    try {
      const encodedAddress = encodeURIComponent(inputValue);
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=${encodedAddress}&type=&autocomplete=1`
      );
      setAddressData(response.data.features);
    } catch (error) {
      console.error(error);
    }
  };
  
  const addToDatabase = async (address) => {
    try{
      await axios.post("http://localhost:1337/api/addresses", {
        data: {
          label: address.properties.label,
          street: address.properties.street,
          city: address.properties.city,
          postcode: address.properties.postcode,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataFromStrapiDB = async () => {
    try {
      const response = await axios.get("http://localhost:1337/api/addresses");
      setAddresses(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataFromStrapiDB().then((response) => {
      console.log(response);
    });
  }, [addressesOnStrapiDb]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
        <h1>Address Lookup</h1>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={fetchDataFromGouv}>Fetch Address</button>
        <button onClick={fetchDataFromStrapiDB}>Fetch Strapi Addresses</button>
        {addressData && (
          <div>
            <h1>Fetched Gouv Data</h1>
            <table>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Street</th>
                  <th>City</th>
                  <th>Postcode</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  addressData.map((address) => (
                  <tr key={address.properties.id}>
                      <td>{address.properties.label}</td>
                      <td>{address.properties.street}</td>
                      <td>{address.properties.city}</td>
                      <td>{address.properties.postcode}</td>
                      <td>
                        <button onClick={() => addToDatabase(address)}>Add to Strapi</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}

        {addressesOnStrapiDb && (
            <div>
              <h1>Fetched Strapi Data</h1>
              <table>
                <thead>
                <tr>
                  <th>Label</th>
                  <th>Street</th>
                  <th>City</th>
                  <th>Postcode</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                {
                  addressesOnStrapiDb.map((saved_address) => (
                    <tr key={saved_address.id}>
                      <td>{saved_address.attributes.label}</td>
                      <td>{saved_address.attributes.street}</td>
                      <td>{saved_address.attributes.city}</td>
                      <td>{saved_address.attributes.postcode}</td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            </div>
        )}
    </div>
  );
};

export default App;
