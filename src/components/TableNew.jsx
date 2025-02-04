import React,{useState} from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { TablePagination } from "@mui/material";
import {
  Box,
  Button,
  TextField,
  IconButton,
  ButtonGroup
} from "@mui/material";
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AddIcon from "@mui/icons-material/Add";
import { capitalizeFirstLetter, fetchRoleType, formatDateFromDbValue, formatStatus, formatVerifiedStatus, getCommaSeparatedRoles, getStatusText, } from "../pages/common.js";
import SearchIcon from "@mui/icons-material/Search";


function TableNew({
  column,
  data,
  searchBar,
  exportButton,
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
  handleEditmeeting,
  handleAcceptRejectClick,
  setSearchText,
  handleEditOperationTaskNew,
  pageName
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };







  const getNestedValue = (obj, path) => {
    const keys = path.split(".");
    let value = obj;
    for (const key of keys) {
      value = value ? value[key] : undefined;
    }
    return value;
  };
  const filteredData = data?.filter(row =>
    column.some(col => {
        const cellValue = getNestedValue(row, col.dataField);
        return cellValue
            ? cellValue.toString().toLowerCase().includes(searchQuery.toLowerCase())
            : false;
    })
);

const currentPageData = filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const styles = {
    buttonAccept: {
      backgroundColor: '#fb4',
      color: '#000000',
      marginRight: '2px'
    },
    buttonReject: {
      backgroundColor: 'rgb(10, 24, 50)',
      color: '#ffffff',
    },
    buttonDisabled: {
      backgroundColor: '#E0DEDE',
      color: '#ffffff',
      marginRight: '2px'
    },
    addSubtaskEnabled: {
      backgroundColor: 'rgb(10, 24, 50)',
      color: '#ffffff'
    },
    addSubtaskDisabled: {
      backgroundColor: '#E0DEDE',
      color: '#ffffff'
    }
  };

  

  const renderCellValue = (row, column) => {
    const value = getNestedValue(row, column.dataField);
    const userRoleType = fetchRoleType();
    //console.log(row)
    if (column.dataField === "meetingTopic") {

      return (<>
        <p>{capitalizeFirstLetter(row?.meetingTopic)}</p>
      </>)
    }
    if (column.dataField === "Operations") {
      return (
        <>
          <Button onClick={() => handleSeeClick(row)}
            style={{ backgroundColor: '#fb4', color: '#000', marginRight: '2px' }}>
            <EyeOutlined />
          </Button>
          {userRoleType === 'admin' &&
            (<Button onClick={() => handleEditClick(row)}
              style={{ backgroundColor: '#0097a7', color: '#ffffff', marginRight: '2px' }}>
              <EditOutlined />
            </Button>
            )}
        </>
      );
    }

    if (column.dataField === "tasks_dept") {
      if (row?.department?.length > 0) {
        const depName = capitalizeFirstLetter(row?.department?.[0]?.dep_name);
        return depName ?? '-';
      }
      return '-';
    }


    if (column.dataField === "tasks_title") {
      return <p>{capitalizeFirstLetter(row?.task_title)}</p>
    }

    if (column.dataField === "meeting_dept") {
      if (row?.departmentNames?.length > 0) {
        return row?.departmentNames?.[0] ?? '-';
      }
      return '-';
    }

    if (column.dataField === "department_dept") {
      if (row?.department) {
        return capitalizeFirstLetter(row?.department?.department_name) ?? '-';
      }
      return '-';
    }

    if (column.dataField === "tasks_tag") {
      return getCommaSeparatedRoles(row?.department?.[0]?.tag ?? []);
    }



    if (column.dataField === "meeting_tag") {
      return getCommaSeparatedRoles(row?.tag ?? []);
    }


    if (column.text === "Verified Status" && userRoleType === 'admin') {
      if (row?.status === "completed") {
        const isDisabled = row?.admin_verified === 1 || row?.admin_verified === 2;
        return (
          <div style={{ display: "flex" }}>
            <Button
              disabled={isDisabled}
              style={isDisabled ? styles.buttonDisabled : styles.buttonAccept}
              onClick={() => handleAcceptRejectClick(row.task_id, 1)}>
              Accept
            </Button>

            <Button
              disabled={isDisabled}
              style={isDisabled ? styles.buttonDisabled : styles.buttonReject}
              onClick={() => handleAcceptRejectClick(row.task_id, 2)}>
              Reject
            </Button>
          </div>
        );
      } else {
        return <p>Pending</p>
      }
    }

    // console.log(row?.admin_verified);

    if (column.dataField === "subtask") {
      const verifiedFlag = row?.admin_verified !== 0;
      return (
        <div style={{ display: "flex" }}>
          <Button onClick={() => handleViewSubTask(row)}
            style={{ backgroundColor: '#fb4', color: 'black', marginRight: '2px' }}>
            <EyeOutlined />
          </Button>
          {userRoleType === 'admin' &&
            (<Button
              disabled={verifiedFlag}
              onClick={() => handleAddSubTaskClick(row)}
              style={verifiedFlag ? styles.addSubtaskDisabled : styles.addSubtaskEnabled}>
              <AddIcon />
            </Button>
            )}
        </div>
      );
    }

    if (column.dataField === "status") {
      return (
        getStatusText(row.status) + ' ' + formatVerifiedStatus(row.admin_verified)
      )
    }

    if (column.dataField === "taskoperation") {
      return (
        <div style={{ display: "flex" }}>
          {userRoleType === 'admin' && row?.admin_verified === 0 &&
            (<Button onClick={() => handleEditOperationTask(row)}
              style={{ backgroundColor: '#0097a7', color: '#ffffff', marginRight: '2px' }}>
              <EditOutlined />
            </Button>
            )}
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
          {userRoleType === 'admin' &&
            (<Button onClick={() => handleTasksAddInMeeting(row)}
              style={{ backgroundColor: '#0a1832', color: '#ffffff', marginRight: '2px' }}>
              <AddIcon />
            </Button>
            )}
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
          <Button disabled={row?.complate_upload_task_details?.length} onClick={() => handleAddNoteClick(row)}>Note+</Button>
          <Button disabled={!row?.note_details?.length || row?.complate_upload_task_details?.length} onClick={() => handleUploadClick(row)}>Upload</Button>
        </div>
      );
    }



    if (column.dataField === "meetingoperation" && userRoleType === 'admin') {
      return (
        <div style={{ display: "flex" }}>
          <Button onClick={() => handleEditmeeting(row)} style={{ backgroundColor: '#0097a7', color: '#ffffff' }}>
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
            alt="Meeting "
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
          />
        </div>
      );
    } else {
      return value;
    }
  };

  let filename = `WARCAT - War-room Assistant for Report Compilation & Task tracking | ${tableHeading}`;

  const formateColumnValue = (row, col, pageName) => {
    // task page
    if(pageName === 'task'){
      if (col.dataField === "tasks_dept") {
        // Special handling for department
        return row.department.map(dep => dep.dep_name).join(", ");
      }
      if (col.dataField === "tasks_tag") {
        // Special handling for tag
        return row.department.map(dep => getCommaSeparatedRoles(dep.tag)).join(", ");
      }
      if (col.dataField === "tasks_title") {
        return row?.task_title;
      }
      if (col.dataField === "status") {
        return (
          getStatusText(row?.status) + ' ' + formatVerifiedStatus(row?.admin_verified)
        )
      }
      if (col.text === "Verified Status") {
        return formatStatus(row?.admin_verified);
      }
      if (col.dataField === "timestamp" || col.dataField === "target_date") {
        // handling date type values
        return formatDateFromDbValue(row[col?.dataField]);
      }
      return row[col.dataField] || "";
    }
    // department page
    if(pageName === 'department'){
      if (col.dataField === 'headOffice.name') {
        return row?.headOffice?.name;
      }
      if (col.dataField === 'secretary.name') {
        return row?.secretary?.name;
      }
      if (col.dataField === 'department_dept') {
        return row?.department?.department_name;
      }
    }
  }

  /** PDF generate  */
  const generatePDF = () => {
    const doc = new jsPDF();
    const modifiedColumn = pageName === 'task' ? column.filter(col => col.dataField !== 'subtask' && col.dataField !== 'taskoperation') : column.filter(col => col.dataField !== 'Operations');
    const tableColumn = modifiedColumn.map(col => col.text);
    const tableRows = [];
    data.forEach(row => {
      const rowData = modifiedColumn.map(col => 
        {
          return formateColumnValue(row, col, pageName);
        }
      );
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

  /** Excel generate  */
  const generateExcel = () => {
    // Create the filename row
    const filenameRow = [filename];

    // Create the header row
    const modifiedColumn = pageName === 'task' ? column.filter(col => col.dataField !== 'subtask' && col.dataField !== 'taskoperation') : column.filter(col => col.dataField !== 'Operations');
    const headers = modifiedColumn.map(col => col.text);
    console.log(column, 'col excel');
    const rows = data.map(row =>
      column.reduce((acc, col) => {
        
        acc[col.text] = formateColumnValue(row, col, pageName);
        return acc;
      }, {})
    );

    console.log(rows, 'rows excel');

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
  // console.log('exportButton', exportButton);
  return (
    <>
      {/* Table header */}
      {(exportButton || searchBar) &&
        <Box
          pb={2}
          display={'flex'}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {/* Export Button */}
          {exportButton &&
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
                onClick={() => { }}
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
          }

          {/* Search field */}
          {searchBar &&
            <TextField
              id="outlined-textarea"
              label="Search"
              variant="outlined"
              placeholder="Enter search"
              size="small"
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          }
        </Box>
      }
      {/* Table */}
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
              {currentPageData && currentPageData.length > 0 ? (
                currentPageData.map((row, index) => (
                  <tr key={index}>
                    {column?.map((col) => (
                      <td key={col.dataField}>{renderCellValue(row, col)}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={column.length} style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <TablePagination
            component="div"
            count={filteredData ? filteredData.length : 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Box>
    </>
  );
}

export default TableNew;
