import React, { useState } from 'react'
import ReadingEditor from '../components/ReadingEditor'
export default function ReadingsPage({ addressId, meters, readings, setReadings }:
  { addressId:string; meters:any[]; readings:any[]; setReadings:(fn:any)=>void }){
  const [editorOpen, setEditorOpen] = useState(false)
  const addrMeters = meters.filter(m=>m.addressId===addressId)
  const addrReadings = readings.filter(r=>r.addressId===addressId).sort((a:any,b:any)=>+new Date(b.date)-+new Date(a.date))
  return (
    <div className="container">
      <div className="flex space" style={{marginBottom:12}}>
        <h2>Показания счётчиков</h2>
        <div className="flex" style={{gap:8}}>
          <button className="button" onClick={()=>alert('История доступна на этой странице. Фильтры и экспорт — позже.')}>История показаний</button>
          <button className="button primary" onClick={()=>setEditorOpen(true)}>+ Добавить показание</button>
        </div>
      </div>
      {addrMeters.length===0 ? <div className="muted">Сначала добавьте хотя бы один счётчик.</div> : (
        <div className="grid">
          {addrReadings.length===0 && <div className="muted">Показаний пока нет.</div>}
          {addrReadings.map(r => { const m = meters.find(x=>x.id===r.meterId); return (
            <div key={r.id} className="panel flex space">
              <div>
                <div style={{fontWeight:600}}>{m?.name ?? 'Счётчик'} — {new Date(r.date).toLocaleDateString('ru-RU')}</div>
                <div className="muted">Т1: {r.t1 ?? '—'} {m?.tariffs>=2 ? `• Т2: ${r.t2 ?? '—'}` : ''} {m?.tariffs>=3 ? `• Т3: ${r.t3 ?? '—'}` : ''}</div>
              </div>
              <button className="button" style={{borderColor:'#ef4444', color:'#ef4444'}} onClick={()=>setReadings((prev:any[])=>prev.filter((x:any)=>x.id!==r.id))}>Удалить</button>
            </div>
          )})}
        </div>
      )}
      <ReadingEditor open={editorOpen} onClose={()=>setEditorOpen(false)} onSave={(rec:any)=>setReadings((prev:any[])=>[rec, ...prev])} meters={addrMeters} addressId={addressId} />
    </div>
  )
}
