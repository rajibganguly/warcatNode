import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Grid from "@mui/material/Grid";
import ApiConfig from '../config/ApiConfig';
import { toast } from "react-toastify";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { fetchTaskData } from '../pages/common';


const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const SubTaskForm = ({ onSubmit, onClose, parentTaskId, }) => {
    const [formValues, setFormValues] = useState({
        subTaskTitle: '',
        targetDate: null,
        imageUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleDateChange = (newDate) => {
        setFormValues({ ...formValues, targetDate: newDate });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setFormValues({ ...formValues, imageUrl: base64 });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                parent_task_id: parentTaskId,
                subtask_title: formValues.subTaskTitle,
                subtask_target_date: formValues.targetDate.toISOString(),
                subtask_image: formValues.imageUrl
            };

            const response = await ApiConfig.requestData('post', '/add-sub-task', null, payload);
            onSubmit(response);
            toast.success("Sub Task added successfully");
            fetchTaskData();

        } catch (error) {
            console.error("Error adding subtask:", error);
            toast.success("Something went wrong");

        }
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
                            value={formValues.targetDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            fullWidth
                            sx={{ width: '100%' }}
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
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
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
