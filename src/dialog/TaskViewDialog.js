import React, { useState } from 'react';
import {
    Box,
    Chip,
    Button,
    Dialog,
    Divider,
    IconButton,
    Typography,
    DialogContent,
    Link as MuiLink
} from "@mui/material";
import { CloseOutlined } from '@mui/icons-material';
import { fetchRoleType, formatDate, formatDateWithmonth, formatVerifiedStatus, getFileNameFromUrl } from "../pages/common";
import { useNavigate } from 'react-router-dom';
import SubTaskForm from '../components/SubTaskForm';
export default function TaskViewDialog({ open, onClose, meetingData, taskDataView }) {
    const navigate = useNavigate()
    const userRoleType = fetchRoleType();
    const [addTaskForm, setAddTaskForm] = useState(true);
    const [selectedSubTask, setSelectedSubTask] = useState(null);
    const handleEditClick = (taskId) => {
        const encodedTaskId = window.btoa(taskId);
        navigate(`/edit-tasks?taskId=${encodeURIComponent(encodedTaskId)}`);
    };

    /** Sub task edit */
    const handleSubTaskEditClick = (subTaskRow) => {
        setSelectedSubTask(subTaskRow);
        setAddTaskForm(false);
    };


    return (
        <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                    size="small"
                    aria-label="close"
                    onClick={onClose}
                >
                    <CloseOutlined />
                </IconButton>
            </div>
            {meetingData && meetingData.length > 0 && (
                <>
                    <Box
                        p={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography variant="h6" color="text.primary">
                                {meetingData?.meetingTopic}
                            </Typography>
                            <Box display="flex" gap={2}>
                                <Typography color="text.secondary">
                                    {formatDate(meetingData?.selectDate)}
                                </Typography>
                                <Typography color="text.secondary">
                                    {meetingData?.selectTime}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider />
                </>
            )}

            <DialogContent>
                {addTaskForm ? (
                    <>
                        <Box mb={2} display="flex" gap={4} alignItems="center">
                            <Typography variant="h6" color="text.primary" className="text-underline">
                                Tasks
                            </Typography>
                            {/* <Button variant="contained" color="primary" className="fs-12">Add New Subtask</Button> */}
                        </Box>





                        {taskDataView?.map((task, index) => (

                            <Box key={index}>

                                <Typography fontSize="12px" color="text.secondary">
                                    {formatDateWithmonth(task?.timestamp)}
                                </Typography>
                                <Typography color="text.primary" variant="h6" mb={0.5}>
                                    {task?.task_title}
                                    {task?.subtask_title}
                                </Typography>

                                <Box display="flex" gap={1} alignItems="center">
                                    <Typography color="text.secondary">
                                        Target Date:
                                    </Typography>
                                    <Typography color="error">
                                        {formatDateWithmonth(task?.target_date)}
                                    </Typography>
                                </Box>
                                <MuiLink component="a" href={task?.task_image} download="attachment.png">
                                    attachment.png
                                </MuiLink>
                                {task?.note_details && task.note_details.length > 0 && (
                                    <>
                                        <Typography variant="h6" component="h1" gutterBottom>
                                            Note Details
                                        </Typography>
                                        <Box>
                                            {task.note_details.map((note, index) => (
                                                <Box key={index} mb={2} display="flex" alignItems="flex-start">
                                                    {/* Bullet symbol */}
                                                    <Typography variant="h6" mr={1}>•</Typography>

                                                    <Box>
                                                        {/* Note description with length check */}
                                                        <Typography color="text.primary" variant="h6" mb={0.5}>
                                                            Note Description :  {note?.note_description && note.note_description.length > 0 ? note.note_description : 'No description provided'}
                                                        </Typography>

                                                        {/* Note written by */}
                                                        <Typography color="text.secondary">
                                                            Note Written By : {note?.note_written_by || 'Unknown author'}
                                                        </Typography>

                                                        {/* Note timestamp */}
                                                        <Typography color="text.secondary">
                                                            Date :  {note?.timestamp || 'No timestamp available'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </>
                                )}
                                {task?.complate_upload_task_details && task.complate_upload_task_details.length > 0 && (
                                    <>
                                        <Typography variant="h6" component="h1" gutterBottom>
                                            Upload Report
                                        </Typography>
                                        <Box>
                                            {task?.complate_upload_task_details.map((note, index) => (
                                                <Box key={index} mb={2} display="flex" alignItems="flex-start">
                                                    {/* Bullet symbol */}
                                                    <Typography variant="h6" mr={1}>•</Typography>

                                                    <Box>
                                                        {/* Note description with length check */}
                                                        <Typography color="text.primary" variant="h6" mb={0.5}>
                                                            {note?.description && note.description.length > 0 ? note.description : 'No description provided'}
                                                        </Typography>

                                                        {note?.upload_report && (
                                                            <MuiLink
                                                                component="a"
                                                                href={note.upload_report}
                                                                download={getFileNameFromUrl(note.upload_report)}
                                                            >
                                                                Download Report
                                                            </MuiLink>
                                                        )}

                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </>
                                )}

                                <Box gap={2} display="flex" justifyContent="right">
                                    {task?.status && (
                                        <Chip
                                            label={`${task?.status} ${formatVerifiedStatus(task?.admin_verified)}`}
                                            className="taskStatusBtn"
                                            sx={{
                                                background: task?.status === 'initiated' ? '#ffbb44' :
                                                    task?.status === 'completed' ? '#6fd088' : '#0f9cf3'
                                            }}
                                        />
                                    )}
                                    {userRoleType === 'admin' && task?.admin_verified === 0 && (
                                        <Button
                                            variant="contained"
                                            style={{ backgroundColor: '#0a1832', color: '#ffffff' }}
                                            onClick={() => {
                                                if (!task?.subtask_title) {
                                                    handleEditClick(task?.task_id);
                                                } else {
                                                    handleSubTaskEditClick(task);
                                                }
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </Box>

                                {index < taskDataView.length - 1 && <Divider sx={{ my: 2 }} />}
                            </Box>
                        ))}
                    </>
                ) : (
                    <SubTaskForm forTaskDataView={selectedSubTask} parentTaskId={selectedSubTask?.parent_task_id} />
                )}
            </DialogContent>
        </Dialog>
    );
}
