import { ChangeEvent } from 'react'

export interface RuleSet {
  id: number
  name: string
  rules: Rule[]
}

export interface Rule {
  id: number
  findingName: string
  comparator: string
  measurement: string
  comparedValue: string | number
  unitName?: string
  action: string
  isNew?: boolean
}

export interface RuleSetSelectorProps {
  value: number | null
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  ruleSets: RuleSet[]
}

export interface User {
  id: string
  username: string
  firstname: string
  lastname: string
  email: string
  avatar: string
  role: string
  join_date: string
  description: string
}
