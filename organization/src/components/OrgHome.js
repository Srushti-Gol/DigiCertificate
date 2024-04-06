import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import '../assets/orghome.css'
import '../assets/orgRequest.css'
import TokenMaster from '../abis/TokenMaster.json'; // Replace 'YourContractABI.json' with your actual ABI file path
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { Link } from "react-router-dom";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const OrgHome = () => {
  const [open, setOpen] = React.useState(false);
  const [account, setAccount] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [organizations, setOrganizations] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
    console.log("opening.....");
  };
  const handleClose = () => {
    setOpen(false);
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


  return (
    <div>
      <>
        <div className="navigation-container">
          <div className="logo-container">
            <div className="logo-text">Safe Doc</div>
          </div>
          {account ? (
            <button type="button" className='connect-button-container'>
              {account.slice(0, 6) + '...' + account.slice(38, 42)}
            </button>
          ) : (
            <button type="button" className="connect-button-container" onClick={connectHandler}>
              Connect
            </button>
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

              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Register Organization
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
                <div className="mac-like-form">
                  <div className="form-group">
                    <label htmlFor="orgName">Organization Name</label>
                    <input
                      id="orgName"
                      type="text"
                      placeholder="Organization Name"
                      required={true}
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="orgEmail">Organization Email</label>
                    <input
                      id="orgEmail"
                      type="email"
                      placeholder="name@example.com"
                      required={true}
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                    />
                  </div>
                </div>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={registerOrganization}>
                  Submit
                </Button>
              </DialogActions>
            </BootstrapDialog>
            <Link to="/org-request"><button className="connect-button">Requests</button></Link>
          </div>
        </div>
      </>
    </div>
  )
}

export default OrgHome;
