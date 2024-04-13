import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Link, Container, Typography,Button } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logos from '../assets/logo.png';
import { LoginForm } from '../sections/auth/login';
import { useNavigate } from 'react-router-dom';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const LoginPage = () => {
  const navigate = useNavigate();
  const mdUp = useResponsive('up', 'md');
  const navigateToRegister = () => {
    navigate('/register');
  };
  const navigateToDoctor = () => {
    navigate('/doctor-login');
  };

  const logoStyle = {
    height: '40px',
    position: 'fixed',
    // top:34,
    // left:35,
    top: '34px',
    left: '35px',
  };

  return (
    <>
      <Helmet>
        <title> Login </title>
      </Helmet>

      <StyledRoot>
        {/* <Logos
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        /> */}
        <img src={Logos} style={logoStyle} />
        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign in to User
            </Typography>
            <Typography variant="body2" sx={{ mb: 5 }}>
              Don’t have an account? {''}
              <Link style={{ cursor: 'pointer' }} onClick={navigateToRegister}>
                Get started
              </Link>
            </Typography>
            <LoginForm />
            <Button  size="large" variant="contained" sx={{mt:2}} onClick={navigateToDoctor}>doctor login</Button>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
};
export default LoginPage;
