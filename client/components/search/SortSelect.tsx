import React from 'react'

import Select, { SelectProps } from 'antd/lib/select'

import { Sort } from '../../types/search'

const SortSelect: React.FC<SelectProps<Sort>> = ({ value, onChange }) => {
  return (
    <div className="sort">
      <Select
        defaultValue=""
        value={value}
        onChange={onChange}
        className="sort__select"
      >
        <Select.Option value="">По умолчанию</Select.Option>
        <Select.Option value="asc">Дешевле</Select.Option>
        <Select.Option value="desc">Дороже</Select.Option>
      </Select>
    </div>
  )
}

export default SortSelect
