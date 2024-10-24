import { Button, Container, Stack, styled, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RequestLeave = () => {
    const [leaveData, setLeaveData] = useState({
        from: '',
        to: '',
        reason: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLeaveData({ ...leaveData, [e.target.id]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (leaveData.from === '' || leaveData.to === '' || leaveData.reason === '') {
            alert("Error")
            return;
        }

        alert("Success");
        navigate('/');
    }

    return (
        <Container maxWidth="lg" sx={{ m: 2 }}>
            <Typography component="h1" variant="h4">
                Request Leave
            </Typography>
            <form onSubmit={handleSubmit} style={{ padding: '2%' }}>
                <TextField id="from" label="From" type="date" sx={{ mt: 2, mr: 8, mb: 4, width: '40%' }} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                <TextField id="to" label="To" type="date" sx={{ mt: 2, mb: 4, width: '40%' }} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                <TextField id="reason" label="Reason" multiline rows={4} fullWidth sx={{ mt: 2 }} onChange={handleChange} />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} >Submit</Button>
            </form>
        </Container>
    )
}

export default RequestLeave;