import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';

const Dropdowns = ({ dropdownData, setSelectedStatus, setSelectedDept }) => {
  // Maintain separate state for each dropdown
  const [select1, setSelect1] = useState('');
  const [select2, setSelect2] = useState('');

  const handleChange = (event, setter, index) => {
    const value = event.target.value;
    setter(value);
    // if (onChange) {
    //   onChange(value);
    // }
    if(index === 0){
      setSelectedDept(value);
    }else{
      setSelectedStatus(value);
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      {dropdownData.map((data, index) => (
        <Box key={index} sx={{ minWidth: 120 }}>
          <FormControl fullWidth size="small">
            <InputLabel id={`demo-simple-select-label-${index}`}>{data.label}</InputLabel>
            <Select
              labelId={`demo-simple-select-label-${index}`}
              id={`demo-simple-select-${index}`}
              value={index === 0 ? select1 : select2} 
              label={data.label}
              onChange={(e) => handleChange(e, index === 0 ? setSelect1 : setSelect2, index)} 
            >
              {data.items.map((item, itemIndex) => (
                <MenuItem key={itemIndex} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ))}
    </Stack>
  );
};

export default Dropdowns;
