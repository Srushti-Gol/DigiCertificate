import React, { useState } from 'react';
import { ethers } from 'ethers';
import TokenMaster from '../abis/TokenMaster.json';

const StudentRegistration = () => {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);

  const registerStudent = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; // Update with your contract address
      const contractABI = TokenMaster; // Your contract's ABI
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call the registerStudent function on your contract
      await contract.registerStudent(studentName, studentId, studentEmail, studentMobile);

      console.log('Student registered successfully!');
    } catch (error) {
      console.error('Error registering student:', error);
    }
  };

  const getStudentDetails = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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

  return (
    <div>
      <h2>Student Registration</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      </div>
      <div>
        <label>Student ID:</label>
        <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
      </div>
      <div>
        <label>Mobile:</label>
        <input type="text" value={studentMobile} onChange={(e) => setStudentMobile(e.target.value)} />
      </div>
      <button onClick={registerStudent}>Register Student</button>

      <h2>Get Student Details</h2>
      <button onClick={getStudentDetails}>Fetch Student Details</button>

      {studentDetails && (
        <div>
          <h3>Student Details:</h3>
          <p>Name: {studentDetails.studentName}</p>
          <p>Student ID: {studentDetails.studentId}</p>
          <p>Email: {studentDetails.studentEmail}</p>
          <p>Mobile: {studentDetails.studentMobile}</p>
        </div>
      )}
    </div>
  );
};

export default StudentRegistration;
