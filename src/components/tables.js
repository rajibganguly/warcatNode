import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { IconButton, TableSortLabel } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const rows = [
  { dep_id: 'DIT00126007', department_name: 'Agriculture Department', total_tasks: '65', total_completed: '30', total_initiated: '24', complete_percentage: '50', response_rate: '-' },
  { dep_id: 'DIT00126008', department_name: 'Labour Department', total_tasks: '65', total_completed: '30', total_initiated: '24', complete_percentage: '50', response_rate: '-' },
  { dep_id: 'DIT00126009', department_name: 'Forest Department', total_tasks: '65', total_completed: '30', total_initiated: '24', complete_percentage: '50', response_rate: '-' },
];

const headCells = [
    { id: 'dep_id', label: 'Department Id' },
    { id: 'department_name', label: 'Department Name' },
    { id: 'total_tasks', label: 'Total of Tasks' },
    { id: 'total_completed', label: 'Total Completed' },
    { id: 'total_initiated', label: 'Total Initiated' },
    { id: 'complete_percentage', label: 'Completion Percentage' },
    { id: 'response_rate', label: 'Response Rate' },
];

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('department');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedRows = stableSort(rows, getComparator(order, orderBy));
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.dep_id}</TableCell>
                  <TableCell>{row.department_name}</TableCell>
                  <TableCell>{row.total_tasks}</TableCell>
                  <TableCell>{row.total_completed}</TableCell>
                  <TableCell>{row.total_initiated}</TableCell>
                  <TableCell>{row.complete_percentage}</TableCell>
                  <TableCell>{row.response_rate}</TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

// A stable sorting function to avoid reordering of elements with the same value
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a[orderBy], b[orderBy])
    : (a, b) => -descendingComparator(a[orderBy], b[orderBy]);
}

function descendingComparator(a, b) {
  if (b < a) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
}

export default EnhancedTable;
