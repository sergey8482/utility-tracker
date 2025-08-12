export const uid = () => Math.random().toString(36).slice(2,10)
export const fmt = (n?: number|null) => new Intl.NumberFormat('ru-RU').format(n ?? 0)
export const yyyy_mm_dd = (d: Date | string = new Date()) => {
  const date = new Date(d)
  const iso = date.toISOString()
  return iso.slice(0,10)
}
export const monthKey = (d: Date | string) => {
  const nd = new Date(d)
  return `${nd.getFullYear()}-${String(nd.getMonth()+1).padStart(2,'0')}`
}
export const monthLabel = (ym: string) => {
  const [y,m] = ym.split('-')
  return new Date(Number(y), Number(m)-1, 1).toLocaleDateString('ru-RU', { month:'short', year:'numeric' })
}
export const defaultTariffs = () => ({
  electricity: { t1:0, t2:0, t3:0, type: 'single' }, // single, two, three
  water: { cold:0, hot:0 },
  gas: { t1:0 },
  heating: { gcal:0 },
  waste: { monthly:0 }
})
export const LS_KEY = 'utility_tracker_v1'

export const loadState = () => {
  try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : null } catch { return null }
}
export const saveState = (s: any) => { try { localStorage.setItem(LS_KEY, JSON.stringify(s)) } catch {} }

export function migrateState(s: any) {
  if (!s) return null
  const out = { ...s }
  out.addresses = (s.addresses || []).map((a: any) => {
    const tariffs = a.tariffs || defaultTariffs()
    // Миграция для электрических тарифов
    if (tariffs.electricity && !tariffs.electricity.type) {
      tariffs.electricity.type = 'single'
    }
    return { ...a, tariffs }
  })
  if (!out.selectedAddressId && out.addresses[0]) out.selectedAddressId = out.addresses[0].id
  if (!out.settings) out.settings = { darkMode:false, notifications:false, autoBackup24h:false }
  if (!out.tariffs) out.tariffs = {}
  return out
}

// CSV helper used in export & tests
export const buildCSV = (rows: any[][]) => rows.map(arr => arr.map(v => String(v).replaceAll('"','""')).join(';')).join('\n')
