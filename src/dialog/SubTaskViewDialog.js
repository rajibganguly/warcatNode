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

export default function SubTaskDialog({ open, onClose, modalContent }) {

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
                <Typography variant="h6" color="text.primary">
                    {"Add Sub Task"}
                </Typography>
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
                {modalContent ? (
                    <Typography>{modalContent}</Typography>
                ) : (
                    <Typography>No content available</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
}
