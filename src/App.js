import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';


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
        `https://api-adresse.data.gouv.fr/search/?q=${encodedAddress}&type=housenumber&autocomplete=1`
      );
      setAddressData(response.data.features);
      console.log(response.data.features);
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
              </tr>
            </thead>
            <tbody>
              {addressData.map((address) => (
                <tr key={address.properties.id}>
                  <td>{address.properties.label}</td>
                  <td>{address.properties.street}</td>
                  <td>{address.properties.city}</td>
                  <td>{address.properties.postcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* <StripeCheckout
          token={handleToken}
          stripeKey="YOUR_STRIPE_PUBLISHABLE_KEY"
          amount={100} // Amount in cents ($1)
          name="Payment Example"
        /> */}
      </div>
    </div>
  );
};

export default App;
