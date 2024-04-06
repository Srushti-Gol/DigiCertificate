import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TokenMaster from '../abis/TokenMaster.json';
import { v4 as uuidv4 } from 'uuid';

const Navigation = () => {
  const [account, setAccount] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestsList, setrequestsList] = useState([])
  const getReqList = async () => {
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    const contractABI = TokenMaster;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const newReqList = await contract.getRequests();
    console.log(newReqList);
    setrequestsList(newReqList);
  }

  const connectHandler = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const registerOrganization = async () => {
    try {
      const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
      const contractABI = TokenMaster;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Get the current nonce of the account
      const nonce = await provider.getTransactionCount(account);

      // Call the registerOrg function on your contract with the correct nonce
      await contract.registerOrg(orgName, orgEmail, { nonce });

      console.log('Organization registered successfully!');

      // Refresh organizations after registration
      await fetchOrganizations();
    } catch (error) {
      console.error('Error registering organization:', error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
      const contractABI = TokenMaster;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call the getOrganizations function on your contract
      const fetchedOrganizations = await contract.getOrganizations();

      setOrganizations(fetchedOrganizations);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleRequestSubmit = async () => {
    try {
      if (!selectedOrganization) {
        throw new Error('Please select an organization.');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
      const contractABI = TokenMaster;
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log(selectedOrganization);
      const timeStamp = parseInt(new Date() / 1000);
      const registerRequest = await contract.regRequest(
        selectedOrganization,
        uuidv4(),
        requestTitle,
        requestDescription,
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


  useEffect(() => {
    if (account) {
      fetchOrganizations();
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      getReqList();
    }
  }, [account]);

  return (
    <>
      <nav>
        {account ? (
          <button
            type="button"
            className='nav__connect'
          >
            {account.slice(0, 6) + '...' + account.slice(38, 42)}
          </button>
        ) : (
          <button
            type="button"
            className='nav__connect'
            onClick={connectHandler}
          >
            Connect
          </button>
        )}

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

        <div>
          <h2>Register Request</h2>
          <div>
            <label>Organization:</label>
            <select value={selectedOrganization} onChange={(e) => setSelectedOrganization(e.target.value)}>
              <option value="">Select Organization</option>
              {organizations.map((org, index) => (
                <option key={index} value={org.organizationAddress}>
                  {org.organizationName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Title:</label>
            <input type="text" value={requestTitle} onChange={(e) => setRequestTitle(e.target.value)} />
          </div>
          <div>
            <label>Description:</label>
            <textarea value={requestDescription} onChange={(e) => setRequestDescription(e.target.value)} />
          </div>
          <button onClick={handleRequestSubmit}>Submit Request</button>
        </div>

      </nav>

      <div>
  <table>
    <thead>
      <tr>
        <th scope="col" class="px-4 py-3">Request ID</th>
        <th scope="col" class="px-4 py-3">Title</th>
        <th scope="col" class="px-4 py-3">Description</th>
        <th scope="col" class="px-4 py-3">Department</th>
        <th scope="col" class="px-4 py-3">Status</th>
        <th scope="col" class="px-4 py-3">
          <span class="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
    <tbody>
      {requestsList.map((nestedArray) => (
        <tr key={nestedArray[0]}> {/* Assuming the first element of each nested array is the unique identifier */}
          <th
            scope="row"
            class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            
            {nestedArray[0].slice(0, 5) + '...' + nestedArray[0].slice(32, 36)}
          </th>
          <td class="px-4 py-3">{nestedArray[4]}</td> {/* Accessing title from index 4 */}
          <td class="px-4 py-3">{nestedArray[5]}</td> {/* Accessing description from index 5 */}
          <td class="px-4 py-3">{nestedArray[10]}</td> {/* Accessing department from index 10 */}
          <td class="px-4 py-3">{nestedArray[9].toString()}</td> {/* Accessing status from index 9 */}
          <td class="px-4 py-3" onclick="window.location='https://www.google.com/'"> {/* Add your action here */}
            View
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </>
  )
}

export default Navigation