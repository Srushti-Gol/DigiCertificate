import React, { useState, useEffect } from 'react';
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import TokenMaster from '../abis/TokenMaster.json';
import { v4 as uuidv4 } from 'uuid';
import '../assets/home.css';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import { Link } from 'react-router-dom';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const ConsumerHomePage = () => {
    // const navigate = Navigate();
    const [open, setOpen] = React.useState(false);
    const [account, setAccount] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentMobile, setStudentMobile] = useState('');
    const [studentDetails, setStudentDetails] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
        console.log("opening.....");
    };
    const handleClose = () => {
        setOpen(false);
    };

    const registerStudent = async () => {
        try {
            const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
            const contractABI = TokenMaster;
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            // Call the registerStudent function on your contract
            if (account == null) {
                alert("Please Connect First");
            }
            else {
                await contract.registerStudent(studentName, studentId, studentEmail, studentMobile);
                console.log('Student registered successfully!');
                setStudentDetails({ studentName, studentId, studentEmail, studentMobile });
            }
            setStudentEmail("");
            setStudentId(0);
            setStudentMobile("");
            setStudentName("");
        } catch (error) {
            console.error('Error registering student:', error);
        }
    };

    const getStudentDetails = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; // Update with your contract address
            const contractABI = TokenMaster; // Your contract's ABI
            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            // Call the getStudentDetails function on your contract
            const fetchedStudentDetails = await contract.getStudentDetails();

            setStudentDetails(fetchedStudentDetails);
        } catch (error) {
            console.error('Error fetching student details:', error);
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
                console.log("Hi");
            } else {
                console.log('MetaMask not detected. Please install MetaMask to connect.');
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    };

    useEffect(() => {
        if (account) {
            getStudentDetails();
        }
    }, [account])
    return (
        <>
            <div className="navigation-container">
                <div className="logo-container">
                    <div className="logo-text">Safe Doc</div>
                </div>
                {account ? (
                    <div className="connect-button-container">
                        <button type="button" className='nav__connect'>
                            {account.slice(0, 6) + '...' + account.slice(38, 42)}
                        </button>
                    </div>
                ) : (
                    <div className="connect-button-container">
                        <button className="connect-button" onClick={connectHandler}>Connect</button>
                    </div>
                )}


            </div>
            <div className="grey-line"></div>
            <div className="safe-doc-decentralized-certification-dashboard">
                <div className="text-box">
                    <div className="decentralized-text">Decentralized</div>
                    <div className="certification-text">Certification</div>
                </div>
                <div className="buttons-container">
                    <button className="register-button" onClick={handleClickOpen}>Register</button>
                    <BootstrapDialog
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={open}
                    >

                        {console.log("opening2.....")}
                        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            Modal title
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent dividers>
                            <div >
                                <div>
                                    <div>
                                        <div >Name</div>
                                        <input
                                            id="stuName"
                                            type="text"
                                            placeholder="Name"
                                            required={true}
                                            value={studentName}
                                            onChange={(e) => setStudentName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <div>ID Number</div>
                                        <input
                                            id="stuID"
                                            type="text"
                                            placeholder="ID Number"
                                            required={true}
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <div>Email</div>
                                        <input
                                            id="stuEmail"
                                            type="email"
                                            placeholder="name@example.com"
                                            required={true}
                                            value={studentEmail}
                                            onChange={(e) => setStudentEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <div>Mobile</div>
                                        <input
                                            id="stuMobile"
                                            type="text"
                                            placeholder="Mobile No"
                                            required={true}
                                            value={studentMobile}
                                            onChange={(e) => setStudentMobile(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={registerStudent}>
                                Submit
                            </Button>
                        </DialogActions>
                    </BootstrapDialog>
                    <Link to="/request"><button className="connect-button" >Request</button></Link>
                    <Link to="/doc"><button className="connect-button">Document</button></Link>
                </div>
                {studentDetails &&
                    <div style={{color:"white"}}>
                        <div>
                            Name : {studentDetails.studentName}
                        </div>
                        <br />
                        <div>
                            Email : {studentDetails.studentEmail}
                        </div>
                        <br />
                        <div>
                            ID : {studentDetails.studentId}
                        </div>
                        <br />
                        <div>
                            Mobile : {studentDetails.studentMobile}
                        </div>
                        <br />
                    </div>
                }

            </div>
        </>
    );
};

export default ConsumerHomePage;