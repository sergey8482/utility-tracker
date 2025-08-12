import React from 'react'
export default function SettingsPage({ state, setState, doBackup, doRestore, clearAll }:
  { state:any; setState:(fn:any)=>void; doBackup:()=>void; doRestore:(f:File)=>void; clearAll:()=>void }){
  const { settings } = state
  return (
    <div className="container grid" style={{gap:16}}>
      <section className="panel">
        <h3>Общие настройки</h3>
        <label><input type="checkbox" checked={settings.darkMode} onChange={e=>setState((s:any)=>({...s, settings:{...s.settings, darkMode:e.target.checked}}))} /> Тёмная тема</label>
        <label><input type="checkbox" checked={settings.notifications} onChange={e=>setState((s:any)=>({...s, settings:{...s.settings, notifications:e.target.checked}}))} /> Уведомления</label>
      </section>
      <section className="panel">
        <h3>Данные и резервное копирование</h3>
        <div className="flex" style={{gap:8}}>
          <button className="button primary" onClick={doBackup}>Экспорт данных</button>
          <label className="button"><input type="file" accept="application/json" style={{display:'none'}} onChange={e=>e.target.files && doRestore(e.target.files[0])} /> Импорт данных</label>
        </div>
      </section>
      <section className="panel">
        <h3>Сброс</h3>
        <button className="button" style={{borderColor:'#ef4444', color:'#ef4444'}} onClick={clearAll}>Очистить все данные</button>
      </section>
    </div>
  )
}
