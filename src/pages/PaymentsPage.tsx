import React, { useState } from 'react'
import PaymentEditor from '../components/PaymentEditor'
export default function PaymentsPage({ addressId, payments, setPayments }:
  { addressId:string; payments:any[]; setPayments:(fn:any)=>void }){
  const [editorOpen, setEditorOpen] = useState(false)
  const addrPayments = payments.filter(p=>p.addressId===addressId).sort((a:any,b:any)=>+new Date(b.date)-+new Date(a.date))
  return (
    <div className="container">
      <div className="flex space" style={{marginBottom:12}}>
        <h2>Платежи</h2>
        <button className="button primary" onClick={()=>setEditorOpen(true)}>+ Добавить платёж</button>
      </div>
      <div className="grid">
        {addrPayments.length===0 && <div className="muted">Пока нет платежей.</div>}
        {addrPayments.map(p => (
          <div key={p.id} className="panel flex space">
            <div><div style={{fontWeight:600}}>{new Date(p.date).toLocaleDateString('ru-RU')} — ₽ {p.amount.toLocaleString('ru-RU')}</div>{p.note && <div className="muted">{p.note}</div>}</div>
            <button className="button" style={{borderColor:'#ef4444', color:'#ef4444'}} onClick={()=>setPayments((prev:any[])=>prev.filter(x=>x.id!==p.id))}>Удалить</button>
          </div>
        ))}
      </div>
      <PaymentEditor open={editorOpen} onClose={()=>setEditorOpen(false)} onSave={(rec:any)=>setPayments((prev:any[])=>[rec, ...prev])} addressId={addressId} />
    </div>
  )
}
