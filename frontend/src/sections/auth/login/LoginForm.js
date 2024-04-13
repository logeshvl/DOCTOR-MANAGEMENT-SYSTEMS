import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Loader from 'src/components/loader/loader';
import HttpServices from 'src/services/httpService';
import { userModuleURL } from 'src/services/urlService';
import { CookiesStorage } from 'src/utils/storage';
import { useToaster } from 'src/utils/toaster/toasterContext';
import ValidationTool from 'src/utils/validationHelper';
import Iconify from '../../../components/iconify';

const LoginForm = () => {
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
    let token = CookiesStorage.getItem("token");
    if (token)
      navigate('/dashboard');
    else
      generateFormModelSchema();
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
      url: userModuleURL.userLogin,
      body: loginForm,
      successCallback,
      failureCallback
    }
    HttpServices.Post(postProps);
  };

  const successCallback = (data, message) => {
    showToast("successful", 's');
   
    navigate('/doctor-appointment', { replace: true });
  }

  const failureCallback = (message) => {
    showToast(message, "e");
    setLoading(false);
  }

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
          {/* <Link variant="subtitle2" underline="hover" style={{ cursor: 'pointer' }} component={RouterLink} to={"/reset-password"}>
            Forgot password?
          </Link> */}
        </Stack>
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
export default LoginForm;
