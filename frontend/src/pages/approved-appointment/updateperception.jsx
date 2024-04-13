import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputLabel, FormControl, Radio, Select, MenuItem } from '@mui/material';
import { useToaster } from 'src/utils/toaster/toasterContext';
import { userModuleURL } from 'src/services/urlService';
import HttpServices from 'src/services/httpService';

const TakeActionMethod = ({ id, handleClose }) => {
    const [perception, setPerception] = useState('');
    const [recommendedtest, setRecommendedtest] = useState('');
    const [status, setStatus] = useState('Select');
    const { showToast } = useToaster();

    const handlePerceptionChange = (event) => {
        setPerception(event.target.value);
    };

    const handleRecommendedChange = (event) => {
        setRecommendedtest(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const getUpdate = () => {
        
        let loginForm = {
            prescription: perception,
            recommendedtest:recommendedtest,
            status: status
        };
        let postProps = {
            url: userModuleURL.doctorupdateperception,
            body: loginForm,
            successCallback,
            failureCallback
        }
        HttpServices.Post(postProps);
    }

    const successCallback = (data, message) => {
        
        setPerception('')
        setRecommendedtest("")
        setStatus('')
        showToast("Successful updated", 's');
        handleClose();
    }

    const failureCallback = () => {
        showToast("Not updated", "e");
    }

    return (
        <Dialog open onClose={handleClose}>
            <DialogTitle>Take Action</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Perception"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={perception}
                    onChange={handlePerceptionChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Recommended Test"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={recommendedtest}
                    onChange={handleRecommendedChange}
                />
                 <FormControl fullWidth margin="normal" variant="outlined" sx={{mt:2}}>
               <InputLabel >status</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="select"
                    value={status}
                    onChange={handleStatusChange}
                    fullWidth  
                >
                    <MenuItem value="Select">Select</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='outlined' color="error">
                    Cancel
                </Button>
                <Button onClick={getUpdate} variant='contained' disabled={status === 'Select' || !perception.trim() || !recommendedtest.trim()}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TakeActionMethod;
