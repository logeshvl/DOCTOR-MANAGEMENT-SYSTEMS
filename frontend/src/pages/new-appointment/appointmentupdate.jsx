import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, RadioGroup,InputLabel, FormControl, Radio, Select, MenuItem } from '@mui/material';
import { useToaster } from 'src/utils/toaster/toasterContext';
import { userModuleURL } from 'src/services/urlService';
import HttpServices from 'src/services/httpService';
import Loader from 'src/components/loader/loader';
import { Label } from '@mui/icons-material';
const TakeActionModal = ({ id, handleClose }) => {
    const [remark, setRemark] = useState('');
    const [status, setStatus] = useState('Approved');
    const [loader,setLoader] = useState(false)
    const { showToast } = useToaster();

    const handleRemarkChange = (event) => {
        setRemark(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const getUpdate = () => {
        setLoader(true)
        let loginForm = {
            appointment_id: id,
            remark: remark,
            status: status
        };
        let postProps = {
            url: userModuleURL.doctorupdateappointment,
            body: loginForm,
            successCallback,
            failureCallback
        }
        HttpServices.Post(postProps);
    }

    const successCallback = (data, message) => {
        setRemark('')
        setStatus('')
        showToast("Successful send Email", 's');
        setLoader(false);
        handleClose();
    }

    const failureCallback = () => {
        setLoader(false);
        showToast("Email not send", "e");
    }

    return (
        <>{loader&&<Loader/>}
        <Dialog open onClose={handleClose}>
            <DialogTitle>Take Action</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Remark"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={remark}
                    onChange={handleRemarkChange}
                />
                 <FormControl fullWidth margin="normal" variant="outlined">
               <InputLabel >status</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label='select'
                  
                    value={status}
                    onChange={handleStatusChange}
                    fullWidth
                   // Adjust margin top
                >
                    <MenuItem value="Select">Select</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="error">
                    Cancel
                </Button>
                <Button onClick={getUpdate} variant="contained" disabled={status === 'Select' || !remark.trim()}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default TakeActionModal;
