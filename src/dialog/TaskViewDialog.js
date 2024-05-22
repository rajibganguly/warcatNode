import React from 'react';
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
import { formatDate, formatDateWithmonth } from "../pages/common";

export default function TaskViewDialog({ open, onClose, meetingData, taskDataView }) {
    return (
        <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
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
                <IconButton
                    size="small"
                    aria-label="close"
                    onClick={onClose}
                >
                    <CloseOutlined />
                </IconButton>
            </Box>
            <Divider />
            <DialogContent>
                <Box mb={2} display="flex" gap={4} alignItems="center">
                    <Typography variant="h6" color="text.primary" className="text-underline">
                        Tasks
                    </Typography>
                    <Button variant="contained" color="primary" className="fs-12">Add New Subtask</Button>
                </Box>
                {taskDataView.map((task, index) => (
                    <Box key={index}>
                        <Typography fontSize="12px" color="text.secondary">
                            {formatDateWithmonth(task.timestamp)}
                        </Typography>
                        <Typography color="text.primary" variant="h6" mb={0.5}>
                            {task.task_title}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center">
                            <Typography color="text.secondary">
                                Target Date:
                            </Typography>
                            <Typography color="error">
                                {formatDateWithmonth(task.target_date)}
                            </Typography>
                        </Box>
                        <MuiLink component="a" href={task.task_image} download="attachment.png">
                            attachment.png
                        </MuiLink>
                        <Box gap={2} display="flex" justifyContent="right">
                            <Chip
                                label={task.status}
                                className="taskStatusBtn"
                                sx={{
                                    background: task.status === 'initiated' ? '#ffbb44' :
                                        task.status === 'completed' ? '#6fd088' : '#0f9cf3'
                                }}
                            />
                            <Button variant="contained" style={{ backgroundColor: '#0a1832', color: '#ffffff' }}>
                                Edit
                            </Button>
                        </Box>
                        {index < taskDataView.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
}