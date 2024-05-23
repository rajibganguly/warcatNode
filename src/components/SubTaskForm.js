import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { styled } from "@mui/material/styles";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Grid from "@mui/material/Grid";



const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};



const SubTaskForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState([]);

    const [formValues, setFormValues] = useState({
        subTaskTitle: '',
        targetDate: '',
        status: ''
    });

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setFormData(prevState => ({
                ...prevState,
                imageUrl: base64
            }));

        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };
    const handleDateChange = (newDate) => {
        setFormData(prevState => ({
            ...prevState,
            selectDate: newDate
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formValues);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box mb={2}>
                <TextField
                    label="Sub Task Title"
                    name="subTaskTitle"
                    value={formValues.subTaskTitle}
                    onChange={handleChange}
                    fullWidth
                    required
                />
            </Box>
            <Box mb={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>


                    <Grid item xs={12}>

                        <DatePicker
                            value={formData.selectDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            fullWidth
                            sx={{ width: 100 + '%' }}
                        />


                    </Grid>



                </LocalizationProvider>
            </Box>


            <Box mb={2}>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                >
                    Upload file
                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                </Button>
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={onClose} variant="contained" color="secondary">
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </Box>
        </form>
    );
};

export default SubTaskForm;
