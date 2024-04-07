import React, { useState, useEffect } from 'react';
import TokenMaster from '../abis/TokenMaster.json'; // Replace 'YourContractABI.json' with your actual ABI file path
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
// import IPFS from 'ipfs-http-client';
import { v4 as uuidv4 } from "uuid";
import { PDFDocument } from "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";
import download from "downloadjs";
import QRCode from 'qrcode';
import axios from 'axios';
import FormData from 'form-data';

const OrgRequest = () => {
    const [requestsList, setRequestsList] = useState([]);
    const [account, setAccount] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null); // State to track the selected request
    const [comment, setComment] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [uuid, setUuid] = useState(uuidv4());
    const [cid, setCid] = useState(null);
    const [path,setPath] = useState(null);
    // const [pdfFile, setPdfFile] = useState(null);

    let pdfBytes;

    useEffect(() => {
        connectHandler();
        getReqList();
    }, []); // Empty dependency array ensures this effect runs only once when component mounts

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

    const handleViewDetails = (nestedArray) => {
        // Find the selected request from requestsList based on the requestId
        // const selected = requestsList.find((request) => request[0] === requestId);
        setSelectedRequest(nestedArray);
    };

    const handleFileUpload = async (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadToIPFS = async () => {
        let canvas = document.getElementById("canvas");

        QRCode.toCanvas(canvas, uuid, function (error) {
            if (error) console.error(error);
            console.log("success!");
        });

        let imgData = canvas.toDataURL("image/jpeg", 1.0);

        console.log(selectedFile);
        // const buffer = await selectedFile.arrayBuffer();
        let existingPdfBytes = await selectedFile.arrayBuffer();
        console.log(existingPdfBytes);
        const pdfBytes = new Uint8Array(existingPdfBytes);
        // Load a PDFDocument from the existing PDF bytes
        // const pdfDoc = await PDFDocument.load(pdfBytes);

        // console.log(pdfDoc);
        // // Get the first page of the document
        // const pages = pdfDoc.getPages();
        // const firstPage = pages[0];

        // // Get the width and height of the first page
        // const { width } = firstPage.getSize();

        // const jpgImage = await pdfDoc.embedJpg(imgData);

        // const jpgDims = jpgImage.scale(0.5);

        // firstPage.drawImage(jpgImage, {
        //     x: width - jpgDims.width,
        //     width: jpgDims.width,
        //     height: jpgDims.height,
        // });

        // Serialize the PDFDocument to bytes (a Uint8Array)
       // pdfBytes = await pdfDoc.save();
        download(pdfBytes, "verified.pdf", "application/pdf");
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const file = [new File([blob], "verified_doc.pdf")];
        // setPdfFile(pdfFile);

        // Upload PDF file to Pinata Cloud
        await pinFileToIPFS(selectedFile);
    };

    // const pinFileToIPFS = async (file) => {
    //     const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyNjcyYmRhZC0zMDhiLTQxMzItYWNlZS0yYjFiNGIzMzBlOGEiLCJlbWFpbCI6ImdvbHNydXNodGkxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0MmQwNjQzNTA3ODFlNjVlNTk1OSIsInNjb3BlZEtleVNlY3JldCI6IjkwYjE2ZTRmODZkOWVjNjJmM2IzMWI2Nzc5NDhiODUxMzljOTU5YzMzYjNhNTExMGQ2ZjgwMWMwNGMxYWM2ZDkiLCJpYXQiOjE3MTI0NDAxNDd9.vlU4osEfI7w-3mfQoypdwsm3I_gLiWug5Fj-mW2ue6Q";
    //     const formData = new FormData();
    //     formData.append('file', file);
    
    //     // const pinataMetadata = JSON.stringify({
    //     //     name: 'verified_doc.pdf', // Specify the file name
    //     // });
    //     // formData.append('pinataMetadata', pinataMetadata);
    
    //     // const pinataOptions = JSON.stringify({
    //     //     cidVersion: 0,
    //     // });
    //     // formData.append('pinataOptions', pinataOptions);
    
    //     try {
    //         const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    //             headers: {
    //                 'Content-Type': `multipart/form-data`,
    //                 'Authorization': `Bearer ${JWT}`
    //             }
    //         });
    //         console.log(res.data);
    //     } catch (error) {
    //         console.log(error.response.data); // Log the error response for debugging
    //     }
    // };

    const pinFileToIPFS = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const metadata = JSON.stringify({
              name: "MarkSheet",
            });
            formData.append("pinataMetadata", metadata);
      
            const options = JSON.stringify({
              cidVersion: 0,
            });
            formData.append("pinataOptions", options);
            const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyNjcyYmRhZC0zMDhiLTQxMzItYWNlZS0yYjFiNGIzMzBlOGEiLCJlbWFpbCI6ImdvbHNydXNodGkxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2Y2UzNDAxNWNjOTk4NDk5ZWQ4OSIsInNjb3BlZEtleVNlY3JldCI6IjkwODEzZjU1MmQ4OTQ2NjBmODVhNjY0OGJlNjc4NzVmNDlhMjkxNThhOWE2MmE3YzZhMDVhMmY3MDA5NTNiNGQiLCJpYXQiOjE3MTI0NDcxNjZ9.00O4AOifg9uXb6mRsH13DHOb2GCyE5RmMfoiO7hVsU8';
            const res = await axios({
                method: "POST",
                url : "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data : formData,
                headers: {
                    pinata_api_key : '6ce34015cc998499ed89',
                    pinata_secret_api_key : '90813f552d894660f85a6648be67875f49a29158a9a62a7c6a05a2f700953b4d',
                    "Content-Type" : "multipart/form-data",
                },
                body: formData,
              }
            );
            console.log(res);
            const  IpfsHash  = res.data.IpfsHash;
        const pathToFile = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;

        console.log('CID:', IpfsHash);
        console.log('Path to file:', pathToFile);
          setCid(IpfsHash);
          setPath(pathToFile)
          } catch (error) {
            console.log(error);
          }
    };
    


    const handleAcceptRequest = async () => {
        connectHandler();
        const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
        const contractABI = TokenMaster;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const today = new Date();
        const timeNow = Math.floor(today.getTime() / 1000);
        console.log(selectedRequest);
        console.log(selectedRequest.requestId);
        console.log(selectedRequest.cid);
        console.log(selectedRequest.uuid);
        const newReqList = await contract.updateStatus(
            selectedRequest.requestId,
            cid,
            2,
            uuid,
            timeNow,
            comment
        );
        console.log(newReqList);
        connectHandler();
    };

    const handleRejectRequest = async () => {
        const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
        const contractABI = TokenMaster;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const today = new Date();
        const timeNow = Math.floor(today.getTime() / 1000);
        console.log(selectedRequest.requestId,
            "",
            3,
            "",
            timeNow,
            comment);
        const newReqList = await contract.updateStatus(
            selectedRequest.requestId,
            "",
            3,
            "",
            timeNow,
            comment
        );
        connectHandler();
    };

    const handleViewPDF = () => {
        if (selectedFile) {
            const fileURL = path;
            window.open(fileURL);
        } else {
            console.log('No file selected');
        }
    };
    
    return (
        <div className="mac-form">
            <table>
                <thead>
                    <tr>
                        <th scope="col" className="header-cell">Request ID</th>
                        <th scope="col" className="header-cell">Title</th>
                        <th scope="col" className="header-cell">Description</th>
                        <th scope="col" className="header-cell">Department</th>
                        <th scope="col" className="header-cell">Status</th>
                        <th scope="col" className="header-cell">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {requestsList.map((nestedArray) => (
                        <tr key={nestedArray[0]}>
                            <td className="data-cell">{nestedArray[0].slice(0, 5) + '...' + nestedArray[0].slice(32, 36)}</td>
                            <td className="data-cell">{nestedArray[4]}</td>
                            <td className="data-cell">{nestedArray[5]}</td>
                            <td className="data-cell">{nestedArray[10]}</td>
                            <td className="data-cell">{nestedArray[9].toString()}</td>
                            <td className="data-cell" onClick={() => handleViewDetails(nestedArray)}>
                                View
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedRequest && (
                <div className="container mt-4">
                    <h3>Selected Request Details</h3>
                    <p>Request ID: {selectedRequest[0]}</p>
                    <p>Title: {selectedRequest[4]}</p>
                    <hr />
                    <p>Request Type: {selectedRequest.requestType}</p>
                    <p>Status: {selectedRequest[9].toString()}</p>
                    <p>Department: {selectedRequest[10]}</p>
                    <p>Comments: {selectedRequest.comments}</p>
                    <p>Student Address: {selectedRequest.studentAddress}</p>
                    <p>Description: {selectedRequest[5]}</p>
                    <input  type="file" onChange={handleFileUpload} />
                    <button onClick={handleUploadToIPFS}>Upload to IPFS</button>
                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add comment" />
                    <button onClick={handleAcceptRequest}>Accept Request</button>
                    <button onClick={handleRejectRequest}>Reject Request</button>
                    <button onClick={handleViewPDF}>View PDF</button>
                    <canvas id="canvas"></canvas>
                </div>
            )}
        </div>
    );
};

export default OrgRequest;
