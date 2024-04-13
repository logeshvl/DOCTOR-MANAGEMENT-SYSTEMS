import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'; // Import MUI components
import HttpServices from 'src/services/httpService';
import { useToaster } from 'src/utils/toaster/toasterContext';
import { userModuleURL } from 'src/services/urlService';
import TakeActionModal from './appointmentupdate';
import { useTheme } from '@mui/material/styles';

const ViewAllAppointment = () => {
    const location = useLocation();
    const [patientDetails, setPatientDetails] = useState(null);
    const [view,setView]=useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const { showToast } = useToaster();
    const theme = useTheme();

    useEffect(() => {
        if (location.state && location.state.id) {
            getDetails();
        }
    }, [location.state]);
    const handleClose = () => {
        setOpenDialog(false);
      }
      const handleOpen=()=>{
        
        setOpenDialog(true);
      }
    const getDetails = () => {
        let getProps = {
            url: userModuleURL.doctorviewappointment + location.state.id,
            successCallback,
            failureCallback,
        }
        HttpServices.Get(getProps);
    }

    const successCallback = (data, message) => {
        setPatientDetails(data.patientdetails);
        showToast("Successful", 'success');
    }

    const failureCallback = () => {
        showToast("Data not found", "error");
    }

    const handleTakeAction = (id) => {
        // Implement your action logic here
        console.log("Take action clicked");
    }

    return (
        <div>
            {patientDetails && (
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            AppointmentNumber:{patientDetails.appointmentnumber}
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead >
                                    <TableRow >
                                        <TableCell sx={{bgcolor: theme.palette.primary.main, color:"white"}}>Full Name</TableCell>
                                        <TableCell sx={{bgcolor: theme.palette.primary.main, color:"white"}}>Mobile Number</TableCell>
                                        <TableCell sx={{bgcolor: theme.palette.primary.main, color:"white"}}>Email</TableCell>
                                        <TableCell sx={{bgcolor: theme.palette.primary.main, color:"white"}}>Date of Appointment</TableCell>
                                        <TableCell sx={{bgcolor: theme.palette.primary.main, color:"white"}}>Time of Appointment</TableCell>
                                        <TableCell sx={{bgcolor: theme.palette.primary.main, color:"white"}}>Remark</TableCell>
                                        <TableCell sx={{bgcolor: theme.palette.primary.main, color:"white"}}>Status</TableCell>
                                        <TableCell sx={{bgcolor: theme.palette.primary.main, color:"white"}}>Additional Message</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{patientDetails.fullname}</TableCell>
                                        <TableCell>{patientDetails.mobilenumber}</TableCell>
                                        <TableCell>{patientDetails.email}</TableCell>
                                        <TableCell>{patientDetails.date_of_appointment}</TableCell>
                                        <TableCell>{patientDetails.time_of_appointment}</TableCell>
                                        <TableCell>{patientDetails.remark}</TableCell>
                                        <TableCell>{patientDetails.status}</TableCell>
                                        <TableCell>{patientDetails.additional_msg}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button variant="contained" color="primary" onClick={handleOpen}>
                            Take Action
                        </Button>
                    </CardContent>
                </Card>
                
            )}
            {openDialog && <TakeActionModal handleClose={handleClose} id={location.state.id}/>}
        </div>
    );
};

export default ViewAllAppointment;
