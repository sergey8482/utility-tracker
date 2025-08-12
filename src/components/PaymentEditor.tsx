import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { yyyy_mm_dd } from '../utils'
export default function PaymentEditor({ open, onClose, onSave, addressId }:
  { open:boolean; onClose:()=>void; onSave:(payload:any)=>void; addressId:string }){
  const [date, setDate] = useState(yyyy_mm_dd())
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  useEffect(()=>{ if(open){ setDate(yyyy_mm_dd()); setAmount(''); setNote('') } }, [open])
  return (
    <Modal open={open} onClose={onClose}>
      <h3 style={{marginBottom:8}}>Добавить платёж</h3>
      <div className="grid" style={{gap:10}}>
        <label>Дата<input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
        <label>Сумма, ₽<input inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} /></label>
        <label>Комментарий<input value={note} onChange={e=>setNote(e.target.value)} /></label>
        <div className="flex" style={{justifyContent:'flex-end', gap:8}}>
          <button className="button" onClick={onClose}>Отмена</button>
          <button className="button primary" onClick={()=>{ if(!amount) return alert('Введите сумму'); onSave({ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), addressId, date, amount: Number(amount), note }); onClose() }}>Добавить</button>
        </div>
      </div>
    </Modal>
  )
}
