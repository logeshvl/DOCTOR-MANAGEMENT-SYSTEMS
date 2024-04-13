import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button,navigateToView } from '@mui/material';
import HttpServices from 'src/services/httpService';
import { useToaster } from 'src/utils/toaster/toasterContext';
import { userModuleURL } from 'src/services/urlService';
import { useNavigate } from 'react-router-dom';

const ApprovedAppointment=()=>{
    const [responseData, setResponseData] = useState(null);
    const [loader, setLoader] = useState(false);
    const { showToast } = useToaster();
    const navigate = useNavigate();

    useEffect(() => {
        getPublishedPosts();
    }, []);

    const getPublishedPosts = () => {
        setLoader(true);
        let getProps = {
            url: userModuleURL.doctorapprovedappointment,
            successCallback,
            failureCallback,
        }
        HttpServices.Get(getProps);
    };

    const successCallback = (data, message) => {
        setResponseData(data.appointments);
        showToast("Successful", 's');
        setLoader(false);
    }

    const failureCallback = () => {
        showToast("Data not found", "e");
        setLoader(false);
    }
    const navigateToView = (id) => {
        
        const data =
        {
            id: id
        }
        navigate('/approved-appointment/view', { state: data });
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{bgcolor: "primary.main", color:"white"}}>ID</TableCell>
                        <TableCell sx={{bgcolor: "primary.main", color:"white"}}>Name</TableCell>
                        <TableCell sx={{bgcolor: "primary.main", color:"white"}}>Date</TableCell>
                        <TableCell sx={{bgcolor: "primary.main", color:"white"}}>Time</TableCell>
                        <TableCell sx={{bgcolor: "primary.main", color:"white"}}>Status</TableCell>
                        <TableCell sx={{bgcolor: "primary.main", color:"white"}}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {responseData && responseData.map((appointment) => (
                        <TableRow key={appointment.id}>
                            <TableCell>{appointment.id}</TableCell>
                            <TableCell>{appointment.fullname}</TableCell>
                            <TableCell>{appointment.date_of_appointment}</TableCell>
                            <TableCell>{appointment.time_of_appointment}</TableCell>
                            <TableCell>{appointment.status}</TableCell>
                            <TableCell>
                                <Button variant="contained" onClick={() => navigateToView(appointment.id)}>View</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default ApprovedAppointment;