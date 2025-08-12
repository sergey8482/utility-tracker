import React, { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { buildCSV, monthKey, monthLabel } from '../utils'
export default function StatisticsPage({ addressId, meters, readings, payments }:
  { addressId:string; meters:any[]; readings:any[]; payments:any[] }){
  const months = useMemo(()=>Array.from({length:18}).map((_,i)=>{ const d=new Date(); d.setMonth(d.getMonth()-(17-i)); const ym=monthKey(d); return { ym, label: monthLabel(ym) }}),[])
  const data = useMemo(()=>{
    const rows = months.map(m=>({ ym:m.ym, label:m.label, consumption:0, payments:0 }))
    const addrMeters = meters.filter(m=>m.addressId===addressId)
    addrMeters.forEach(m=>{
      const r = readings.filter(x=>x.meterId===m.id).sort((a:any,b:any)=>+new Date(a.date)-+new Date(b.date))
      for(let i=1;i<r.length;i++){ const prev=r[i-1], cur=r[i]; const diff=['t1','t2','t3'].reduce((s,k:any)=>s+Math.max(0,(+cur[k]||0)-(+prev[k]||0)),0); const slot = rows.find(x=>x.ym===monthKey(cur.date)); if(slot) slot.consumption += diff }
    })
    payments.filter(p=>p.addressId===addressId).forEach(p=>{ const slot = rows.find(x=>x.ym===monthKey(p.date)); if(slot) slot.payments += (+p.amount||0) })
    return rows
  }, [addressId, meters, months, payments, readings])
  const exportCSV = () => {
    const header = ['Месяц','Потребление (сумма по Т1–Т3)','Платежи, ₽']
    const rows = data.map(r => [r.label, r.consumption, r.payments])
    const csv = buildCSV([header, ...rows])
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'stat.csv'; a.click()
  }
  return (
    <div className="container">
      <div className="panel">
        <div className="flex space" style={{marginBottom:8}}><div className="muted">Статистика за 18 месяцев</div><button className="button" onClick={exportCSV}>Экспорт в CSV</button></div>
        <div style={{width:'100%', height:360}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 20, right: 10, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={1} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="consumption" name="Потребление" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="payments" name="Платежи" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
