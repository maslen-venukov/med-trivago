import React from 'react'
import NextHead from 'next/head'

interface IHeadProps {
  title?: string
  description?: string
  keywords?: string
  robots?: boolean
}

const Head: React.FC<IHeadProps> = ({ title, description, keywords, robots = true }) => {
  return (
    <NextHead>
      <title>Запись на анализы{title ? ` — ${title}` : ''}</title>
      <meta name="description" content={description || 'Запись на платные анализы Оренбург, МРТ, УЗИ, ЭКГ'} />
      <meta name="robots" content={robots ? 'all' : 'none'} />
      <meta name="keywords" content={`запись на анализы, анализы, оренбург, мрт, узи, экг, клиника, больница${keywords ? `, ${keywords}` : ''}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  )
}

export default Head
