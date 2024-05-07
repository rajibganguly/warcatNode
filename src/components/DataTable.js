import * as React from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead, TableSortLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TablePagination from '@mui/material/TablePagination';





export default function DataTable({props, filteredInfo}) {
  const [orderBy, setOrderBy] = React.useState('department_name');
  const [order, setOrder] = React.useState('asc');
  const [deptData, setDeptData] = React.useState();

  // for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  
  // Created an object for searching soring process
  // for department page
  React.useEffect(() => {
    const departmentArr = []
    props.forEach((each) => {
      const departmentObj = {
        id: each.id,
        department_name: each.department.department_name,
        department_id: each.department._id,
        secretary_name: each.secretary.name,
        secretary_email: each.secretary.email,
        secretary_phone_number: each.secretary.phone_number,
        headOffice_name: each.headOffice.name,
        role_type: ['secretary', 'head_of_office']
      }  
      //finally created department array to pass view
      departmentArr.push(departmentObj)        
            
    })
    setDeptData(departmentArr);
  }, [props])


  // Wrap the initialization of deptData in useMemo
  const memoizedDeptData = React.useMemo(() => {
    return deptData;
  }, [deptData]);

  
  // Sorting features
  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    const sortedData = [...memoizedDeptData].sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      if (valueA < valueB) {
        return isAsc ? -1 : 1;
      }
      if (valueA > valueB) {
          return isAsc ? 1 : -1;
      }
      return 0;
    });
    setOrderBy(property);
    setDeptData(sortedData)
  };

  

  const viewDepartments = (row) => {
    console.log(row)
  }
  const editDepartments = (row) => {
    console.log(row)
  }
  const deleteDepartments = (row) => {
    console.log(row)
  }

  console.log('Data-table', props, filteredInfo);

  return (
    <div style={{ width: '100%' }}>
      <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'department_name'}
                            direction={order}
                            onClick={() => handleRequestSort('department_name')}
                        >
                            Department Name
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'secretary_name'}
                            direction={order}
                            onClick={() => handleRequestSort('secretary_name')}
                        >
                            Secratary
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'headOffice_name'}
                            direction={order}
                            onClick={() => handleRequestSort('headOffice_name')}
                        >
                            Head Of Office
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>                        
                      Operation
                    </TableCell>
                    {/* Other header cells */}
                </TableRow>
            </TableHead>
            <TableBody>
            {Array.isArray(deptData) && deptData?.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>
                        {item.department_name}
                        </TableCell>
                        <TableCell>
                        {item.secretary_name}
                        </TableCell>
                        <TableCell>
                        {item.headOffice_name}
                        </TableCell>
                        {/* More table cells */}
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton aria-label="delete" onClick={() => viewDepartments(item)}>
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => editDepartments(item)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => deleteDepartments(item)}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                    </TableRow>
                ))}                
            </TableBody>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]} // Customize the rows per page options as needed
              component="div"
              count={deptData?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}              
            />
      </Table>
    </div>
  );
}









