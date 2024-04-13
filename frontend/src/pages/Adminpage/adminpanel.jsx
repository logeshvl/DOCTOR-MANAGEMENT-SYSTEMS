import React, { useState, useEffect } from 'react';
import { useToaster } from 'src/utils/toaster/toasterContext';
import HttpServices from 'src/services/httpService';
import { userModuleURL } from 'src/services/urlService';
import { Container, Grid, Card, CardContent, Typography,Toolbar,CardHeader,AppBar, CircularProgress, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios'; // Import axios
import { CommonHelper } from 'src/utils/commonHelper';

const AdminPage = () => {
    const [responseData, setResponseData] = useState(null);
    const [loader, setLoader] = useState(false);
    const [specializationname, setSpecializationname] = useState('');
    const [updatedName, setUpdatedName] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const { showToast } = useToaster();

    useEffect(() => {
        getSpecializationDetails();
    }, []);

    const getSpecializationDetails = () => {
        setLoader(true);
        let getProps = {
            url: userModuleURL.adminmanagespecialization,
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
        showToast("Data not found", "e");
        setLoader(false);
    }

    const handleInputChange = (event) => {
        setSpecializationname(event.target.value);
    };

    const handleCreateSpecialization = () => {
        
        if (specializationname.trim() !== '') {
            const postData = { specializationname: specializationname };
            HttpServices.Post({
                url: 'http://127.0.0.1:8000/Admin/Specialization',
                body: postData,
                successCallback: getSpecializationDetails,
                failureCallback
            });
        } else {
            showToast('Specialization name cannot be empty', 'e');
        }
    };

    const handleUpdateSpecialization = (id) => {
        setOpenUpdateDialog(true);
        setDeleteId(id);
    };

    const confirmUpdate = () => {
        if (updatedName.trim() !== '') {
               const putData = { sname: updatedName };
            HttpServices.Put({
                url: `http://127.0.0.1:8000/UpdateSpecialization/${deleteId}`,
                body: putData,
                successCallback: () => {
                    getSpecializationDetails(); // Refresh specialization details on successful deletion
                    setOpenUpdateDialog(false); // Close delete confirmation dialog
                },
                failureCallback: (errorMessage) => {
                    console.error('Error deleting specialization:', errorMessage);
                    setOpenUpdateDialog(false); // Close delete confirmation dialog
                }
            });
        } else {
            showToast('Updated specialization name cannot be empty', 'e');
        }
        
    };

    const handleDeleteSpecialization = (id) => {
        HttpServices.Delete({
            url: `http://127.0.0.1:8000/Admin/DeleteSpecialization/${id}`,
            successCallback: () => {
                
                getSpecializationDetails(); // Refresh specialization details on successful deletion
                setOpenUpdateDialog(false); // Close delete confirmation dialog
            },
            failureCallback: (errorMessage) => {
                
                console.error('Error deleting specialization:', errorMessage);
                setOpenUpdateDialog(false); // Close delete confirmation dialog
            }
        });
    };
    const handleLogout = () => {
        CommonHelper.Logout();
      };

    return (
        <Container maxWidth="lg">
            <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Page
        </Typography>
        {/* Add button or link to navigate to doctor management page */}
        <Button variant="contained" onClick={handleLogout}>Logout</Button>
      </Toolbar>
      </AppBar>
            <Typography variant="h4" align="center" sx={{padding:'4px',marginBottom: '4px'}} gutterBottom>
                Specialization Details
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        label="Specialization Name"
                        value={specializationname}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <Button variant="contained" color="primary" onClick={handleCreateSpecialization}>Add Specialization</Button>
                </Grid>
                {loader ? (
                    <Grid item xs={12} container justifyContent="center">
                        <CircularProgress />
                    </Grid>
                ) : responseData && responseData.length > 0 ? (
                    responseData.map((specialization, index) => (
                        <Grid item key={index} xs={12} md={6}>
                            <Card>
                                <CardHeader
                                    title={`Specialization ID: ${specialization.id}`}
                                    action={
                                        <>
                                            <Button color="error" variant="outlined" sx={{mr:0.5}} onClick={() => { handleDeleteSpecialization(specialization.id); setOpenDeleteDialog(true); }}>Delete</Button>
                                            <Button color="primary" variant="contained"onClick={() => handleUpdateSpecialization(specialization.id)}>Update</Button>
                                        </>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="body1">
                                        Specialization Name: {specialization.sname}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Created At: {CommonHelper.DateFormat(specialization.created_at)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" align="center">
                        No specialization details found.
                    </Typography>
                )}
            </Grid>

            {/* Update Dialog */}
            <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
                <DialogTitle>Update Specialization</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Updated Specialization Name"
                        value={updatedName}
                        onChange={(event) => setUpdatedName(event.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={confirmUpdate} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
            
        </Container>
    );
};

export default AdminPage;
