import React, { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import { yyyy_mm_dd } from '../utils'
export default function ReadingEditor({ open, onClose, onSave, meters, addressId }:
  { open:boolean; onClose:()=>void; onSave:(payload:any)=>void; meters:any[]; addressId:string }){
  const [meterId, setMeterId] = useState('')
  const [date, setDate] = useState(yyyy_mm_dd())
  const active = useMemo(()=>meters.find(m=>m.id===meterId), [meters, meterId])
  const tariffs = active?.tariffs ?? 1
  const [t1,setT1]=useState(''); const [t2,setT2]=useState(''); const [t3,setT3]=useState('')
  useEffect(()=>{ if(open){ setMeterId(meters[0]?.id ?? ''); setDate(yyyy_mm_dd()); setT1(''); setT2(''); setT3('') } }, [open, meters])
  return (
    <Modal open={open} onClose={onClose}>
      <h3 style={{marginBottom:8}}>Добавить показание</h3>
      {meters.length===0 ? <div className="muted">Сначала добавьте счётчик.</div> : (
        <div className="grid" style={{gap:10}}>
          <label>Счётчик<select value={meterId} onChange={e=>setMeterId(e.target.value)}>{meters.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
          <label>Дата<input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
            <label>Т1<input inputMode="decimal" value={t1} onChange={e=>setT1(e.target.value)} /></label>
            {tariffs>=2 && <label>Т2<input inputMode="decimal" value={t2} onChange={e=>setT2(e.target.value)} /></label>}
            {tariffs>=3 && <label>Т3<input inputMode="decimal" value={t3} onChange={e=>setT3(e.target.value)} /></label>}
          </div>
          <div className="flex" style={{justifyContent:'flex-end', gap:8}}>
            <button className="button" onClick={onClose}>Отмена</button>
            <button className="button primary" onClick={()=>{ if(!meterId) return alert('Выберите счётчик'); if(!t1 && !t2 && !t3) return alert('Введите хотя бы одно значение'); onSave({ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), addressId, meterId, date, t1: t1?Number(t1):null, t2: t2?Number(t2):null, t3: t3?Number(t3):null }); onClose() }}>Добавить</button>
          </div>
        </div>
      )}
    </Modal>
  )
}
