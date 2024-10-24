import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Dashboard from './Components/Dashboard';
import SignUp from './Components/Signup';
import Login from './Components/Login';
import RequestLeave from "./Components/RequestLeave";
import Sidebar from "./Components/Sidebar";
import Profile from "./Components/Profile";
import { useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme, Stack, styled } from "@mui/material";

const AppContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  padding: 4,
  margin: 'auto',
  backgroundColor: '#0c1017',
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed'
    // 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}))

function App() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
  const defaultTheme = createTheme({ palette: { mode: 'dark' } });
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppContainer>
        <Router>
          <Routes>
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<Login />} />

            <Route path='/' element={<Sidebar userName={userName} setUserName={setUserName}><Dashboard /></Sidebar>} />
            <Route path='/requestleave' element={<Sidebar userName={userName} setUserName={setUserName}><RequestLeave /></Sidebar>} />
            <Route path="/profile" element={<Sidebar userName={userName} setUserName={setUserName}><Profile /></Sidebar>} />
          </Routes>
        </Router>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
