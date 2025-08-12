import React, { useEffect, useState } from 'react'
import Modal from './Modal'
export default function MeterEditor({ open, onClose, onSave, initial, addressId }:
  { open:boolean; onClose:()=>void; onSave:(payload:any)=>void; initial?:any; addressId:string }){
  const [name, setName] = useState(initial?.name ?? '')
  const [unit, setUnit] = useState(initial?.unit ?? 'кВт·ч')
  const [tariffs, setTariffs] = useState<number>(initial?.tariffs ?? 1)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  useEffect(()=>{ if(open){ setName(initial?.name ?? ''); setUnit(initial?.unit ?? 'кВт·ч'); setTariffs(initial?.tariffs ?? 1); setNotes(initial?.notes ?? '') } }, [open, initial])
  return (
    <Modal open={open} onClose={onClose}>
      <h3 style={{marginBottom:8}}>{initial ? 'Редактировать счётчик' : 'Добавить счётчик'}</h3>
      <div className="grid" style={{gap:10}}>
        <label>Название<input value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>Единицы<select value={unit} onChange={e=>setUnit(e.target.value)}><option>кВт·ч</option><option>м³</option><option>Гкал</option></select></label>
        <label>Количество тарифов<div className="flex" style={{gap:8}}>{[1,2,3].map(t => <button key={t} className="button" style={{background: tariffs===t ? '#2563eb' : '#fff', color: tariffs===t?'#fff':'inherit', borderColor: tariffs===t?'#2563eb':'var(--border)'}} onClick={()=>setTariffs(t)}>{t}</button>)}</div></label>
        <label>Заметки<textarea value={notes} onChange={e=>setNotes(e.target.value)} /></label>
        <div className="flex" style={{justifyContent:'flex-end', gap:8}}>
          <button className="button" onClick={onClose}>Отмена</button>
          <button className="button primary" onClick={()=>{ if(!name.trim()) return alert('Введите название'); onSave({ id: initial?.id ?? (crypto.randomUUID?.() || Math.random().toString(36).slice(2)), addressId, name, unit, tariffs, notes }); onClose() }}>Сохранить</button>
        </div>
      </div>
    </Modal>
  )
}
