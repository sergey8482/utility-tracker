import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { defaultTariffs } from '../utils'
export default function AddressEditor({ open, onClose, onSave, initial }:{ open:boolean; onClose:()=>void; onSave:(payload:any)=>void; initial?:any }){
  const [name, setName] = useState(initial?.name ?? '')
  const [tar, setTar] = useState(initial?.tariffs ?? defaultTariffs())
  useEffect(()=>{ if(open){ setName(initial?.name ?? ''); setTar(initial?.tariffs ?? defaultTariffs()) } }, [open, initial])
  const num = (v:any) => (v==='' || v===null || isNaN(+v) ? 0 : +v)
  return (
    <Modal open={open} onClose={onClose}>
      <h3 style={{marginBottom:8}}>Адрес</h3>
      <div className="grid" style={{gap:12}}>
        <label>Название<input value={name} onChange={e=>setName(e.target.value)} /></label>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
          <fieldset><legend>Электричество, ₽/кВт·ч</legend>
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
              {(['t1','t2','t3'] as const).map(k => (
                <label key={k}><span className="muted" style={{fontSize:12}}>Т{k[1]}</span>
                  <input inputMode="decimal" value={(tar as any).electricity[k]} onChange={e=>setTar((t:any)=>({...t, electricity:{...t.electricity, [k]: num(e.target.value)}}))} />
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset><legend>Вода, ₽/м³</legend>
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8}}>
              <label><span className="muted" style={{fontSize:12}}>Холодная</span><input inputMode="decimal" value={(tar as any).water.cold} onChange={e=>setTar((t:any)=>({...t, water:{...t.water, cold:num(e.target.value)}}))} /></label>
              <label><span className="muted" style={{fontSize:12}}>Горячая</span><input inputMode="decimal" value={(tar as any).water.hot} onChange={e=>setTar((t:any)=>({...t, water:{...t.water, hot:num(e.target.value)}}))} /></label>
            </div>
          </fieldset>
          <fieldset><legend>Газ, ₽/м³</legend>
            <label><span className="muted" style={{fontSize:12}}>Тариф</span><input inputMode="decimal" value={(tar as any).gas.t1} onChange={e=>setTar((t:any)=>({...t, gas:{ t1:num(e.target.value) }}))} /></label>
          </fieldset>
          <fieldset><legend>Отопление/ТКО</legend>
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8}}>
              <label><span className="muted" style={{fontSize:12}}>Отопление, ₽/Гкал</span><input inputMode="decimal" value={(tar as any).heating.gcal} onChange={e=>setTar((t:any)=>({...t, heating:{ gcal:num(e.target.value) }}))} /></label>
              <label><span className="muted" style={{fontSize:12}}>ТКО, ₽/мес</span><input inputMode="decimal" value={(tar as any).waste.monthly} onChange={e=>setTar((t:any)=>({...t, waste:{ monthly:num(e.target.value) }}))} /></label>
            </div>
          </fieldset>
        </div>
        <div className="flex space">
          {initial ? <button className="button" style={{borderColor:'#ef4444', color:'#ef4444'}} onClick={()=>{ if(confirm('Удалить адрес и связанные данные?')){ onSave({ ...initial, __delete:true }); onClose() } }}>Удалить</button> : <span />}
          <div className="flex" style={{gap:8}}>
            <button className="button" onClick={onClose}>Отмена</button>
            <button className="button primary" onClick={()=>{ if(!name.trim()) return alert('Введите название'); const payload = initial ? { ...initial, name, tariffs:tar } : { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), name, tariffs:tar }; onSave(payload); onClose() }}>Сохранить</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
