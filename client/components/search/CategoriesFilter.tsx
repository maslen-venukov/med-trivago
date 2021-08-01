import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Tag from 'antd/lib/tag'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import FilterOutlined from '@ant-design/icons/FilterOutlined'

import { setVisible } from '../../store/actions/sidebar'

import { RootState } from '../../store/reducers'
import { ICategory } from '../../types/categories'
import { Colors } from '../../types'

interface ICategoriesFilterProps {
  categories: ICategory[]
  error: string
  onChange: (e: React.MouseEvent, selected: boolean) => void
  onReset: () => void
}

const CategoriesFilter: React.FC<ICategoriesFilterProps> = ({ categories, error, onChange, onReset }) => {
  const dispatch = useDispatch()

  const { filters } = useSelector((state: RootState) => state.search)
  const { mobile, visible } = useSelector((state: RootState) => state.sidebar)

  const onTagClick = (e: React.MouseEvent, category: ICategory) => onChange(e, filters.cat === category.name)

  const onSidebarVisibleChange = () => dispatch(setVisible(!visible))

  return !error ? (
    <div className="categories-filter">
      <Tag
        icon={<FilterOutlined />}
        visible={mobile}
        onClick={onSidebarVisibleChange}
        className="categories-filter__tag"
      >
        Все фильтры
      </Tag>

      {categories.map(category => (
        <Tag
          key={category._id}
          color={filters.cat === category.name ? Colors.Green : Colors.Accent}
          onClick={e => onTagClick(e, category)}
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
  ) : null
}

export default CategoriesFilter