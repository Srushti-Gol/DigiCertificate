import React from 'react';
import { useState, useEffect } from 'react';
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import TokenMaster from '../abis/TokenMaster.json';
import { v4 as uuidv4 } from 'uuid';

const ConsumerRequestPage = () => {
  const [account, setAccount] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [selectedOrganizations, setSelectedOrganizations] = useState(null);
  const connectHandler = async () => {
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Set the connected account
        setAccount(accounts[0]);
      } else {
        console.log('MetaMask not detected. Please install MetaMask to connect.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  useEffect(() => {
    connectHandler();
    fetchOrganizations();
  }, [account]);

  const fetchOrganizations = async () => {
    try {
      const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
      const contractABI = TokenMaster;
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call the getOrganizations function on your contract
      const fetchedOrganizations = await contract.getOrganizations();

      setOrganizations(fetchedOrganizations);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!selectedOrganizations) {
        throw new Error('Please select an organization.');
      }

      const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
      const contractABI = TokenMaster;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log(selectedOrganizations);
      const timeStamp = parseInt(new Date() / 1000);
      const registerRequest = await contract.regRequest(
        selectedOrganizations,
        uuidv4(),
        title,
        description,
        "Marksheet",
        timeStamp.toString(),
        "Registrar"
      );
      console.log(registerRequest);

      console.log('Request registered successfully!');
    } catch (error) {
      console.error('Error registering request:', error);
    }
  };

  return (
    <>
      <div className="form-container">
        <form className='form'>
          <h1 className='h1_in_reg'>Request Form</h1>
          <div className="input-container">
            <label>Organization:</label>
            <select value={selectedOrganizations} onChange={(e) => setSelectedOrganizations(e.target.value)}>
              <option value="">Select Organization</option>
              {organizations.map((org, index) => (
                <option key={index} value={org.organizationAddress}>
                  {org.organizationName}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="id">Title :</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="input-container">
            <label htmlFor="mobile">Description:</label>
            <input type="tel" id="mobile" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="button-container">
            <button type="submit" className="register-button" onClick={handleRequestSubmit}> Register</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ConsumerRequestPage;