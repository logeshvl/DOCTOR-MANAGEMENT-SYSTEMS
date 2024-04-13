import { TextFields } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';


const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(12, 0),
}));

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    return (
        <div title="Reset Password" sx={{ height: 1 }}>
            <RootStyle>
                <Container>
                    <Box sx={{ maxWidth: 480, mx: 'auto' }}>
                        {!sent ? (
                            <>
                                <Typography variant="h3" paragraph>
                                    Forgot your password?
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                                    Please enter the email address associated with your account and We will email you a link to reset your
                                    password.
                                </Typography>

                                <TextFields />

                                <Button fullWidth size="large" component={RouterLink} to={"/"} sx={{ mt: 1 }}>
                                    Back
                                </Button>
                            </>
                        ) : (
                            <Box sx={{ textAlign: 'center' }}>
                               

                                <Typography variant="h3" gutterBottom>
                                    Request sent successfully
                                </Typography>
                                <Typography>
                                    We have sent a confirmation email to &nbsp;
                                    <strong>{email}</strong>
                                    <br />
                                    Please check your email.
                                </Typography>

                                <Button size="large" variant="contained" component={RouterLink} to={"/"} sx={{ mt: 5 }}>
                                    Back
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Container>
            </RootStyle>
        </div>
    );
}
