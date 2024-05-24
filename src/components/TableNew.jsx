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
import {getStatusText} from "../pages/common.js";

function TableNew({
  column,
  data,
  tableHeading,
  handleSeeClick,
  handleEditClick,
  handleTasksAddInMeeting,
  handleTasksViewInMeeting,
  handleAddSubTaskClick,
  handleViewSubTask,
  handleAddNoteClick,
  handleUploadClick,
  handleEditOperationTask,
  handleViewParentOperationTask,
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
          <Button onClick={() => handleViewSubTask(row)}
            style={{ backgroundColor: '#fb4', color: 'black', marginRight: '2px' }}>
            <EyeOutlined />
          </Button>
          <Button onClick={() => handleAddSubTaskClick(row)}
            style={{ backgroundColor: 'rgb(10, 24, 50)', color: '#ffffff' }}>
            <AddIcon />
          </Button>
        </div>
      );
    }

  

    if(column.dataField === "verifiedstatus"){
      return (
        getStatusText(row.status)
      )
    }

    if (column.dataField === "taskoperation") {
      return (
        <div style={{ display: "flex" }}>
          <Button onClick={() => handleEditOperationTask(row)}
            style={{ backgroundColor: '#0097a7', color: '#ffffff', marginRight: '2px' }}>
            <EditOutlined />
          </Button>
          <Button onClick={() => handleViewParentOperationTask(row)}
            style={{ backgroundColor: '#fb4', color: 'black' }}>
            <EyeOutlined />
          </Button>
        </div>
      );
    }

    if (column.dataField === "tasks") {
      return (
        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
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

  let filename = `WARCAT - War-room Assistant for Report Compilation & Task tracking | ${tableHeading}`;
  /** 23/05/24  */
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = column.map(col => col.text);
    const tableRows = [];
  
    data.forEach(row => {
      const rowData = column.map(col => row[col.dataField]);
      tableRows.push(rowData);
    });
  
    const title = filename;
    const pageWidth = doc.internal.pageSize.getWidth();
    let textWidth = doc.getTextWidth(title);
    let textX = (pageWidth - textWidth) / 2;
    let fontSize = 16; // Starting font size
  
    // Adjust font size if the title is too wide
    while (textWidth > pageWidth - 20 && fontSize > 8) {
      fontSize -= 1;
      doc.setFontSize(fontSize);
      textWidth = doc.getTextWidth(title);
      textX = (pageWidth - textWidth) / 2;
    }
  
    // Set heading color
    doc.setTextColor(0, 0, 0); // Table title color
    doc.text(title, textX, 15); // Table title
  
    // Add the table to PDF with body text color
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        textColor: [0, 0, 0], // For body text
      },
      headStyles: {
        textColor: [255, 255, 255], // For header text
        fillColor: [44, 64, 83], // For header background
      },
    });
  
    doc.save(`${filename}.pdf`);
  };
  
  const generateExcel = () => {
    // Create the filename row
    const filenameRow = [filename];
  
    // Create the header row
    const headers = column.map(col => col.text);
    const rows = data.map(row =>
      column.reduce((acc, col) => {
        acc[col.text] = row[col.dataField];
        return acc;
      }, {})
    );
  
    // Create worksheet with filename, headers, and data
    const worksheetData = [filenameRow, headers, ...rows.map(row => headers.map(header => row[header]))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
    // Set column width for all columns
    const columnWidth = 20; // You can adjust the width as needed
    const wscols = headers.map(() => ({ width: columnWidth }));
    worksheet['!cols'] = wscols;
  
    // Apply styles to the header row
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } }, // White font color
      fill: { fgColor: { rgb: "0000FF" } }, // Blue background color
      alignment: { horizontal: "center" } // Center alignment
    };
  
    // Set the header row styles
    headers.forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ c: index, r: 1 }); // Offset by 1 row due to the filename row
      if (!worksheet[cellAddress]) return;
      worksheet[cellAddress].s = headerStyle;
    });
  
    // Merge cells A1 to J1 for the filename row
    const filenameMerge = { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } };
    worksheet['!merges'] = [filenameMerge];
  
    // Set center alignment for the filename row
    const filenameStyle = {
      alignment: { horizontal: "center" }
    };
    
    for (let c = 0; c < headers.length; c++) {
      const cellAddress = XLSX.utils.encode_cell({ c: c, r: 0 });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = filenameStyle;
      }
    }
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `${filename}.xlsx`);
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
