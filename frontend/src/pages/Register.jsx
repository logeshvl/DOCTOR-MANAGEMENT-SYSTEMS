import { LoadingButton } from '@mui/lab';
import {
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Loader from 'src/components/loader/loader';
import HttpServices from 'src/services/httpService';
import { userModuleURL } from 'src/services/urlService';
import { CookiesStorage } from 'src/utils/storage';
import { useToaster } from 'src/utils/toaster/toasterContext';
import ValidationTool from 'src/utils/validationHelper';
import '../assets/css/common.css';
import Logos from '../assets/logo.png';
import Iconify from '../components/iconify';
import useResponsive from '../hooks/useResponsive';

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

const Register = () => {
  const mdUp = useResponsive('up', 'md');

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formSchema, setFormSchema] = useState({});
  const [formValidationErrors, setFormValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const { showToast } = useToaster();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let token = CookiesStorage.getItem('token');
    if (token) navigate('/dashboard');
    else generateFormModelSchema();
  }, []);

  useEffect(() => { }, [
    email,
    password,
    firstName,
    formSchema,
    formValidationErrors,
  ]);

  const generateFormModelSchema = () => {
    let fields = [
      ValidationTool.GenerateSchema('firstName', 'First Name', 'TEXT', true),
      ValidationTool.GenerateSchema('email', 'Email', 'TEXT', true),
      ValidationTool.GenerateSchema('password', 'Password', 'TEXT', true),
    ];
    const schema = ValidationTool.GenerateSchemaModel(fields);
    setFormSchema(schema);
  };

  const handleInputChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'firstName':
        setFirstName(value);
        break;
      default:
        break;
    }
  };

  const handleOnBlur = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    let validationErrors = { ...formValidationErrors };
    let message = ValidationTool.ValidateInput(formSchema, fieldValue, fieldName);
    if (message) validationErrors[fieldName] = message;
    else validationErrors[fieldName] = '';
    setFormValidationErrors(validationErrors);
  };

 

  const handleCreateNewUser = () => {
    setLoading(true);
    let registerForm = {
      username: firstName,
      email: email,
      password: password,
    };
    let postProps = {
      url: userModuleURL.userRegister,
      body: registerForm,
      successCallback,
      failureCallback
    }
    HttpServices.Post(postProps);
  };

  const successCallback = (data, message) => {
    message && showToast(message.message);
    navigate('/login', { replace: true });
  }

  const failureCallback = (message) => {
    message && showToast(message, "e");
    setLoading(false);
  }

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <title> Register </title>
      </Helmet>

      <StyledRoot>
        <img
          src={Logos}
          style={{
            height: '40px',
            position: 'fixed',
            top: '34px',
            left: '35px',
          }}
        />
        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome to Doctor Management system
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Register in to User
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Already have an account? {''}
              <Link variant="subtitle2" onClick={navigateToLogin} className="pointer">
                Click here
              </Link>
            </Typography>
            <Stack spacing={3} sx={{ mb: 5 }}>
              <TextField
                error={formValidationErrors?.firstName}
                color={firstName === '' ? 'error' : 'success'}
                name="firstName"
                label="User Name"
                onChange={handleInputChange}
                value={firstName}
                helperText={formValidationErrors?.firstName}
                onBlur={handleOnBlur}
              />
              <TextField
                error={formValidationErrors?.email}
                color={email === '' ? 'error' : 'success'}
                name="email"
                label="Email address"
                onChange={handleInputChange}
                value={email}
                helperText={formValidationErrors?.email}
                onBlur={handleOnBlur}
              />
              <TextField
                error={formValidationErrors?.password}
                color={password === '' ? 'error' : 'success'}
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                onChange={handleInputChange}
                onBlur={handleOnBlur}
                value={password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={formValidationErrors?.password}
              />
              {/* <TextField name="countryCode" label="Country Code" onChange={handleInputChange} value={countryCode} />
              <TextField name="phoneNumber" label="Phone Number" onChange={handleInputChange} value={phoneNumber} /> */}
            </Stack>
            <LoadingButton fullWidth size="large" type="submit" loading={loading} variant="contained" onClick={handleCreateNewUser}>
              Register
            </LoadingButton>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
};
export default Register;
