import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack, TextField,Checkbox ,Button} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Loader from 'src/components/loader/loader';
import HttpServices from 'src/services/httpService';
import { userModuleURL } from 'src/services/urlService';
import { CookiesStorage } from 'src/utils/storage';
import { useToaster } from 'src/utils/toaster/toasterContext';
import ValidationTool from 'src/utils/validationHelper';
import Iconify from '../../../components/iconify';

const DoctorLoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formSchema, setFormSchema] = useState({});
  const [formValidationErrors, setFormValidationErrors] = useState({});
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToaster();

  useEffect(() => {
    const token = CookiesStorage.getItem("token");
    if (token) {
      const userDetails = JSON.parse(CookiesStorage.getItem('user_details'));
      if (userDetails && userDetails.user_type === 1) {
        // Navigate to the admin panel if the user type is 1
        navigate('/admin-panel', { replace: true });
      } else {
        // Navigate to the dashboard for other user types
        navigate('/dashboard', { replace: true });
      }
    } else {
      // Generate form model schema if there is no token
      generateFormModelSchema();
    }
  }, []);

  useEffect(() => { }, [email, password, showPassword, formSchema, formValidationErrors]);

  const generateFormModelSchema = () => {
    let fields = [
      ValidationTool.GenerateSchema('email', 'Email', 'EMAIL', true),
      ValidationTool.GenerateSchema('password', 'Password', 'TEXT', true),
    ];
    const schema = ValidationTool.GenerateSchemaModel(fields);
    setFormSchema(schema);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    let loginForm = {
      email: email,
      password: password,
    };
    let { formValidationErrors, isValidForm } = ValidationTool.FormValidation(formSchema, loginForm);
    if (isValidForm) handleLogin();
    else setFormValidationErrors(formValidationErrors);
  };

  const handleInputChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    switch (name) {
      case 'email':
        setEmail(value ? value.toLowerCase() : value);
        break;
      case 'password':
        setPassword(value);
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

  const handleLogin = () => {
    setLoading(true);
    let loginForm = {
      email: email,
      password: password,
    };
    let postProps = {
      url: userModuleURL.doctorLogin,
      body: loginForm,
      successCallback,
      failureCallback
    }
    HttpServices.Post(postProps);
  };

  const successCallback = (data, message) => {
    let userDetails = {
      user_id: data.user_id,
      username: data.username,
      user_type: data.user_type,
      doctor_id: data.doctor_id
    }
    CookiesStorage.setItem('user_details', JSON.stringify(userDetails));
    CookiesStorage.setItem('token', data.access_token);
    if (data.user_type === 1) {
      navigate('/admin-page', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }

  }

  const failureCallback = (message) => {
    showToast(message, "e");
    setLoading(false);
  }

  
  const navigateToRestpassword = () => {
    window.open("http://localhost:8000/password_reset/", "_blank");
  };

  return (
    <>
      {loader && <Loader />}
      <form onSubmit={handleLoginClick}>
        <Stack spacing={3}>
          <TextField
            error={formValidationErrors?.email}
            name="email"
            label="Email address"
            onChange={handleInputChange}
            value={email}
            color={email === "" ? "error" : "success"}
            helperText={formValidationErrors?.email}
            onBlur={handleOnBlur}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Enter your email address"
          />
          <TextField
            error={formValidationErrors?.password}
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            onChange={handleInputChange}
            onBlur={handleOnBlur}
            value={password}
            color={password === "" ? "error" : "success"}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder="Enter your password"
            helperText={formValidationErrors?.password}
          />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="end" sx={{ my: 2 }}>
          {/* { <Checkbox name="remember" label="Remember me" /> } */}
          { <Link variant="subtitle2" underline="hover" style={{ cursor: 'pointer' }}  onClick={navigateToRestpassword} >
            Forgot password?
          </Link> }
        </Stack>
        {/* <LoadingButton fullWidth size="large" type="submit" variant="contained"  >
          Login
        </LoadingButton> */}
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          loading={loading}
          variant="contained"

        >
          Login
        </LoadingButton>
        
      </form>
    </>
  );
};
export default DoctorLoginForm;
