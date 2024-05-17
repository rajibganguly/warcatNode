import React from 'react';
import { Modal } from 'antd';
import { Col, Row } from 'antd';
import { TextField } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

const StaticModel = ({ visible, onClose }) => {

    return (
        <>
            <Modal
                title="Task Title: Website Issue"
                open={visible}
                onCancel={onClose}
                width={800}
                minWidth={400}
                footer={[
                    <Button key="submit" type="primary" onClick={onClose} style={{ backgroundColor: '#0a1832', color: '#ffffff', display: 'flex', justifyContent: 'start' }}>
                        Add Sub Task
                    </Button>,
                ]}
            >
                <Row gutter={16}>

                    <Col span={24} style={{ marginBottom: 16 }}> {/* Full width */}
                        <label>Department / Government Organisation</label>
                        <TextField
                            id="outlined-basic"
                            label="Sub Task Title"
                            variant="outlined"
                            fullWidth
                            name="dep_name"
                        />
                    </Col>

                    <Col span={12} style={{ marginBottom: 16 }}> {/* Half width */}
                        <label>Department / Government Organisation</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Basic date picker" />
                        </LocalizationProvider>
                    </Col>
                    <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Half width */}
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            style={{ alignSelf: 'center', width: '100%' }} // Align button content vertically and set width to 100%
                        >
                            Upload file
                            <VisuallyHiddenInput type="file" />
                        </Button>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default StaticModel;
