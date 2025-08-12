import React from 'react'
export const Card = ({ title, value, icon }:{ title:string; value:string; icon:string }) => (
  <div className="card">
    <div style={{fontSize:24}}>{icon}</div>
    <div>
      <div className="muted" style={{fontSize:12}}>{title}</div>
      <div style={{fontSize:22,fontWeight:600}}>{value}</div>
    </div>
  </div>
)
export const NavItem = ({ icon, label, active, onClick }:{ icon:string; label:string; active:boolean; onClick:()=>void }) => (
  <button className={` ${active ? 'active':''}`} onClick={onClick}><span style={{fontSize:18}}>{icon}</span><span>{label}</span></button>
)
export const TopBar = ({ addresses, selectedAddressId, setSelectedAddressId, onAddReading }:
  { addresses:{id:string;name:string}[]; selectedAddressId:string; setSelectedAddressId:(v:string)=>void; onAddReading:()=>void }) => (
  <div className="topbar">
    <div style={{fontWeight:600}}>УтилитиТрекер</div>
    <div className="flex" style={{gap:8}}>
      <select value={selectedAddressId} onChange={e=>setSelectedAddressId(e.target.value)} className="button">
        {addresses.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      <button className="button primary" onClick={onAddReading}>+ Добавить показание</button>
    </div>
  </div>
)
