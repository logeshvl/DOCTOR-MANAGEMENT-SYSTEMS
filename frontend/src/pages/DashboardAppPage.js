import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography,Card,CardContent,Box} from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import { CookiesStorage } from 'src/utils/storage';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import HttpServices from 'src/services/httpService';
import { useToaster } from 'src/utils/toaster/toasterContext';
import { userModuleURL } from 'src/services/urlService';
import Loader from 'src/components/loader/loader';


// ----------------------------------------------------------------------

const DashboardAppPage = () => {
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const { showToast } = useToaster();

  // Mocking the backend response
  useEffect(() => {
    
      getPublishedPosts();
  }, []);
  const getPublishedPosts = () => {
    setLoader(true);
    let getProps = {
      url: userModuleURL.dashboard,
      successCallback,
      failureCallback,
    }
    HttpServices.Get(getProps);
  };


  const successCallback = (data, message) => {
    setResponseData(data);
    showToast("Successful", 's');
    setLoader(false);
  }

  const failureCallback = () => {
    showToast("not found", "e");
    setLoader(false);
  }

  const handleAppointmentClick = (appointmentType) => {
    switch (appointmentType) {
        case 'New':
            navigate('/new-appointment');
            break;
        case 'All':
            navigate('/all-appointment');
            break;
        case 'App':
            navigate('/approved-appointment');// Handle navigation for 'App' appointment type
            break;
        case 'Can':
            navigate('/cancel-appointment'); // Handle navigation for 'Can' appointment type
            break;
        case 'Com':
            navigate('/completed-appointment');// Handle navigation for 'Com' appointment type
            break;
        default:
            break;
    }
};

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Welcome, Doctor 
        </Typography>

        {loader && <Loader />} {/* Show loader while data is being fetched */}

        <div>
          {responseData && (
           <Grid container spacing={2}>
           <Grid item xs={12} sm={6} md={4} lg={4}>
               <Card onClick={() => handleAppointmentClick('New')}sx={{ p: 5, backgroundColor: "#ffffff", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
                   <CardContent>
                       <Typography variant="h5">
                           New Appointment Count
                       </Typography>
                       <Typography variant="h6" color="textSecondary">
                           {responseData && responseData.newaptcount}
                       </Typography>
                   </CardContent>
               </Card>
           </Grid>
           <Grid item xs={12} sm={6} md={4} lg={4}>
               <Card onClick={() => handleAppointmentClick('All')} sx={{ p: 5, backgroundColor: "#ffffff", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
                   <CardContent>
                       <Typography variant="h5">
                           All Appointment Count
                       </Typography>
                       <Typography variant="h6" color="textSecondary">
                           {responseData && responseData.allaptcount}
                       </Typography>
                   </CardContent>
               </Card>
           </Grid>
           <Grid item xs={12} sm={6} md={4} lg={4}>
               <Card onClick={() => handleAppointmentClick('App')} sx={{ p: 5, backgroundColor: "#ffffff", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
                   <CardContent>
                       <Typography variant="h5">
                           Approved Appointment Count
                       </Typography>
                       <Typography variant="h6" color="textSecondary">
                           {responseData && responseData.appaptcount}
                       </Typography>
                   </CardContent>
               </Card>
           </Grid>
           <Grid item xs={12} sm={6} md={4} lg={4}>
               <Card onClick={() => handleAppointmentClick('Can')} sx={{ p: 5, backgroundColor: "#ffffff", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
                   <CardContent>
                       <Typography variant="h5">
                           Cancel Apartment Count
                       </Typography>
                       <Typography variant="h6" color="textSecondary">
                           {responseData && responseData.canaptcount}
                       </Typography>
                   </CardContent>
               </Card>
           </Grid>
           <Grid item xs={12} sm={6} md={4} lg={4}>
               <Card onClick={() => handleAppointmentClick('Com')} sx={{ p: 5, backgroundColor: "#ffffff", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
                   <CardContent>
                       <Typography variant="h5">
                           Completed Apartment Count
                       </Typography>
                       <Typography variant="h6" color="textSecondary">
                           {responseData && responseData.comaptcount}
                       </Typography>
                   </CardContent>
               </Card>
           </Grid>
       </Grid>
          )}
        </div>
      </Container>
    </>
  );
};

export default DashboardAppPage;