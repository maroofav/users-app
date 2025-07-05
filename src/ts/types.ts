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
