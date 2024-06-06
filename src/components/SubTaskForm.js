import React, { useState } from 'react';
import { Box, Button, InputLabel, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ApiConfig from '../config/ApiConfig';
import { toast } from "react-toastify";
import { fetchTaskData } from '../pages/common';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from './loadingIndicator';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const styles = {
    labelAsterisk: {
        color: "red"
    }
};

const validationSchema = Yup.object().shape({
    subTaskTitle: Yup.string()
        .required('Sub Task Title is required'),
    // .max(100, 'Sub Task Title must be at most 100 characters'),
    targetDate: Yup.date()
        .required('Target Date is required')
        .nullable()
        .test('is-correct-format', 'Wrong date format', value => {
            if (!value) return false;
            return dateRegex.test(value.toISOString());
        }),
    uploadImage: Yup.mixed()
        // .test('fileSize', 'File Size is too large', value => !value || (value && value.size <= 2000000)) // 2MB
        .required('Upload image is required')
        .test('fileFormat', 'Unsupported Format', value => !value || (value && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type)))
});

const SubTaskForm = ({ onSubmit, onClose, parentTaskId, forTaskDataView }) => {
    console.log(forTaskDataView, 'subtask data');
    console.log(parentTaskId, 'parent task');
    let editFlag = 0;
    if (forTaskDataView) {
        editFlag = 1;
    }
    const editSubTaskTitle = forTaskDataView ? forTaskDataView?.subtask_title : '';
    const editSubTaskDate = forTaskDataView ? dayjs(forTaskDataView?.target_date) : '';
    const editSubTaskImageUrl = forTaskDataView ? forTaskDataView?.subtask_image : '';
    const [isLoading, setIsLoading] = React.useState(false);
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
    const [updateTaskFile, setupdateTaskFile] = useState(editSubTaskImageUrl ?? null);
    // const [base64Image, setBase64Image] = React.useState("");
    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        formik.setFieldValue('uploadImage', file);
        if (file) {

            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
                formik.setFieldError('uploadImage', 'Unsupported Format');
                setupdateTaskFile(null);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setupdateTaskFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            subTaskTitle: '',
            targetDate: null,
            uploadImage: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    parent_task_id: parentTaskId,
                    subtask_title: values.subTaskTitle,
                    subtask_target_date: values.targetDate.toISOString(),
                    subtask_image: updateTaskFile,
                    ...(editFlag === 1 && { sub_task_id: forTaskDataView?.sub_task_id }),
                };
                setIsLoading(true);
                let url = '/add-sub-task';
                if (editFlag === 1) {
                    url = '/edit-sub-task';
                }
                const response = await ApiConfig.requestData('post', url, null, payload);
                if (response) {
                    toast.success(editFlag === 1 ? 'Sub Task edited successfully' : 'Sub Task added successfully');
                    await fetchTaskData();
                    window.location.reload();
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
                console.error('Error adding subtask:', error);
                toast.error('Something went wrong');
            } finally {
                setSubmitting(false);
            }
        },
    });

    console.log('Errors:', formik.errors);

    console.log('Touched:', formik.touched);

    return (
        <>
            {/* For Loader */}
            <LoadingIndicator isLoading={isLoading} />
            <form onSubmit={formik.handleSubmit}>
                <Box mb={2}>

                    <InputLabel sx={{ mb: 1 }}> <span>
                        Sub Task Title
                        <span style={styles.labelAsterisk}> *</span>
                    </span>
                    </InputLabel>
                    <TextField
                        name="subTaskTitle"
                        value={formik.values.subTaskTitle}
                        onChange={formik.handleChange}
                        fullWidth
                        size="small"
                        error={formik.touched.subTaskTitle && Boolean(formik.errors.subTaskTitle)}
                        helperText={formik.touched.subTaskTitle && formik.errors.subTaskTitle}
                    />
                </Box>
                <Box mb={2}>

                    <InputLabel sx={{ mb: 1 }}> <span>
                        Target Date
                        <span style={styles.labelAsterisk}> *</span>
                    </span>
                    </InputLabel>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={formik.values.targetDate}
                            onChange={(date) => formik.setFieldValue('targetDate', date)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    error={formik.touched.targetDate && Boolean(formik.errors.targetDate)}
                                    helperText={formik.touched.targetDate ? formik.errors.targetDate : ''}
                                    size="small"
                                />
                            )}
                            disablePast
                            fullWidth
                            size="small"
                            sx={{ width: '100%' }}
                        />
                    </LocalizationProvider>
                </Box>
                {/* <Box mb={2}>
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
            </Box> */}
                <Box mb={2}>

                    <InputLabel sx={{ mb: 1 }}> <span>
                        Upload Images
                        <span style={styles.labelAsterisk}> *</span>
                    </span>
                    </InputLabel>
                    <Box display={'flex'} gap={2}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            placeholder="Upload Image"
                            name="uploadImage"
                            size="small"
                            type="file"
                            onChange={handleFileChange}
                            error={formik.touched.uploadImage && Boolean(formik.errors.uploadImage)}
                            helperText={formik.touched.uploadImage && formik.errors.uploadImage}
                        />
                        <Box width={'40px'} height={'40px'} minWidth={'40px'} borderRadius={'6px'} backgroundColor='#ebebeb'>
                            {updateTaskFile && (
                                <img
                                    alt=""
                                    width={'100%'}
                                    height={'100%'}
                                    className="smallImageInTask"
                                    src={updateTaskFile}
                                />
                            )}
                        </Box>
                    </Box>
                    <Typography variant="caption" sx={{ marginTop: '0.5rem', color: 'red' }}>
                            Accepted formats: JPEG, PNG, GIF*
                          </Typography>
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
        </>

    );
};

export default SubTaskForm;
