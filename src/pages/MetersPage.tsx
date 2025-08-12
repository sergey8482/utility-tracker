import React, { useState } from 'react'
import MeterEditor from '../components/MeterEditor'
export default function MetersPage({ addressId, meters, setMeters, tariffsMap, setTariffsMap }:
  { addressId:string; meters:any[]; setMeters:(fn:any)=>void; tariffsMap:any; setTariffsMap:(fn:any)=>void }){
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const addrMeters = meters.filter(m=>m.addressId===addressId)
  return (
    <div className="container">
      <div className="flex space" style={{marginBottom:12}}>
        <h2>Счётчики</h2>
        <button className="button primary" onClick={()=>{ setEditing(null); setEditorOpen(true) }}>+ Добавить</button>
      </div>
      <div className="grid">
        {addrMeters.length===0 && <div className="muted">Пока нет счётчиков.</div>}
        {addrMeters.map(m => (
          <div key={m.id} className="panel flex space">
            <div><div style={{fontWeight:600}}>{m.name}</div><div className="muted">{m.unit} • тарифов: {m.tariffs}</div></div>
            <div className="flex" style={{gap:8}}>
              <button className="button" onClick={()=>{ setEditing(m); setEditorOpen(true) }}>Редактировать</button>
              <button className="button" style={{borderColor:'#ef4444', color:'#ef4444'}} onClick={()=>{ if(confirm('Удалить счётчик и связанные показания?')) setMeters((prev:any[])=>prev.filter(x=>x.id!==m.id)) }}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
      <MeterEditor open={editorOpen} onClose={()=>setEditorOpen(false)} onSave={(meter:any)=>{
        setMeters((prev:any[])=>{
          const exists = prev.some((x:any)=>x.id===meter.id)
          return exists ? prev.map((x:any)=>x.id===meter.id?meter:x) : [...prev, meter]
        })
        setTariffsMap((prev:any)=>({ ...prev, [meter.id]: prev[meter.id] ?? { t1:0, t2:0, t3:0 } }))
      }} addressId={addressId} initial={editing} />
    </div>
  )
}
