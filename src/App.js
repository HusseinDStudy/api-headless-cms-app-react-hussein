import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [addressData, setAddressData] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const fetchData = async () => {
    try {
      const encodedAddress = encodeURIComponent(inputValue);
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=${encodedAddress}&type=&autocomplete=1`
      );
      setAddressData(response.data.features);
      console.log(response.data.features);
    } catch (error) {
      console.error(error);
    }
  };
  
  const addToDatabase = async (address) => {
    try{
      axios.post("http://localhost:1337/api/addresses", {
        data: {
          label: address.properties.label,
          street: address.properties.street,
          city: address.properties.city,
          postcode: address.properties.postcode,
        },
      }).then((response) => {
        console.log(response);
      }); 
    } catch (error) {
      console.error(error);
    }
  };
  
  

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
      <div className="App">
        <h1>Address Lookup</h1>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={fetchData}>Fetch Address</button>
        {addressData && (
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
              {addressData.map((address) => (
                <tr key={address.properties.id}>
                  <td>{address.properties.label}</td>
                  <td>{address.properties.street}</td>
                  <td>{address.properties.city}</td>
                  <td>{address.properties.postcode}</td>
                  <td>
                    <button onClick={() => addToDatabase(address)}>Add to Strapi</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
       
      </div>
    </div>
  );
};

export default App;
