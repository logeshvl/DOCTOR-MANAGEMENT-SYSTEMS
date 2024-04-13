import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import HttpServices from 'src/services/httpService';
import { useToaster } from 'src/utils/toaster/toasterContext';
import { userModuleURL } from 'src/services/urlService';

const AllAppointment = () => {
    const [responseData, setResponseData] = useState(null);
    const [loader, setLoader] = useState(false);
    const { showToast } = useToaster();

    useEffect(() => {
        getPublishedPosts();
    }, []);

    const getPublishedPosts = () => {
        setLoader(true);
        let getProps = {
            url: userModuleURL.doctorallappointment,
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {responseData && responseData.map((appointment) => (
                        <TableRow key={appointment.id}>
                            <TableCell>{appointment.id}</TableCell>
                            <TableCell>{appointment.name}</TableCell>
                            <TableCell>{appointment.date}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>{appointment.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AllAppointment;
