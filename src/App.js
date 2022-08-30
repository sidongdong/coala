import './App.css';
import Home from'./Home.js';
import Login from'./Login.js';
import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return(
    <Router>
      <div>
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/next" element={<Home/>} />
          
        </Routes>
      </div>
    </Router>
  )
}

export default App;