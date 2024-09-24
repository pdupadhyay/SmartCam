import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Dashboard from './Components/Dashboard';
import SignUp from './Components/Signup';
import Login from './Components/Login';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='' element={<Dashboard/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
