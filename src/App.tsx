import React, { useEffect, useState } from 'react'
import { TopBar, NavItem } from './components/UI'
import Dashboard from './pages/Dashboard'
import ReadingsPage from './pages/ReadingsPage'
import MetersPage from './pages/MetersPage'
import PaymentsPage from './pages/PaymentsPage'
import StatisticsPage from './pages/StatisticsPage'
import SettingsPage from './pages/SettingsPage'
import AddressEditor from './components/AddressEditor'
import ReadingEditor from './components/ReadingEditor'
import { defaultTariffs, loadState, migrateState, saveState } from './utils'

const DEFAULT_STATE = {
  addresses: [{ id: 'home', name: 'Квартира', tariffs: defaultTariffs() }],
  selectedAddressId: 'home',
  meters: [],
  readings: [],
  payments: [],
  settings: { darkMode:false, notifications:false, autoBackup24h:false },
  tariffs: {}
}

export default function App(){
  const [state, setState] = useState<any>(()=> migrateState(loadState()) ?? DEFAULT_STATE)
  const { addresses, selectedAddressId, meters, readings, payments, tariffs } = state
  const [nav, setNav] = useState('dashboard')
  const [addReadingOpen, setAddReadingOpen] = useState(false)
  const [addrEditorOpen, setAddrEditorOpen] = useState(false)
  const [addrEditing, setAddrEditing] = useState<any>(null)

  useEffect(()=>{ saveState(state) }, [state])
  
  // Применяем темную тему
  useEffect(() => {
    const root = document.documentElement
    if (state.settings.darkMode) {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
  }, [state.settings.darkMode])

  const selectedAddress = addresses.find((a:any)=>a.id===selectedAddressId) ?? addresses[0]

  const doBackup = () => { const blob = new Blob([JSON.stringify(state,null,2)], { type:'application/json' }); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='utility-tracker-backup.json'; a.click() }
  const doRestore = async (file: File) => { const text = await file.text(); try{ const parsed = migrateState(JSON.parse(text)); setState(parsed ?? DEFAULT_STATE); alert('Данные импортированы') } catch { alert('Неверный JSON') } }
  const clearAll = () => { if(confirm('Удалить все данные?')){ localStorage.removeItem('utility_tracker_v1'); setState(DEFAULT_STATE) } }

  const openAddAddress = () => { setAddrEditing(null); setAddrEditorOpen(true) }
  const openEditAddress = () => { if(selectedAddress){ setAddrEditing(selectedAddress); setAddrEditorOpen(true) } }
  const saveAddress = (payload:any) => {
    if(payload.__delete){
      setState((s:any)=>{
        const filtered = s.addresses.filter((a:any)=>a.id!==payload.id)
        const newSel = filtered[0]?.id || ''
        return { ...s, addresses: filtered, selectedAddressId: newSel,
          meters: s.meters.filter((m:any)=>m.addressId!==payload.id),
          readings: s.readings.filter((r:any)=>r.addressId!==payload.id),
          payments: s.payments.filter((p:any)=>p.addressId!==payload.id)
        }
      }); return
    }
    setState((s:any)=>{
      const exists = s.addresses.some((a:any)=>a.id===payload.id)
      const addrs = exists ? s.addresses.map((a:any)=>a.id===payload.id?payload:a) : [...s.addresses, payload]
      return { ...s, addresses: addrs, selectedAddressId: exists ? s.selectedAddressId : payload.id }
    })
  }

  const menu = [
    { key:'dashboard', label:'Дашборд', icon:'📊' },
    { key:'readings', label:'Показания', icon:'⏱️' },
    { key:'meters', label:'Счётчики', icon:'⚡' },
    { key:'payments', label:'Платежи', icon:'💳' },
    { key:'stats', label:'Статистика', icon:'📈' },
    { key:'settings', label:'Настройки', icon:'⚙️' },
  ]

  return (
    <div>
      <div className="topbar">
        <TopBar addresses={addresses} selectedAddressId={selectedAddressId} setSelectedAddressId={(v)=>setState((s:any)=>({ ...s, selectedAddressId:v }))} onAddReading={()=>setAddReadingOpen(true)} />
      </div>
      <div className="container" style={{display:'grid', gridTemplateColumns:'260px 1fr', gap:16, alignItems:'start'}}>
        <aside className="sidebar panel">
          <div className="muted" style={{marginBottom:6}}>Меню</div>
          <div className="menu grid" style={{gap:8}}>
            {menu.map(m => <NavItem key={m.key} icon={m.icon} label={m.label} active={nav===m.key} onClick={()=>setNav(m.key)} />)}
          </div>
          <div style={{borderTop:'1px solid var(--border)', margin:'12px 0'}}></div>
          <div className="muted" style={{marginBottom:6}}>Адреса</div>
          <div className="grid" style={{gap:8}}>
            {addresses.map((a:any)=>(
              <button key={a.id} className="button" style={{background: selectedAddressId===a.id ? '#f3f4f6' : '#fff'}} onClick={()=>setState((s:any)=>({...s, selectedAddressId:a.id}))}>{a.name}</button>
            ))}
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8}}>
              <button className="button" onClick={openAddAddress}>+ Добавить</button>
              <button className="button" onClick={openEditAddress}>Редактировать</button>
            </div>
          </div>
        </aside>
        <main className="panel">
          {nav==='dashboard' && <Dashboard meters={meters} readings={readings} payments={payments} addressId={selectedAddress.id} />}
          {nav==='readings' && <ReadingsPage addressId={selectedAddress.id} meters={meters} readings={readings} setReadings={(fn:any)=>setState((s:any)=>({ ...s, readings: typeof fn==='function' ? fn(s.readings) : fn }))} />}
          {nav==='meters' && <MetersPage addressId={selectedAddress.id} meters={meters} setMeters={(fn:any)=>setState((s:any)=>({ ...s, meters: typeof fn==='function' ? fn(s.meters) : fn }))} tariffsMap={tariffs} setTariffsMap={(fn:any)=>setState((s:any)=>({ ...s, tariffs: typeof fn==='function' ? fn(s.tariffs) : fn }))} />}
          {nav==='payments' && <PaymentsPage addressId={selectedAddress.id} payments={payments} setPayments={(fn:any)=>setState((s:any)=>({ ...s, payments: typeof fn==='function' ? fn(s.payments) : fn }))} />}
          {nav==='stats' && <StatisticsPage addressId={selectedAddress.id} meters={meters} readings={readings} payments={payments} />}
          {nav==='settings' && <SettingsPage state={state} setState={setState} doBackup={doBackup} doRestore={doRestore} clearAll={clearAll} />}
        </main>
      </div>
      <ReadingEditor open={addReadingOpen} onClose={()=>setAddReadingOpen(false)} onSave={(rec:any)=>setState((s:any)=>({ ...s, readings:[rec, ...s.readings] }))} meters={meters.filter((m:any)=>m.addressId===selectedAddress.id)} addressId={selectedAddress.id} />
      <AddressEditor open={addrEditorOpen} onClose={()=>setAddrEditorOpen(false)} onSave={saveAddress} initial={addrEditing} />
    </div>
  )
}
