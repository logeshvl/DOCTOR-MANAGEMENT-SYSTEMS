import React, { useState } from 'react';
import { Typography, Card, CardContent, Grid, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { userModuleURL } from 'src/services/urlService';
import HttpServices from 'src/services/httpService';
import { useToaster } from 'src/utils/toaster/toasterContext';
import Loader from 'src/components/loader/loader';
import axios from 'axios';

const SearchResult = ({handleClose}) => {
  const [searchResults, setSearchResults] = useState(null);
  const [search, setSearch] = useState('');
  const [loader, setLoader] = useState(false);
  const { showToast } = useToaster();

  // const getPublishedPosts = () => {
  //   setLoader(true);
  //   debugger
  //   let getProps = {
  //     url: userModuleURL.fetchappointmentdetials + search,
  //     successCallback,
  //     failureCallback,
  //   }
  //   HttpServices.Get(getProps);
  // };
  const getPublishedPosts = async () => {
  
    setLoader(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/User_SearchAppointment', {
        params: {
          query: search
        }
      });
      setSearchResults(response.data);
      setLoader(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoader(false);
    }
  };

  const handleChange = (event) => {
    let value = event.target.value;
    setSearch(value);
  }

  

  const successCallback = (data, message) => {
    
    setSearchResults(data);
    if(data.appointments.length === 0){
      failureCallback();
      return
    }
    showToast("Successful", 's');
    setLoader(false);
  }

  const failureCallback = () => {
    showToast("not found", "e");
    setLoader(false);
  }

  return (

      <div >
        {loader && <Loader />}
        <Dialog open onClose={handleClose}>
          <DialogTitle>View Appointment</DialogTitle>
          <DialogContent>
            <TextField
              label="Full Name"
              name="fullname"
              value={search}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Button variant="contained" onClick={getPublishedPosts}>Search</Button>
            <Grid container spacing={2} >
              {searchResults && searchResults.appointments && searchResults.appointments.map((appointment) => (
                <Grid item key={appointment.id} xs={12} >
                  <Card>
                    <CardContent>
                      <Typography variant="h6">User: {appointment.fullname}</Typography>
                      <Typography variant="body1">Email: {appointment.email}</Typography>
                      <Typography variant="body1">Mobile Number: {appointment.mobilenumber}</Typography>
                      <Typography variant="body2">Date: {appointment.date_of_appointment}</Typography>
                      <Typography variant="body2">Time: {appointment.time_of_appointment}</Typography>
                      <Typography variant="body2">Status: {appointment.status}</Typography>
                      <Typography variant="body2">Perception: {appointment.prescription}</Typography>
                      <Typography variant="body2">Recommended Test: {appointment.recommendedtest}</Typography>
                      <Typography variant="body2">Remark: {appointment.remark}</Typography>
                      {/* Add more fields as needed */}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
};

export default SearchResult;
