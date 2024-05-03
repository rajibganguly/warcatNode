import React from 'react';
import { Button, Space, Table, Modal } from 'antd';

const Reporttable = ({ data, columns, setFilteredInfo, setSortedInfo,modalVisible, setModalVisible, selectedRecord }) => {
  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
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


  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={setAgeSort}>Sort age</Button>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table columns={columns} dataSource={data} onChange={handleChange}
        expandable={{
          expandedRowRender: (record) => (
            <p
              style={{
                margin: 0,
              }}
            >
              {record.description}
            </p>
          ),
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
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

export default Reporttable;