import React, { useState, useEffect } from 'react';
import TokenMaster from '../abis/TokenMaster.json'; // Replace 'YourContractABI.json' with your actual ABI file path
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";


const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
export default function Home() {
  const [account, setAccount] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [organizations, setOrganizations] = useState([]);

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

  const registerOrganization = async () => {
    try {
      const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
      const contractABI = TokenMaster;
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Get the current nonce of the account
      const nonce = await provider.getTransactionCount(account);

      // Call the registerOrg function on your contract with the correct nonce
      await contract.registerOrg(orgName, orgEmail, { nonce });

      console.log('Organization registered successfully!');

    } catch (error) {
      console.error('Error registering organization:', error);
    }
  };

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

  useEffect(() => {
    if (account) {
      fetchOrganizations();
    }
  }, [account]);

  return (
    <>
      <div>
        {account ? (
          <button type="button" className='nav__connect'>
            {account.slice(0, 6) + '...' + account.slice(38, 42)}
          </button>
        ) : (
          <button type="button" className='nav__connect' onClick={connectHandler}>
            Connect
          </button>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="border-solid border-5 border-blue-700">
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">Organization Name</div>
            <input
              id="orgName"
              type="text"
              placeholder="Organization Name"
              required={true}
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">Organization Email</div>
            <input
              id="orgEmail"
              type="email"
              placeholder="name@example.com"
              required={true}
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
            />
          </div>
          <button type="submit" onClick={registerOrganization}>
            Submit
          </button>
        </div>
      </div>

      {/* Display organizations */}
      <div>
        <h2>Registered Organizations:</h2>
        <ul>
          {organizations.map((org, index) => (
            <li key={index}>
              Name: {org.organizationName}, Email: {org.organizationEmail}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
