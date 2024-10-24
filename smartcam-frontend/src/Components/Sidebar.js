import styled from "@emotion/styled";
import { colors, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import logo from './../Content/Logo.png';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SidebarContainer = styled(Stack)(({ theme }) => ({
    width: '18%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c1017',
    borderRight: '1px solid #2d3748',
}));

const Sidebar = ({ userName, setUserName, children }) => {
    const [currentTab, setCurrentTab] = useState('Home');
    const navigate = useNavigate();

    const handleClick = (tabText, url) => {
        if (tabText === "Logout") {
            fetch('http://localhost:5050/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
                .then(response => {
                    if (response.status === 200) {
                        setUserName(null)
                        localStorage.clear()
                        tabText = 'Home'
                    }
                    else throw new Error('Something went wrong');

                })
        }
        setCurrentTab(tabText);
        navigate(url ? `/${url}` : '/');
    }

    let sidebarListItem = [
        { text: 'Login', url: 'login' }
    ]
    if (localStorage.getItem('role') === 'faculty') {
        sidebarListItem = [
            { text: 'Home', url: '' },
            { text: 'Request Leave', url: 'requestleave' },
            { text: 'Profile', url: 'profile' },
            { text: `Logout`, url: '' }
        ];
    } else if (localStorage.getItem('role') === 'admin') {
        sidebarListItem = [
            { text: 'Home', url: '' },
            { text: 'Manage Users', url: 'manageUsers' },
            { text: 'Attendance', url: 'attendance' },
            { text: 'Notifications', url: 'notifications' },
            { text: `Logout`, url: '' }
        ]
    }

    return (
        <div style={{ display: 'flex' }}>
            <SidebarContainer direction="column" justifyContent="space-between" textAlign="center">
                <img src={logo} alt="Logo" style={{ marginTop: '2vh', height: '15vh', width: '10vw', cursor: 'pointer' }} onClick={() => navigate('/')}></img>
                {userName ? (<Typography component='h4' variant="h1" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: 'white' }}>Hi {userName}</Typography>)
                    : ''}
                <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'center', color: 'white' }}>
                    <List >
                        {sidebarListItem.map((item, index) => (
                            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton selected={currentTab === item.text} onClick={() => handleClick(item.text, item.url)}>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Stack>
            </SidebarContainer>
            {children}
        </div>
    )
}

export default Sidebar;