import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { createTheme, styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { ThemeProvider } from '@emotion/react';
import { useState } from 'react';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    padding: 20,
    marginTop: '10vh',
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignIn(props) {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const defaultTheme = createTheme({ palette: { mode: 'dark' } });
    const [userCredentials, setUserCredentials] = useState({
        email: '',
        password: ''
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserCredentials({ ...userCredentials, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:5050/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userCredentials)
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                if (data.token.length > 0) {
                    console.log('Logged in successfully');
                    window.location.href = '/';
                } else {
                    console.log('Login failed');
                }
            })
            .catch(error => console.log('Error:', error)
            )
    };

    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField error={emailError} helperText={emailErrorMessage} id="email" type="email" name="email"
                                placeholder="your@email.com" autoComplete="email" autoFocus required fullWidth variant="outlined"
                                color={emailError ? 'error' : 'primary'} sx={{ ariaLabel: 'email' }} onChange={handleChange}/>
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <Link component="button" onClick={handleClickOpen} variant="body2" sx={{ alignSelf: 'baseline' }}>
                                    Forgot your password?
                                </Link>
                            </Box>
                            <TextField error={passwordError} helperText={passwordErrorMessage} name="password" placeholder="Password"
                                type="password" id="password" autoComplete="current-password" autoFocus required fullWidth 
                                variant="outlined" color={passwordError ? 'error' : 'primary'} onChange={handleChange}/>
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <ForgotPassword open={open} handleClose={handleClose} />
                        <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
                            Sign in
                        </Button>
                        <Divider>or</Divider>
                        <Typography sx={{ textAlign: 'center' }}>
                            Don&apos;t have an account?{' '}
                            <span>
                                <Link href="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
                                    Sign up
                                </Link>
                            </span>
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </ThemeProvider>
    );
}