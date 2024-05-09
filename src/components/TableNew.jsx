import React, { useState } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';


function TableNew({ column, data,handleDeleteClick,handleSeeClick }) {
    const [modalOpen, setModalOpen] = useState(false);
   

    const Toggle = () => {
        setModalOpen(!modalOpen)
    };
    // nested key handler
    const getNestedValue = (obj, path) => {
        const keys = path.split('.');
        let value = obj;
        for (const key of keys) {
            value = value ? value[key] : undefined;
        }
        return value;
    };

    const renderCellValue = (row, column) => {
        const value = getNestedValue(row, column.dataField);


        if (column.dataField === 'Operations') {
            return (

                <>
                    <Button type="primary"  onClick={() => handleSeeClick(row)}>
                        <EyeOutlined />
                    </Button>
                    <Button type="danger" onClick={() => handleDeleteClick(row.id)} >
                        <DeleteOutlined />
                    </Button>
                    <Button type="primary" onClick={() => console.log(row)}>
                        <EditOutlined />
                    </Button>

                </>
            );

        }

        if (value instanceof Date) {
            return value.toISOString().substr(0, 10);
        }

        if (typeof value === 'string' && value.includes('T')) {
            const dateValue = new Date(value);
            if (!isNaN(dateValue)) {
                return dateValue.toISOString().substr(0, 10);
            }
        }

        if (column.dataField.includes('.')) {
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

        if (column.dataField === 'imageUrl' && typeof value === 'string' && value.startsWith('data:image/')) {
            return (
                <div style={{ width: '50px', height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                    <img
                        src={value}
                        alt="Meeting Image"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                    />
                </div>
            );
        }
        else {
            return value;
        }
    };

    return (
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
                <tbody className='w-100'>
                    {/* Your table body */}
                    {Array.isArray(data) && data.length >= 1 ?
                        data?.map((row, rowIndex) => (
                            <tr className="" key={rowIndex}>
                                {column?.map((column, columnIndex) => (
                                    <td className="border-0" key={columnIndex}>
                                        {renderCellValue(row, column)}
                                    </td>
                                ))}
                            </tr>
                        ))
                        :
                        <tr>
                            <td colSpan="6" className='text-secondary text-center p-2'>No data available in table</td>
                        </tr>
                    }
                </tbody>

            </table>
        </div>
    );
}

export default TableNew;
