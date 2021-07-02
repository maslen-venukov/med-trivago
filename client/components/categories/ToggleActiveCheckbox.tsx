import React from 'react'

import Popconfirm from 'antd/lib/popconfirm'
import Checkbox, { CheckboxProps } from 'antd/lib/checkbox'

interface IToggleActiveCheckbox extends CheckboxProps{
  onRemove: () => void
}

const ToggleActiveCheckbox: React.FC<IToggleActiveCheckbox> = ({ checked, value, onChange, onRemove }) => {
  return checked ? (
    <Popconfirm
      title="Вы действительно хотите деактивировать категорию? Все предоставляемые по ней услуги будут удалены"
      onConfirm={onRemove}
      okText="Да"
      cancelText="Нет"
    >
      <Checkbox
        value={value}
        checked={checked}
        onChange={onChange}
      />
    </Popconfirm>
  ) : (
    <Checkbox
      value={value}
      checked={checked}
      onChange={onChange}
    />
  )
}

export default ToggleActiveCheckbox
