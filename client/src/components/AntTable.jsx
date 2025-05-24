import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import { Download, SquarePen, Trash } from 'lucide-react';
import { Alert, Button, Input, Popconfirm, Space, Table } from 'antd';
import { setSelectedTranslation } from '@store/slices/translationsSlice';
import { deleteTranslations, downloadJSON, fetchTranslations } from '@store/translationThunks';
import { EAntStatusMessage, ELanguageKeys, ELanguages } from '@enums/index';
import { CustomButton } from '@components/form-inputs/index';
import DaisyModal from '@components/DaisyModal';
import { languages } from '@data/data';
import { useAntMessage, useCustomAlert } from '@hooks/index';

const AntTable = () => {
  const dispatch = useDispatch();
  const { showMessage } = useAntMessage();

  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingKey, setDownloadingKey] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch Translations
  useEffect(() => {
    dispatch(fetchTranslations());
  }, [dispatch]);

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
    setIsDeleting(true);
    dispatch(deleteTranslations({ id: data.id }))
      .unwrap()
      .then((response) => {
        setIsDeleting(false);
        dispatch(fetchTranslations());
        showMessage(EAntStatusMessage.SUCCESS, (response.message || 'Deleted Successfully'))
      })
      .catch((error) => {
        setIsDeleting(false);
        showMessage(EAntStatusMessage.ERROR, (error.message || 'Delete Failed'))
      });
  }

  const handleDownload = (key) => {
    setDownloadingKey(key);
    dispatch(downloadJSON({ key }))
      .unwrap()
      .then((response) => {
        setDownloadingKey(null);
        showMessage(EAntStatusMessage.SUCCESS, 'Downloaded Successfully');
      })
      .catch((error) => {
        setDownloadingKey(null);
        showMessage(EAntStatusMessage.ERROR, 'Download Failed!');
      });
  }

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
          highlightStyle={{ backgroundColor: "var(--text-highlight-color)", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const stringSorter = (key) => (a, b) => (a[key] || '').localeCompare(b[key] || '', undefined, { sensitivity: 'base' });

  const makeCopyOnCell = (field) => ({
    onCell: (record) => ({
      onDoubleClick: () => {
        const copyText = `"${record.key}": "${record[field]}"`;
        navigator.clipboard.writeText(copyText);
        showMessage(EAntStatusMessage.SUCCESS, `Copied '${copyText}'`);
      },
      title: `Double-click to copy as ("${record.key}": "${record[field]}")`,
      style: { cursor: 'pointer' },
    }),
  });  
  
  const languageKeys = Object.keys(ELanguages).filter(key => key !== "english");
  const otherLanguageColumns = languageKeys.map((langKey) => {
    const dataKey = ELanguageKeys[langKey]; // e.g. 'ta', 'ml', etc.
    return Object.assign(
      {
        title: ELanguages[langKey], // e.g. 'Tamil', 'Malayalam'
        dataIndex: dataKey,
        key: dataKey,
        ellipsis: {
          showTitle: false,
        },
      },
      getColumnSearchProps(dataKey),
      makeCopyOnCell(dataKey)
    );
  });
  

  const columns = [
    Object.assign(
      { title: "Key", dataIndex: "key", key: "key" },
      getColumnSearchProps("key"),
      {
        sorter: stringSorter("key"),
        sortDirections: ["ascend", "descend"],
      }
    ),
    Object.assign(
      {
        title: "English",
        dataIndex: ELanguageKeys.english,
        key: ELanguageKeys.english,
        fixed: !isMobile ? "left" : undefined,
        ellipsis: {
          showTitle: true,
        },
      },
      getColumnSearchProps(ELanguageKeys.english),
      makeCopyOnCell(ELanguageKeys.english),
      {
        sorter: stringSorter(ELanguageKeys.english),
        sortDirections: ["ascend", "descend"],
      }
    ),
    ...otherLanguageColumns,
    // Actions column
    {
      title: '',
      key: 'operation',
      fixed: translationsData.length ? 'right' : '',
      width: 85,
      render: (record) => (
        <div className='flex gap-x-3'>
          <span
            className='tooltip tooltip-left' data-tip="Edit"
            onClick={() => {
              dispatch(setSelectedTranslation(record));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
            <SquarePen className='text-primary cursor-pointer' size={18} />
          </span>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
            <span className='tooltip tooltip-top' data-tip="Delete">
              <Trash className='text-error cursor-pointer' size={18} />
            </span>
          </Popconfirm>
        </div>
      ),
    }
  ];  

  const copyAsJSONInfoLocal = JSON.parse(localStorage.getItem('CopyAsJSONInfo') || false);

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex flex-col sm:flex-row sm:justify-end gap-2'>
        {!copyAsJSONInfoLocal &&
          <Alert
            message="Double-click a cell to Copy as Key-Value Pair."
            type="info"
            showIcon
            closable
            onClose={() => {
              localStorage.setItem('CopyAsJSONInfo', true)
            }} />
        }

        <CustomButton
          text="Download JSON"
          size="w-full sm:w-auto"
          type="button"
          icon={Download}
          onClick={() => document.getElementById('daisy_modal').showModal()}
          color='text-white'
          disabled={loading || !translationsData.length}
        />

        <DaisyModal headerTitle="Download JSON">
          <div className="grid grid-cols-6 gap-3 sm:gap-x-3 sm:gap-y-5">
            <div className='col-span-5 sm:col-span-2 self-center'>
              <p className='text-sm sm:text-base'>All Languages (ZIP)</p>
            </div>
            <div className="col-span-1">
              <CustomButton
                size="btn-sm"
                type="button"
                title={`Download All Languages JSON as ZIP`}
                color="hover:text-white"
                icon={Download}
                otherClasses="btn-outline"
                onClick={() => handleDownload('all')}
                disabled={downloadingKey === 'all'}
                isLoading={downloadingKey === 'all'}
              />
            </div>
            {
              languages.map((language) => (
                <React.Fragment key={language.id}>
                  <div className='col-span-5 sm:col-span-2 self-center'>
                    <p className='text-sm sm:text-base'>{language.lang.split(' ')[0]}</p>
                  </div>
                  <div className="col-span-1">
                    <CustomButton
                      size="btn-sm"
                      color="hover:text-white"
                      type="button"
                      title={`Download ${language.lang} JSON file`}
                      icon={Download}
                      otherClasses="btn-outline"
                      onClick={() => handleDownload(language.key)}
                      disabled={downloadingKey === language.key}
                      isLoading={downloadingKey === language.key}
                    />
                  </div>
                </React.Fragment>
              ))
            }
          </div>
        </DaisyModal>
      </div>
      <div className='overflow-x-auto'>
        <Table
          columns={columns}
          loading={loading || isDeleting}
          dataSource={translationsData}
          scroll={{ x: 1500 }}
          pagination={{
            simple: false,
            showQuickJumper: false,
            pageSize: 5,
            showTotal: (total) => `Total ${total} items`
          }}
        />
      </div>
    </div>
    
  );
};
export default AntTable;