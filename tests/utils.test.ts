import { describe, it, expect } from 'vitest'
import { monthKey, monthLabel, buildCSV, migrateState, defaultTariffs } from '../src/utils'

describe('utils', () => {
  it('monthKey formats YYYY-MM', () => {
    const d = new Date('2025-08-12T00:00:00Z')
    expect(monthKey(d)).toBe('2025-08')
  })
  it('monthLabel is readable', () => {
    const label = monthLabel('2025-08')
    expect(label.toLowerCase()).toContain('2025')
  })
  it('buildCSV escapes quotes and joins with semicolon', () => {
    const csv = buildCSV([['Месяц','Зн'], ['авг','1']])
    expect(csv.split('\n').length).toBe(2)
    expect(csv.includes(';')).toBe(true)
  })
  it('migrateState adds tariffs to addresses and preserves selection', () => {
    const s:any = { addresses:[{id:'a',name:'A'}], selectedAddressId:'a' }
    const out:any = migrateState(s)
    expect(out.addresses[0].tariffs).toBeDefined()
    expect(Object.keys(out.addresses[0].tariffs)).toContain('electricity')
  })
  it('defaultTariffs structure is stable', () => {
    const t = defaultTariffs()
    expect(t.water).toHaveProperty('cold')
    expect(t.electricity).toHaveProperty('t3')
  })
})
