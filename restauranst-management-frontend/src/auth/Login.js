import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useLocation} from 'react-router-dom';
import AuthUser from "./AuthUser";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useForm} from "react-hook-form";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const defaultTheme = createTheme();


export default function SignInSide() {
    const location = useLocation();
    const { httpClient, setToken } = AuthUser();
    const { email: prefillEmail, password: prefillPassword } = location.state || {};
    const [formData, setFormData] = useState({
        email: prefillEmail,
        password: prefillPassword,
    });


    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await httpClient.post('/login', data);
            setToken(response.data.user, response.data.access_token);
        } catch (error) {
            console.error('Login failed:', error);
            handleClickOpen();
        }
    };

    function Copyright(props) {
        return (
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                <Link color="inherit" href="/login">
                    RM By Yassine & Mohamed & Zakia
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 0.4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#FB923C' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            defaultValue={prefillEmail}
                            id="email"
                            label="Email Address"
                            onChange={handleChange}
                            name="email"
                            autoComplete="email"
                            autoFocus
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            onChange={handleChange}
                            type="password"
                            defaultValue={prefillPassword}
                            id="password"
                            autoComplete="current-password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 4,
                                    message: 'Password must be at least 4 characters',
                                },
                            })}
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                            sx={{mt: 2}}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit(onSubmit)}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid >
                                <Link href="/signup" item style={{marginLeft: 65}} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5, mb: 2 }} />
            </Container>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Login Error!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        There was an error logging in. Please check your credentials and try again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}
