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
    notifications ? onNotify() : onClearInterval()

    return () => {
      onClearInterval()
    }
  }, [notifications])

  return (
    <NextHead>
      <title>{flag ? `(${notifications}) Новая запись на прием - ` : ''}{title ? `${title} - ` : ''}MeDi - Медицинская Диагностика</title>

      <meta name="description" content={description || 'MeDi предоставляет человеку возможность выбрать необходимое диагностическое исследование, записаться на прием в один клик без очередей. Услуги предоставляются квалифицированными медицинскими учреждениями, которые имеют все необходимые лицензии и проходят тщательный отбор.'} />
      <meta name="robots" content={robots ? 'all' : 'none'} />
      <meta name="keywords" content={`MeDi, меди, medi, медицинская диагностика, диагностика, запись на анализы, анализы, мрт, узи, экг, кт, ${keywords ? `, ${keywords.join(', ')}` : ''}`} />

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ffffff" />

      <link rel="icon" href={flag ? '/notification/favicon.ico' : '/favicon.ico'} />
    </NextHead>
  )
}

export default Head
