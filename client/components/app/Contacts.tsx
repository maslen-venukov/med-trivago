import React from 'react'
import Link from 'next/link'

export interface IContact {
  text: string,
  icon: React.ReactNode,
  href?: string
}

interface IContactsProps {
  className?: string
  contacts: IContact[]
}

const Contacts: React.FC<IContactsProps> = ({ contacts, className }) => {
  return (
    <div className={`contacts ${className || ''}`}>
      <ul className="contacts__list list-reset">
        {contacts.map(contact => (
          <li key={Math.random()} className="contacts__item">
            {contact.href ? (
              <Link href={contact.href}>
                <a className="contacts__link">{contact.icon} {contact.text}</a>
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

export default Contacts