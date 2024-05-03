import React from 'react';
import { Button, Space, Table, Modal } from 'antd';


const CustomTable = ({ data,columns, setFilteredInfo, setSortedInfo, modalVisible, setModalVisible, selectedRecord }) => {
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const setAgeSort = () => {
    setSortedInfo({ order: 'descend', columnKey: 'age' });
  };

  const handleSeeClick = (record) => {
    console.log('View clicked for:', record);
    setModalVisible(true);
  };
  console.log(selectedRecord)

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={setAgeSort}>Sort age</Button>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        onChange={handleChange}
      />
      <Modal
        title="View Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p>Department: {selectedRecord.department}</p>
            <p>Secretary: {selectedRecord.secretary}</p>
            <p>Head Of Office: {selectedRecord.headofoffice}</p>
            <p>Head Of Office: {selectedRecord.meetingid}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CustomTable;
