import React from 'react'
import { useSelector } from 'react-redux'

import Tag from 'antd/lib/tag'
import CloseOutlined from '@ant-design/icons/CloseOutlined'

import { RootState } from '../../store/reducers'
import { ICategory } from '../../types/categories'
import { Colors } from '../../types'

interface ICategoriesFilterProps {
  categories: ICategory[]
  error: string
  onChange: (e: React.MouseEvent<HTMLSpanElement>) => void
  onReset: () => void
}

const CategoriesFilter: React.FC<ICategoriesFilterProps> = ({ categories, error, onChange, onReset }) => {
  const { filters } = useSelector((state: RootState) => state.search)

  return (
    <div className="categories-filter">
      {!error && categories.map(category => (
        <Tag
          key={category._id}
          color={filters.cat === category.name ? Colors.Green : Colors.Accent}
          onClick={onChange}
          className="categories-filter__tag"
        >
          {category.name}
        </Tag>
      ))}
      <Tag
        icon={<CloseOutlined />}
        onClick={onReset}
        className="categories-filter__tag"
      >
        Сбросить
      </Tag>
    </div>
  )
}

export default CategoriesFilter