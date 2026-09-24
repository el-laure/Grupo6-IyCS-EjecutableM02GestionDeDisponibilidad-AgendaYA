'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, LockKeyhole, Plus, Save, Settings2, X } from 'lucide-react'

type DayState = 'available' | 'configured' | 'blocked' | 'disabled'
type Interval = { id: number; start: string; end: string; type: 'laboral' | 'bloqueado' }
type Day = { id: number; date: number; label: string; state: DayState; intervals: Interval[]; hasReservation?: boolean }

const weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
const initialDays: Day[] = [
  { id: 1, date: 1, label: 'Lun 1', state: 'configured', intervals: [{ id: 1, start: '09:00', end: '13:00', type: 'laboral' }] },
  { id: 2, date: 2, label: 'Mar 2', state: 'available', intervals: [] },
  { id: 3, date: 3, label: 'Mié 3', state: 'available', intervals: [] },
  { id: 4, date: 4, label: 'Jue 4', state: 'configured', intervals: [{ id: 2, start: '10:00', end: '16:00', type: 'laboral' }] },
  { id: 5, date: 5, label: 'Vie 5', state: 'blocked', intervals: [{ id: 3, start: '00:00', end: '23:59', type: 'bloqueado' }] },
  { id: 6, date: 8, label: 'Lun 8', state: 'available', intervals: [] },
  { id: 7, date: 9, label: 'Mar 9', state: 'configured', intervals: [{ id: 4, start: '09:00', end: '12:00', type: 'laboral' }] },
  { id: 8, date: 10, label: 'Mié 10', state: 'available', intervals: [] },
  { id: 9, date: 11, label: 'Jue 11', state: 'configured', intervals: [{ id: 5, start: '08:30', end: '14:00', type: 'laboral' }] },
  { id: 10, date: 12, label: 'Vie 12', state: 'available', intervals: [] },
  { id: 11, date: 15, label: 'Lun 15', state: 'configured', intervals: [{ id: 6, start: '19:00', end: '20:30', type: 'laboral' }], hasReservation: true },
  { id: 12, date: 16, label: 'Mar 16', state: 'available', intervals: [] },
  { id: 13, date: 17, label: 'Mié 17', state: 'available', intervals: [] },
  { id: 14, date: 18, label: 'Jue 18', state: 'configured', intervals: [{ id: 7, start: '09:00', end: '12:00', type: 'laboral' }] },
  { id: 15, date: 19, label: 'Vie 19', state: 'available', intervals: [] },
  { id: 16, date: 22, label: 'Lun 22', state: 'available', intervals: [] },
  { id: 17, date: 23, label: 'Mar 23', state: 'configured', intervals: [{ id: 8, start: '13:00', end: '17:00', type: 'laboral' }] },
  { id: 18, date: 24, label: 'Mié 24', state: 'available', intervals: [] },
  { id: 19, date: 25, label: 'Jue 25', state: 'available', intervals: [] },
  { id: 20, date: 26, label: 'Vie 26', state: 'available', intervals: [] },
  { id: 21, date: 29, label: 'Lun 29', state: 'available', intervals: [] },
  { id: 22, date: 30, label: 'Mar 30', state: 'available', intervals: [] },
]

function stateLabel(state: DayState) { return { available: 'Disponible', configured: 'Configurado', blocked: 'Bloqueado', disabled: 'Deshabilitado' }[state] }

export function AvailabilityDashboard() {
  const [days, setDays] = useState(initialDays)
  const [selectedId, setSelectedId] = useState(11)
  const [view, setView] = useState<'month' | 'week'>('month')
  const [modal, setModal] = useState<'interval' | 'block' | null>(null)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({ start: '', end: '', type: 'laboral' as Interval['type'] })
  const [lead, setLead] = useState('4')
  const [unit, setUnit] = useState('horas')
  const [limit, setLimit] = useState('5')
  const selected = days.find((day) => day.id === selectedId) ?? days[0]
  const visibleDays = useMemo(() => view === 'week' ? days.slice(10, 17) : days, [days, view])

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 3200) }
  function selectDay(day: Day) {
    if (day.state === 'disabled') { notify('Debe habilitar este día para editar su configuración.'); return }
    setSelectedId(day.id)
  }
  function saveInterval(event: React.FormEvent) {
    event.preventDefault()
    if (!form.start || !form.end) { notify('Completá la hora de inicio y de fin.'); return }
    if (form.end <= form.start) { notify('La hora de fin debe ser posterior a la hora de inicio.'); return }
    if (selected.intervals.some((item) => form.start < item.end && form.end > item.start)) { notify('El horario seleccionado se superpone con un intervalo existente.'); return }
    setDays((current) => current.map((day) => day.id === selected.id ? { ...day, state: 'configured', intervals: [...day.intervals, { id: Date.now(), start: form.start, end: form.end, type: form.type }] } : day))
    setForm({ start: '', end: '', type: 'laboral' }); setModal(null); notify('El intervalo se creó correctamente.')
  }
  function blockDay() {
    if (selected.hasReservation) { setModal('block'); return }
    confirmBlock()
  }
  function confirmBlock() {
    setDays((current) => current.map((day) => day.id === selected.id ? { ...day, state: 'blocked', intervals: [{ id: Date.now(), start: '00:00', end: '23:59', type: 'bloqueado' }] } : day))
    setModal(null); notify(`El día ${selected.date}/04/2026 pasó a estado bloqueado correctamente.`)
  }
  function savePreferences(event: React.FormEvent) {
    event.preventDefault()
    if (!/^\d+$/.test(lead) || Number(lead) <= 0 || !/^\d+$/.test(limit) || Number(limit) <= 0) { notify('Ingrese un valor numérico entero mayor a cero.'); return }
    notify('Preferencias guardadas correctamente.')
  }

  return <div className="app-shell">
    <header className="topbar"><div className="brand">AgendaYA <span>— Administrador</span></div><nav><a>Inicio</a><a className="active">Disponibilidad</a><a>Eventos</a><a>Agenda</a></nav><button className="avatar" data-cy="profile-menu">AD</button></header>
    <main className="content">
      <div className="page-heading"><div><p className="eyebrow">CONFIGURACIÓN</p><h1>Disponibilidad</h1><p className="muted">Definí cuándo pueden reservar reuniones contigo.</p></div><div className="sync"><span className="status-dot" /> Todos los cambios están guardados</div></div>
      <section className="toolbar-card"><div className="toolbar-title"><CalendarDays size={18} /><div><strong>Calendario</strong><span> Abril 2026</span></div></div><div className="view-switch"><button data-cy="month-view-button" className={view === 'month' ? 'selected' : ''} onClick={() => setView('month')}>Vista mensual</button><button data-cy="week-view-button" className={view === 'week' ? 'selected' : ''} onClick={() => setView('week')}>Vista semanal</button></div><div className="arrows"><button aria-label="Mes anterior" data-cy="previous-month"><ChevronLeft size={17} /></button><button aria-label="Mes siguiente" data-cy="next-month"><ChevronRight size={17} /></button></div></section>
      <section className="workspace"><div className="calendar-panel"><div className="calendar-head"><span>ABRIL 2026</span><div className="legend"><span><i className="dot green" /> Disponible</span><span><i className="dot blue" /> Configurado</span><span><i className="dot red" /> Bloqueado</span></div></div><div className={`calendar-grid ${view}`}><div className="week-labels">{weekDays.map((day) => <span key={day}>{day}</span>)}</div><div className="days-grid">{visibleDays.map((day) => <button key={day.id} data-cy={`calendar-day-${day.date}`} aria-label={`${day.label}, ${stateLabel(day.state)}`} onClick={() => selectDay(day)} className={`day-cell ${day.state} ${selected.id === day.id ? 'selected-day' : ''}`}><b>{day.date}</b>{day.intervals.slice(0, 2).map((interval) => <span key={interval.id} className={`mini-interval ${interval.type}`}>{interval.start} – {interval.end}</span>)}</button>)}</div></div></div>
        <aside className="detail-panel"><div className="detail-header"><div><p className="eyebrow">DÍA SELECCIONADO</p><h2>{selected.label}</h2></div><span className={`state-pill ${selected.state}`}>{stateLabel(selected.state)}</span></div><p className="detail-date">Miércoles 15 de abril de 2026</p><div className="interval-heading"><strong>Intervalos</strong><span>{selected.intervals.length} configurados</span></div><div className="interval-list">{selected.intervals.length === 0 ? <div className="empty-state"><Clock3 size={23} /><span>Sin intervalos configurados</span><small>Agregá un horario para comenzar.</small></div> : selected.intervals.map((interval) => <div className={`interval-card ${interval.type}`} key={interval.id}><div className="interval-time"><Clock3 size={16} /><strong>{interval.start} – {interval.end}</strong></div><span>{interval.type === 'laboral' ? 'Horario laboral' : 'Bloqueo de horario'}</span></div>)}</div><button data-cy="add-interval-button" className="primary-button" disabled={selected.state === 'blocked'} onClick={() => setModal('interval')}><Plus size={17} /> Añadir intervalo</button><button data-cy="block-day-button" className="danger-button" disabled={selected.state === 'blocked'} onClick={blockDay}><LockKeyhole size={16} /> Bloquear día seleccionado</button></aside></section>
      <section className="bottom-grid"><div className="info-card"><div className="section-title"><Settings2 size={18} /><div><h2>Configuración semanal</h2><p>Habilitá los días en los que recibís reservas.</p></div></div><div className="toggles">{['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => <label key={day} className="toggle-row"><span>{day}</span><input data-cy={`toggle-${day.toLowerCase()}`} type="checkbox" defaultChecked={index < 5} /><i /></label>)}</div></div><form className="info-card preferences" onSubmit={savePreferences}><div className="section-title"><Clock3 size={18} /><div><h2>Preferencias de reuniones</h2><p>Definí reglas para nuevas reservas.</p></div></div><label>Antelación mínima<select data-cy="lead-time-unit" value={unit} onChange={(e) => setUnit(e.target.value)}><option value="horas">Horas</option><option value="días">Días</option></select><input data-cy="lead-time-input" type="text" value={lead} onChange={(e) => setLead(e.target.value)} /></label><label>Límite de reservas diarias<input data-cy="daily-limit-input" type="text" value={limit} onChange={(e) => setLimit(e.target.value)} /></label><button data-cy="save-preferences-button" className="secondary-button" type="submit"><Save size={16} /> Guardar preferencias</button></form></section>
    </main>
    {toast && <div data-cy="notification" className="toast" role="status">{toast}</div>}
    {modal && <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true">{modal === 'interval' ? <><div className="modal-title"><div><p className="eyebrow">NUEVO INTERVALO</p><h2>Añadir intervalo</h2></div><button className="icon-button" data-cy="close-modal" onClick={() => setModal(null)}><X size={18} /></button></div><form onSubmit={saveInterval}><label>Hora de inicio<input data-cy="interval-start-input" type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></label><label>Hora de fin<input data-cy="interval-end-input" type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></label><fieldset><legend>Tipo de intervalo</legend><label className="radio"><input data-cy="laboral-type-radio" type="radio" checked={form.type === 'laboral'} onChange={() => setForm({ ...form, type: 'laboral' })} /> Laboral</label><label className="radio"><input data-cy="blocked-type-radio" type="radio" checked={form.type === 'bloqueado'} onChange={() => setForm({ ...form, type: 'bloqueado' })} /> Bloqueado</label></fieldset><div className="modal-actions"><button type="button" className="ghost-button" onClick={() => setModal(null)}>Cancelar</button><button data-cy="save-interval-button" className="primary-button" type="submit">Guardar intervalo</button></div></form></> : <><div className="modal-title"><div><p className="eyebrow">RESERVA FUTURA DETECTADA</p><h2>¿Bloquear este día?</h2></div><button className="icon-button" onClick={() => setModal(null)}><X size={18} /></button></div><div className="warning-box"><LockKeyhole size={20} /><p>¡Advertencia! El día / intervalo que intenta bloquear registra reservas activas.</p></div><p className="modal-copy">La reserva afectada pasará a estado “Pendiente de reprogramación”.</p><div className="modal-actions"><button data-cy="cancel-block-button" className="ghost-button" onClick={() => setModal(null)}>Cancelar</button><button data-cy="confirm-block-button" className="danger-button" onClick={confirmBlock}>Confirmar cambio</button></div></>}</div></div>}
  </div>
}

