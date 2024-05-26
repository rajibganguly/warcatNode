import React, { useState } from 'react';
import { Box, Button, InputLabel, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ApiConfig from '../config/ApiConfig';
import { toast } from "react-toastify";
import { dateSelected, fetchTaskData } from '../pages/common';
import { useNavigate } from 'react-router-dom';

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const SubTaskForm = ({ onSubmit, onClose, parentTaskId, forTaskDataView }) => {
    const formatdate = dateSelected(forTaskDataView?.subtask_target_date)
    const editSubTaskTitle = forTaskDataView ? forTaskDataView?.subtask_title : '';
    const editSubTaskDate = forTaskDataView ? formatdate : null;
    const editSubTaskImageUrl = forTaskDataView ? forTaskDataView?.subtask_image : '';

    const [formValues, setFormValues] = useState({
        subTaskTitle: editSubTaskTitle,
        targetDate: editSubTaskDate,
        imageUrl: editSubTaskImageUrl
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleDateChange = (newDate) => {
        setFormValues({ ...formValues, targetDate: newDate });
    };

    const [base64Image, setBase64Image] = React.useState("");
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            const reader = new FileReader();
            setFormValues({ ...formValues, imageUrl: base64 });
            reader.onload = () => {
                setBase64Image(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const navigate = useNavigate();

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
            await fetchTaskData();
            toast.success("Sub Task added successfully");
            navigate('/tasks');

        } catch (error) {
            console.error("Error adding subtask:", error);
            toast.success("Something went wrong");

        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box mb={2}>
                <InputLabel sx={{ mb: 1 }}>Sub Task Title</InputLabel>
                <TextField
                    name="subTaskTitle"
                    value={formValues.subTaskTitle}
                    onChange={handleChange}
                    fullWidth
                    required
                    size='small'
                />
            </Box>
            <Box mb={2}>
                <InputLabel sx={{ mb: 1 }}>Date</InputLabel>
                {/* <TextField
                    name="date"
                    // value={formValues.targetDate}
                    onChange={handleDateChange}
                    fullWidth
                    required
                    fo
                    type='date'
                    size='small'
                /> */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={formValues.targetDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        fullWidth
                        size='small'
                        sx={{ width: '100%' }}
                    />
                </LocalizationProvider>
            </Box>
            <Box mb={2}>
                <InputLabel sx={{ mb: 1 }}>Upload Images</InputLabel>
                <Box display={'flex'} gap={2}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Enter task title"
                        name="uploadImage"
                        size="small"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <Box width={'40px'} height={'40px'} minWidth={'40px'} borderRadius={'6px'} backgroundColor='#ebebeb'>
                        {base64Image && (
                            <img
                                alt=""
                                width={'100%'}
                                height={'100%'}
                                className="smallImageInTask"
                                src={base64Image}
                            />
                        )}
                    </Box>
                </Box>
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
