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

export enum Roles {
  Admin = 'ADMIN',
  Hospital = 'HOSPITAL'
}

export enum Colors {
  Accent = '#1890ff',
  Red = '#f5222d'
}

export enum SocketActions {
  JOIN = 'JOIN',
  APPOINT = 'APPOINT',
  WATCH = 'WATCH'
}