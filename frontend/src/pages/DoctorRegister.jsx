import { LoadingButton } from '@mui/lab';
import {
    Container,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    TextField,
    Typography,
    Radio, RadioGroup, FormControlLabel, Select, MenuItem, FormControl, Grid,InputLabel
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
}));

const options = [
    { id: 3, label: 'Neurology' },
    { id: 4, label: 'Cardiology' },
    { id: 5, label: 'Orthopedics' },
    { id: 6, label: 'Pediatrics'},
    { id: 7, label: 'Dermatology'},
    { id: 14, label: 'Psychiatry'},
];


const DoctorRegister = () => {
    const mdUp = useResponsive('up', 'md');

    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [number, setNumber] = useState('');
    const [userType, setUserType] = useState(2);
    const [specializationId, setSpecializationId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [countryCode, setcountryCode] = useState('');
    // const [phoneNumber, setPhoneNumber] = useState('');
    const [formSchema, setFormSchema] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const { showToast } = useToaster();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        let token = CookiesStorage.getItem('token');
        if (token) navigate('/dashboard');
    }, []);

    useEffect(() => { }, [
        email,
        password,
        firstName,
        formSchema,
    ]);

    const handleRadioChange = (event) => {
        const value = parseInt(event.target.value);
        setUserType(value);
    };
    const handleSelectChange = (event) => {
        setSpecializationId(event.target.value);
        console.log(specializationId)
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
            case 'UserName':
                setUserName(value);
                break;
            case 'mobileNumber':
                setNumber(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'mobileNumber':
                setNumber(value);
                break;
            default:
                break;
        }
    };

    const handleOnBlur = (event) => {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        let message = ValidationTool.ValidateInput(formSchema, fieldValue, fieldName);
    };

    const handleRegister = () => {
        let registerForm = {
            username: userName,
            first_name: firstName,
            lastname: lastName,
            password: password,
            email: email,
            user_type: parseInt(userType),
            mobno: number,
            specialization_id: specializationId
        };
        console.log(registerForm);
    };

    const handleCreateNewUser = () => {
        setLoading(true);
        let registerForm = {
            username: userName,
            first_name: firstName,
            lastname: lastName,
            password: password,
            email: email,
            user_type: parseInt(userType),
            mobno: number,
            specialization_id: specializationId
        };
        let postProps = {
            url: userModuleURL.doctorRegister,
            body: registerForm,
            successCallback,
            failureCallback
        }
        HttpServices.Post(postProps);
    };
    const successCallback = (data, message) => {
        message && showToast(message.message);
        navigate('/doctor-login', { replace: true });
    }

    const failureCallback = (message) => {
        message && showToast(message, "e");
        setLoading(false);
    }


    const navigateToLogin = () => {
        navigate('/doctor-login');
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
                            Hi, Welcome to Doctor Management System
                        </Typography>
                        <img src="/assets/illustrations/illustration_login.png" alt="login" />
                    </StyledSection>
                )}
                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Register in to Doctor
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Already have an account? {''}
                            <Link variant="subtitle2" onClick={navigateToLogin} className="pointer">
                                Click here
                            </Link>
                        </Typography>
                        <RadioGroup
                            name="gender"
                            value={userType}
                            onChange={handleRadioChange}
                            sx={{ mb: 1 }}
                            row
                        >
                            <FormControlLabel value={2} control={<Radio />} label="Doctor" />
                            {/* <FormControlLabel value={1} control={<Radio />} label="Admin" /> */}
                        </RadioGroup>

                        <Stack spacing={3} sx={{ mb: 5, }}>
                            {userType == 2 && <FormControl>
                                <InputLabel id="demo-simple-select-label">select</InputLabel>
                                <Select
                                    value={specializationId}
                                    onChange={handleSelectChange}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label='select'
                                >
                                    {options.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>}
                            <TextField
                                color={userName === '' ? 'error' : 'success'}
                                name="UserName"
                                label="User Name"
                                onChange={handleInputChange}
                                value={userName}
                                onBlur={handleOnBlur}
                            />
                            <TextField
                                color={firstName === '' ? 'error' : 'success'}
                                name="firstName"
                                label="first Name"
                                onChange={handleInputChange}
                                value={firstName}
                                onBlur={handleOnBlur}
                            />
                            <TextField
                                color={lastName === '' ? 'error' : 'success'}
                                name="lastName"
                                label="last Name"
                                onChange={handleInputChange}
                                value={lastName}
                                onBlur={handleOnBlur}
                            />
                            <TextField
                                color={number === '' ? 'error' : 'success'}
                                name="mobileNumber"
                                label="mobile number"
                                onChange={handleInputChange}
                                value={number}
                                onBlur={handleOnBlur}
                            />
                            <TextField
                                color={email === '' ? 'error' : 'success'}
                                name="email"
                                label="Email address"
                                onChange={handleInputChange}
                                value={email}
                                onBlur={handleOnBlur}
                            />
                            <TextField
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

                            />
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
export default DoctorRegister;
