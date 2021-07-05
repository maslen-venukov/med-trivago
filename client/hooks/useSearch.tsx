import React, { useState, useRef } from 'react'
import Highlighter from 'react-highlight-words'

import Input from 'antd/lib/input'
import Space from 'antd/lib/space'
import Button from 'antd/lib/button'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import { FilterDropdownProps } from 'antd/lib/table/interface'

const useSearch = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [searchedColumn, setSearchedColumn] = useState<string>('')
  const searchInputRef = useRef<Input>(null)

  const onSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: string) => {
    confirm()
    setSearchText(selectedKeys[0].toString())
    setSearchedColumn(dataIndex)
  }

  const onReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInputRef}
          placeholder="Поиск"
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => onSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => onSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Найти
          </Button>
          <Button onClick={() => onReset(clearFilters)} size="small" style={{ width: 90 }}>
            Сбросить
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,

    onFilter: (value: string | number | boolean, record: any) => (
      record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase()) || ''
    ),

    onFilterDropdownVisibleChange: (visible: boolean) => {
      if(visible) {
        setTimeout(() => searchInputRef.current?.select(), 100)
      }
    },

    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : text
  })

  return getColumnSearchProps
}

export default useSearch