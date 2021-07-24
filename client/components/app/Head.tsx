import React, { useState, useEffect } from 'react'
import NextHead from 'next/head'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/reducers'

interface IHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  robots?: boolean
}

const Head: React.FC<IHeadProps> = ({ title, description, keywords, robots = true }) => {
  const { notifications } = useSelector((state: RootState) => state.socket)

  const [flag, setFlag] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(0)

  const onToggleFlag = () => setFlag(prev => !prev)

  const onClearInterval = () => {
    clearInterval(timer)
    setFlag(false)
  }

  const onNotify = () => {
    onClearInterval()
    setTimer(window.setInterval(onToggleFlag, 1000))
  }

  useEffect(() => {
    notifications
      ? onNotify()
      : onClearInterval()

    return () => {
      onClearInterval()
    }
  }, [notifications])

  return (
    <NextHead>
      <title>{flag ? `(${notifications}) Новая запись на прием - ` : ''}{title ? `${title} - ` : ''}МеДи - Медицинская Диагностика</title>
      <meta name="description" content={description || 'Запись на платные анализы Оренбург, МРТ, УЗИ, ЭКГ'} />
      <meta name="robots" content={robots ? 'all' : 'none'} />
      <meta name="keywords" content={`меди, медицинская диагностика, диагностика, запись на анализы, анализы, оренбург, мрт, узи, экг, кт, клиника, больница${keywords ? `, ${keywords.join(', ')}` : ''}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href={flag ? '/notification/favicon.ico' : '/favicon.ico'} />
      <meta name="theme-color" content="#ffffff" />
    </NextHead>
  )
}

export default Head
