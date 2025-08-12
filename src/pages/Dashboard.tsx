import React from 'react'
import { Card } from '../components/UI'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { fmt, monthKey, monthLabel } from '../utils'
export default function Dashboard({ meters, readings, payments, addressId }:{ meters:any[]; readings:any[]; payments:any[]; addressId:string }){
  const metersCount = meters.filter(m=>m.addressId===addressId).length
  const readingsCount = readings.filter(r=>r.addressId===addressId).length
  const monthSum = payments.filter(p=>p.addressId===addressId && monthKey(p.date)===monthKey(new Date())).reduce((s,p)=>s+(p.amount||0),0)
  const last12 = Array.from({length:12}).map((_,i)=>{ const d=new Date(); d.setMonth(d.getMonth()-(11-i)); const ym=monthKey(d); return { ym, label: monthLabel(ym), value: 0 } })
  const addrMeters = meters.filter(m=>m.addressId===addressId)
  addrMeters.forEach(m=>{ const r = readings.filter(x=>x.meterId===m.id).sort((a:any,b:any)=>+new Date(a.date)-+new Date(b.date)); for(let i=1;i<r.length;i++){ const prev=r[i-1], cur=r[i]; const diff = ['t1','t2','t3'].reduce((s,k:any)=>{ const a=(+cur[k]||0) - (+prev[k]||0); return s + (a>0?a:0) },0); const mk = monthKey(cur.date); const slot = last12.find(x=>x.ym===mk); if(slot) slot.value += diff } })
  return (
    <div className="container">
      <div className="cards">
        <Card title="Счётчиков" value={fmt(metersCount)} icon="⚡" />
        <Card title="Показаний" value={fmt(readingsCount)} icon="⏱️" />
        <Card title="Платежей за месяц" value={"₽ "+fmt(monthSum)} icon="💳" />
      </div>
      <div className="panel" style={{marginTop:16}}>
        <div className="muted" style={{marginBottom:8}}>Потребление за последние 12 месяцев</div>
        <div style={{width:'100%', height:320}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last12} margin={{ left: 20, right: 10, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={1} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
