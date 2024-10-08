import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import {observer} from 'mobx-react-lite';
import {FormEvent, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {appStore} from '../store/AppStore.tsx';
import {login} from '../api/authApi.ts';
import {authStore} from '../store/AuthStore.ts';
import {statisticsStore} from '../store/StatisticsStore.ts';
import {chartStore} from '../store/ChartStore.ts';

const defaultTheme = createTheme();

export const SignIn: React.FC = observer(() => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
        }
    }, []);

    const handleSignIn = async (event: FormEvent) => {
        event.preventDefault();
        const values = {
            email: email,
            password: password,
        };
        try {
            appStore.setIsLoading(true);
            localStorage.setItem('email', values.email);
            localStorage.setItem('password', values.password);

            const response = await login(values);

            await authStore.setToken(response.data.token);

            await statisticsStore.loadStatistics();
            await chartStore.loadChartStatistics();

            if (authStore.tokenValid) {
                navigate('/dashboard');
            }
            appStore.setIsLoading(false);
            appStore.showSuccessMessage('Вход выполнен!');
        } catch (e: any) {
            appStore.setIsLoading(false);
            appStore.showErrorMessage(e, 'Login failed');
        }
    };


    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSignIn} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}

                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {'Don\'t have an account? Sign Up'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
});
