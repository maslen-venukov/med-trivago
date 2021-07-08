import { DrawerProps } from 'antd/lib/drawer'
import { FormProps } from 'antd/lib/form'

export interface ISchedule {
  start: string
  end: string
}

export interface IWeekSchedule {
  weekdays: ISchedule
  saturday?: ISchedule
  sunday?: ISchedule
}

export interface IAppointmentHour {
  label: string
  appointed: boolean
}

export interface ICustomDrawerProps extends DrawerProps, FormProps {
  title: string
  submitText: string
}

export interface IStats {
  appointments: number
  services: number
  hospitals: number
}

export enum Roles {
  Admin = 'ADMIN',
  Hospital = 'HOSPITAL'
}

export enum Colors {
  Accent = '#1890ff',
  Red = '#f5222d',
  Green = '#52c41a'
}

export enum SocketActions {
  Join = 'JOIN',
  Appoint = 'APPOINT',
  Watch = 'WATCH'
}