import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import OrgHome from './components/OrgHome';
import OrgRequest from './components/OrgRequest';

function App() {
  return (
    <div className="App">
      <Router>

        <Routes>
          <Route path="/test" element={<Home />} />
          <Route path="/" element={<OrgHome />} />
          <Route path="/org-request" element={<OrgRequest />} />

        </Routes>

      </Router>
    </div>
  );
}

export default App;
