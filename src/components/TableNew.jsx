import React, { useState } from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Box } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function TableNew({
  column,
  data,
  handleSeeClick,
  handleEditClick,
  handleTasksAddInMeeting,
  handleTasksViewInMeeting,
  handleAddSubTaskClick,
  handleViewSubTask,
  handleAddNoteClick,
  handleUploadClick,
  handleEditOperationTask,
  handleViewOperationTask,
  handleTaskView,
  handleEditmeeting
}) {
  const getNestedValue = (obj, path) => {
    const keys = path.split(".");
    let value = obj;
    for (const key of keys) {
      value = value ? value[key] : undefined;
    }
    return value;
  };

  const renderCellValue = (row, column) => {
    const value = getNestedValue(row, column.dataField);

    if (column.dataField === "Operations") {
      return (
        <>
          <Button onClick={() => handleSeeClick(row)}
            style={{ backgroundColor: '#fb4', color: '#000', marginRight: '2px' }}>
            <EyeOutlined />
          </Button>
          <Button onClick={() => handleEditClick(row)}
            style={{ backgroundColor: '#0097a7', color: '#ffffff', marginRight: '2px' }}>
            <EditOutlined />
          </Button>
        </>
      );
    }

    if (column.dataField === "subtask") {
      return (
        <div style={{ display: "flex" }}>
          <Button onClick={() => handleAddSubTaskClick(row)}>
            <EyeOutlined />
          </Button>
          <Button onClick={() => handleViewSubTask(row)}>
            <AddIcon />
          </Button>
        </div>
      );
    }

    if (column.dataField === "tasks") {
      return (
        <div style={{ display: "flex" }}>
          <Button onClick={() => handleTasksAddInMeeting(row)}
            style={{ backgroundColor: '#0a1832', color: '#ffffff', marginRight: '2px' }}>
            <AddIcon />
          </Button>
          <Button onClick={() => handleTasksViewInMeeting(row)}
            style={{ backgroundColor: '#fb4', color: 'black' }}>
            <EyeOutlined />
          </Button>
        </div>
      );
    }

    if (column.dataField === "taskoperation") {
      return (
        <div style={{ display: "flex" }}>
          <Button onClick={() => handleEditOperationTask(row)}>
            <EditOutlined />
          </Button>
          <Button onClick={() => handleViewOperationTask(row)}>
            <EyeOutlined />
          </Button>
        </div>
      );
    }

    if (column.dataField === "action") {
      return (
        <div style={{ display: "flex" }}>
          <Button onClick={() => handleAddNoteClick(row)}>Note+</Button>
          <Button onClick={() => handleUploadClick(row)}>Upload</Button>
        </div>
      );
    }

    if (column.dataField === "meetingoperation") {
      return (
        <div style={{ display: "flex" }}>
          <Button onClick={() => handleEditmeeting(row)}
            style={{ backgroundColor: '#0097a7', color: '#ffffff' }}>
            <EditOutlined />
          </Button>
        </div>
      );
    }

    if (value instanceof Date) {
      return value.toISOString().substr(0, 10);
    }

    if (typeof value === "string" && value.includes("T")) {
      const dateValue = new Date(value);
      if (!isNaN(dateValue)) {
        return dateValue.toISOString().substr(0, 10);
      }
    }

    if (column.dataField.includes(".")) {
      getNestedValue(row, column.dataField);
    }

    if (column.dataField === "imageUrl" && typeof value === "string" && value.startsWith("data:image/")) {
      return (
        <div
          style={{
            width: "50px",
            height: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
          }}
        >
          <img
            src={value}
            alt="Meeting Image"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
          />
        </div>
      );
    } else {
      return value;
    }
  };

  /** 23/05/24  */
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = column.map(col => col.text);
    const tableRows = [];

    data.forEach(row => {
      const rowData = column.map(col => row[col.dataField]);
      tableRows.push(rowData);
    });

    // Add title to PDF
    doc.text('My Data Table', 14, 15);

    // Add the table to PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('table.pdf');
  };

  const generateExcel = () => {
    console.log('hello');
    const worksheet = XLSX.utils.json_to_sheet(data.map(row =>
      column.reduce((acc, col) => {
        acc[col.text] = row[col.dataField];
        return acc;
      }, {})
    ));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'table.xlsx');
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button
            sx={{
              backgroundColor: "#6c757d",
              borderRight: "1px solid #6c757d !important",
              
              "&:hover": {
                backgroundColor: "#5c636a",
                borderColor: "#5c636a",
              },
            }}
            onClick={()=>{}}
          >
            Copy
          </Button>
          <Button
            sx={{
              backgroundColor: "#6c757d",
              borderRight: "1px solid #6c757d !important",
              "&:hover": {
                backgroundColor: "#5c636a",
                borderColor: "#5c636a",
              },
            }}
            onClick={generateExcel}
          >
            Excel
          </Button>
          <Button
            sx={{
              backgroundColor: "#6c757d",
              borderRight: "1px solid #6c757d !important",
              "&:hover": {
                backgroundColor: "#5c636a",
                borderColor: "#5c636a",
              },
            }}
            onClick={generatePDF}
          >
            PDF
          </Button>
          <Button
            sx={{
              backgroundColor: "#6c757d",
              "&:hover": {
                backgroundColor: "#5c636a",
                borderColor: "#5c636a",
              },
            }}
          >
            Column Visibility
          </Button>
        </ButtonGroup>
        <TextField
          id="outlined-textarea"
          label="Search"
          variant="outlined"
          placeholder="Enter search"
          size="small"
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
      <Box>
        <div className="table-container">
          <table className="bordered-table">
            {/* Your table header */}
            <thead className="ms-1 me-1 table-header-text">
              <tr>
                {column?.map((col) => (
                  <th key={col.dataField}>{col.text}</th>
                ))}
              </tr>
            </thead>
            {/* Your table body */}
            <tbody>
              {data?.map((row, index) => (
                <tr key={index}>
                  {column?.map((col) => (
                    <td key={col.dataField}>{renderCellValue(row, col)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>
    </>
  );
}

export default TableNew;
