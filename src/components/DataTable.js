import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Table, TableBody, TableCell, TableRow, TableHead, TableSortLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';






export default function DataTable({props}) {
  const [orderBy, setOrderBy] = React.useState('department_name');
  const [order, setOrder] = React.useState('asc');
  const [deptData, setDeptData] = React.useState(props);
  
  // Created an object for searching soring process
  // for department page
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
  
  


  console.log('====>>>>>', departmentArr)
  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    const sortedData = [...departmentArr].sort((a, b) => {
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

  console.log('Data-table', props);

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
      </Table>
    </div>
  );
}









