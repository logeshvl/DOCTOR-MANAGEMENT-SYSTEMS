import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Container, Grid, Card,Stack, CardMedia, CardContent, Paper, AppBar, Toolbar, Box ,Typography
} from '@mui/material';
import { AccessAlarm, ThreeDRotation,PermPhoneMsgOutlined,MailOutlined,Business } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { userModuleURL } from 'src/services/urlService';
import HttpServices from 'src/services/httpService';
import { useToaster } from 'src/utils/toaster/toasterContext';
import SearchResult from './search-result';
import axios from 'axios';
import { CommonHelper } from 'src/utils/commonHelper';
import Loader from 'src/components/loader/loader';
const options = [
  { id: 19, label: 'Dr.Shiva(Neurology)' },
  { id: 17, label: 'Dr.Santhosh(Cardiology)' },
  { id: 20, label: 'Dr.Mahesh(Orthopedics)' },
  { id: 16, label: 'Dr.Dinesh(Dermatology)' },
  { id: 15, label: 'Dr.Roman(pediatrics)' },
];
const DoctorAppointment = () => {
  const [fullname, setFullName] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [date_of_appointment, setDateOfAppointmet] = useState('');
  const [time_of_appointment, setTimeOFAppointment] = useState('');
  const [doctor_id, setDoctorId] = useState('Select');
  const [additional_msg, setAdditionalMeg] = useState('');
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const { showToast } = useToaster();
 const handleClose = () => {
    setOpenDialog(false);
  }
  const handleOpen=()=>{
    setOpenDialog(true);
  }
  const handleInputChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    switch (name) {
      case 'search':
        setSearch(value);
        break;
      case 'fullname':
        setFullName(value);
        break;
      case 'mobilenumber':
        setMobileNumber(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'date_of_appointment':
        setDateOfAppointmet(value);
        break;
        case 'time_of_appointment':
         setTimeOFAppointment(value);
          break;
      case 'additional_msg':
        setAdditionalMeg(value);
        break;
      case 'doctor_id':
        setDoctorId(value);
        break;
      default:
        break;
    }
  };

  
  const handleSubmit = () => {
    setLoader(true);
    let loginForm = {
    fullname: fullname,
    mobilenumber:  mobilenumber,
    email:  email,
    date_of_appointment:  date_of_appointment,
    time_of_appointment:  time_of_appointment,
    doctor_id:  doctor_id,
    additional_msg: additional_msg,
    remark: "Appointment requested"
    };
    let postProps = {
      url: userModuleURL.userAppointment,
      body: loginForm,
      successCallback,
      failureCallback
    }
    HttpServices.Post(postProps);
  };
  

  const successCallback = (data, message) => {
  showToast("successful", 's');
   setDoctorId("");
   setAdditionalMeg('');
   setTimeOFAppointment('');
   setDateOfAppointmet('');
   setDateOfAppointmet('');
   setMobileNumber('');
   setEmail('');
   setFullName('');
   setLoader(false);
  }

  const failureCallback = (message) => {
    showToast(message, "e");
     setLoader(false);
  }
  const handleLogout = () => {
    CommonHelper.Logout();
  };
 

  return (
    <>{loader && <Loader/>}
    <Container maxWidth="lg">
      <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Doctor Management
        </Typography>
        {/* Add button or link to navigate to doctor management page */}
        <Button variant="contained" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* Card with image and content */}
          <Card>
    <CardContent>
      {/* Add content here */}
      <h2>Make An Appointment To Visit Our Doctor</h2>
      <p>It was time to get rid of the vines. Oh God, let it be God's pain. Some backyard will be backyard and them. There was a great deal of pain and suffering, but it was a great deal of pain</p>
    </CardContent>
    <CardContent>
      <Grid container alignItems="center" spacing={5}>
        <Grid item>
          <PermPhoneMsgOutlined style={{ fontSize: 30 }} />
        </Grid>
        <Grid item>
          <div>
            <h2>Call us Now</h2>
            <p>+1234567890</p>
          </div>
        </Grid>
      </Grid>
    </CardContent>
    <CardContent>
    <Grid container alignItems="center" spacing={5}>
     <Grid item>
          <MailOutlined style={{ fontSize: 30 }} />
        </Grid>
        <Grid item>
          <div><h2>Mail us Now</h2>
          <p>Email: example@example.com</p>
          </div>  
      </Grid>
      </Grid>
    </CardContent>
    <CardContent>
    <Grid container alignItems="center" spacing={5}>
     <Grid item>
          <Business style={{ fontSize: 30 }} />
        </Grid>
        <Grid item>
          <div><h2>Address</h2>
           <p>H-90 Global apartment</p>
          </div>  
      </Grid>
      </Grid>
    </CardContent>
  </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Appointment form */}
          <Paper elevation={3} sx={{ p: 3 }}>

              <TextField
                label="Full Name"
                name="fullname"
                value={fullname}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Mobile Number"
                name="mobilenumber"
                value={mobilenumber}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Email"
                name="email"
                value={email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Date of Appointment"
                name="date_of_appointment"
                type="date"
                value={date_of_appointment}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Time of Appointment"
                name="time_of_appointment"
                value={time_of_appointment}
                type='time'
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/* You may fetch the list of doctors from your backend and populate this select menu */}
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel >Doctor</InputLabel>
                <Select
                  value={doctor_id}
                  onChange={handleInputChange}
                  name='doctor_id'
                  sx={{mt:1}}
                >
                  {options.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Additional Message"
                name="additional_msg"
                value={additional_msg}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
                variant="outlined"
              />
              <Stack spacing={2} direction="row">
              <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                Book Appointment
              </Button>
              <Button onClick={handleOpen} variant="contained">view Appointment</Button>
              </Stack>
          </Paper>
        </Grid>
      </Grid>
      

      {openDialog && <SearchResult
        handleClose={handleClose}
      />}

    </Container>
    </>
  );
};

export default DoctorAppointment;
