/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Box } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

function TableNew({ column, data, handleSeeClick, handleEditClick, handleSeeClick1 }) {

  // nested key handler
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
          <Button onClick={() => handleSeeClick(row)}>
            <EyeOutlined />
          </Button>
          <Button onClick={() => handleEditClick(row.id)}>
            <EditOutlined />
          </Button>
        </>
      );
    }

    if (column.dataField === "subtask") {
      return (
        <div style={{ display: 'flex' }}>
          <Button onClick={() => handleSeeClick(row)}>
            <EyeOutlined />
          </Button>
          <Button onClick={() => handleSeeClick1()}>
            <AddIcon />
          </Button>
        </div>
      );
    }
    if (column.dataField === "taskicon") {
      return (
        <div style={{ display: 'flex' }}>
          <Button onClick={() => handleSeeClick(row)}>
            <EyeOutlined />
          </Button>
          <Button onClick={() => handleSeeClick1()}>
            <AddIcon />
          </Button>
        </div>
      );
    }

    if (column.dataField === "operationicon") {
      return (
        <div style={{ display: 'flex' }}>
          <Button onClick={() => handleSeeClick(row)}>
            <EditIcon />
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

    // if (Array.isArray(value) && fileUrl.includes(column.dataField)) {
    //     return (
    //         <div className='d-flex align-items-center'>
    //             {value?.map((image, index) => (
    //                 <div className='profile-image ' key={index}>
    //                     <img className='img-xs rounded-circle' src={image?.url} alt='' />
    //                 </div>
    //             ))}
    //         </div>
    //     )
    // }

    if (
      column.dataField === "imageUrl" &&
      typeof value === "string" &&
      value.startsWith("data:image/")
    ) {
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
              borderColor: "1px solid #6c757d",

              "&:hover": {
                backgroundColor: "#5c636a",
                borderColor: "#5c636a",
              },
            }}
          >
            Copy
          </Button>
          <Button
            sx={{
              backgroundColor: "#6c757d",
              borderColor: "1px solid #6c757d",
              "&:hover": {
                backgroundColor: "#5c636a",
                borderColor: "#5c636a",
              },
            }}
          >
            Excel
          </Button>
          <Button
            sx={{
              backgroundColor: "#6c757d",
              borderColor: "#6c757d",
              "&:hover": {
                backgroundColor: "#5c636a",
                borderColor: "#5c636a",
              },
            }}
          >
            PDF
          </Button>
          <Button
            sx={{
              backgroundColor: "#6c757d",
              borderColor: "#6c757d",
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
                {column?.map((column, index) => (
                  <th className="text-sm" key={index}>
                    {column.text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="w-100">
              {/* Your table body */}
              {Array.isArray(data) && data.length >= 1 ? (
                data?.map((row, rowIndex) => (
                  <tr className="" key={rowIndex}>
                    {column?.map((column, columnIndex) => (
                      <td className="border-0" key={columnIndex}>
                        {renderCellValue(row, column)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-secondary text-center p-2">
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Box>
    </>
  );
}

export default TableNew;
