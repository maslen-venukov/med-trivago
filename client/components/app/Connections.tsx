import React from 'react'
import Link from 'next/link'

export interface IConnection {
  text: string,
  icon: React.ReactNode,
  href?: string
}

interface IConnectionsProps {
  className?: string
  connections: IConnection[]
}

const Connections: React.FC<IConnectionsProps> = ({ connections, className }) => {
  return (
    <div className={`connections ${className || ''}`}>
      <ul className="connections__list list-reset">
        {connections.map(contact => (
          <li key={Math.random()} className="connections__item">
            {contact.href ? (
              <Link href={contact.href}>
                <a className="connections__link">{contact.icon} {contact.text}</a>
              </Link>
            ) : (
              <>{contact.icon} {contact.text}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Connections