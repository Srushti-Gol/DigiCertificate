import React, { useEffect, useState } from "react";
import TokenMaster from '../abis/TokenMaster.json'; // Replace 'YourContractABI.json' with your actual ABI file path
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

const Documents = () => {
    const [account, setAccount] = useState(null);
    const [requestsList, setRequestsList] = useState(null); // State to track the selected request


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

      const getReqList = async () => {
        try {
            const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
            const contractABI = TokenMaster;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const newReqList = await contract.getRequests();
            console.log(newReqList);
            setRequestsList(newReqList);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };
    useEffect(() => {
        connectHandler();
        getReqList();
    },[account]);

    const handleDownload = async () => {
        try {
            // File path to download
            const filePath = 'https://gateway.pinata.cloud/ipfs/Qmb1Cpu5PSVzNtHJ4F7PDudtssSAaptQLdMXyGFYjQTSm7';
            
            // Fetch the file
            const response = await fetch(filePath);
            
            // Convert the response to blob
            const blob = await response.blob();
            
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'filename.pdf'; // Specify the file name here
            a.click();
            
            // Clean up
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };
    

    return (
        <>
         <table>
                <thead>
                    <tr>
                        <th scope="col" className="header-cell">Request ID</th>
                        <th scope="col" className="header-cell">Title</th>   
                        <th scope="col" className="header-cell">Action</th>   
                    </tr>
                </thead>
                <tbody>
                    {requestsList && requestsList.map((nestedArray) => {
                        if(nestedArray[9].status == 2){
                        <tr key={nestedArray[0]}>
                            <td className="data-cell">{nestedArray[0].slice(0, 5) + '...' + nestedArray[0].slice(32, 36)}</td>
                            <td className="data-cell">{nestedArray[4]}</td>
                            <td>
                            <button onClick={handleDownload}>Download</button>
                        </td>
                        </tr>
                        }
                    })}
                </tbody>
            </table>
        </>
    );
};

export default Documents;