import { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Popconfirm, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTranslation } from '../store/slices/translationsSlice';
import { Trash } from 'lucide-react';
import { EAntStatusMessage, ELanguages } from '../enums';
import { deleteTranslations, fetchTranslations } from '../store/translationThunks';
import { showMessage } from "../hooks/useAntMessage";

const AntTable = () => {
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const handleDelete = (data) => {
    dispatch(deleteTranslations({ id: data.id }))
      .unwrap()
      .then((response) => {
        dispatch(fetchTranslations());
        showMessage(EAntStatusMessage.SUCCESS, (response.message || 'Deleted Successfully'))
      })
      .catch((error) => {
        showMessage(EAntStatusMessage.ERROR, (error.message || 'Delete Failed'))
      });
  }

  useEffect(() => {
    dispatch(fetchTranslations());
    if (window.screen.width <= 767) {
      console.log(window.screen.width)
    }
  }, [dispatch]);

  const { translationsData, loading } = useSelector((state) => state.translations);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => {
            var _a;
            return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
          }, 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const stringSorter = (key) => (a, b) => (a[key] || '').localeCompare(b[key] || '', undefined, { sensitivity: 'base' });

  const columns = [
    Object.assign(Object.assign({ title: "Key", dataIndex: "key", key: "key" }, getColumnSearchProps("key")), {
      sorter: stringSorter("key"),
      sortDirections: ["descend", "ascend"],
    }),
    Object.assign(Object.assign({ title: "English", dataIndex: "en", key: "en", fixed: "left" }, getColumnSearchProps("en")), {
      sorter: stringSorter("en"),
      sortDirections: ["descend", "ascend"],
    }),
    Object.assign({ title: ELanguages.tamil, dataIndex: "ta", key: "ta" }, getColumnSearchProps("ta")),
    Object.assign({ title: ELanguages.malayalam, dataIndex: "ml", key: "ml" }, getColumnSearchProps('ml')),
    Object.assign({ title: ELanguages.telugu, dataIndex: "te", key: "te" }, getColumnSearchProps("te")),
    Object.assign({ title: ELanguages.kannada, dataIndex: "kn", key: "kn" }, getColumnSearchProps("kn")),
    Object.assign({ title: ELanguages.hindi, dataIndex: "hi", key: "hi" }, getColumnSearchProps("hi")),
    {
      title: '',
      key: 'operation',
      fixed: 'right',
      width: 50,
      render: (record) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
          <span className='tooltip tooltip-left' data-tip="Delete">
            <Trash className='text-error cursor-pointer' size={18} />
          </span>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex md:justify-end'>
        <Alert message="Double-click a row to edit it." type="warning" showIcon closable />
      </div>
      <div>
        <Table
          columns={columns}
          loading={loading}
          dataSource={translationsData}
          scroll={{ x: 1500 }}
          pagination={{
            // simple: true,
            showQuickJumper: false,
            pageSize: 5,
            showTotal: (total) => `Total ${total} items`
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => { 
                dispatch(setSelectedTranslation(record));
              },
            };
          }}
        />
      </div>
    </div>
    
  );
};
export default AntTable;