'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, LockKeyhole, Pencil, Plus, RotateCcw, Save, Settings2, Trash2, X } from 'lucide-react'

type DayState = 'available' | 'configured' | 'blocked' | 'disabled'
type Interval = { id: number; start: string; end: string; type: 'laboral' | 'bloqueado'; inactive?: boolean }
type Day = { id: string; date: Date; intervals: Interval[]; hasReservation?: boolean }

const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const shortDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
const seed = [
  ['2026-04-01', '09:00', '13:00', 'laboral'], ['2026-04-04', '10:00', '16:00', 'laboral'], ['2026-04-05', '00:00', '23:59', 'bloqueado'],
  ['2026-04-09', '09:00', '12:00', 'laboral'], ['2026-04-11', '08:30', '14:00', 'laboral'], ['2026-04-15', '19:00', '20:30', 'laboral'],
  ['2026-04-18', '09:00', '12:00', 'laboral'], ['2026-04-23', '13:00', '17:00', 'laboral'],
] as const
const dateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const asDate = (value: Date | string) => {
  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(value.getTime())
}
const formatMonth = (date: Date | string) => asDate(date).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
const formatDate = (date: Date | string) => asDate(date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const mondayIndex = (date: Date) => (date.getDay() + 6) % 7
const weekdayForDate = (date: Date) => weekdays[(date.getDay() + 6) % 7]

function createDays() {
  const result: Day[] = []
  // Keep a real date record for every day in the navigable range. This makes
  // months outside the seeded April demo fully visible and editable.
  const start = new Date(2025, 0, 1)
  const end = new Date(2028, 11, 31)
  let nextIntervalId = 1
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const key = dateKey(cursor)
    const intervals = seed
      .filter((item) => item[0] === key)
      .map((item) => ({ id: nextIntervalId++, start: item[1], end: item[2], type: item[3] }))
    result.push({ id: key, date: new Date(cursor), intervals })
  }
  return result
}

export function AvailabilityDashboard() {
  const [days, setDays] = useState(createDays)
  const [selectedId, setSelectedId] = useState('2026-04-15')
  const [view, setView] = useState<'month' | 'week'>('month')
  const [cursor, setCursor] = useState(new Date(2026, 3, 15))
  const [modal, setModal] = useState<'interval' | 'block' | 'edit' | 'delete' | null>(null)
  const [editing, setEditing] = useState<Interval | null>(null)
  const [toast, setToast] = useState('')
  const [reservationReprogrammed, setReservationReprogrammed] = useState(false)
  const [form, setForm] = useState({ start: '', end: '', type: 'laboral' as Interval['type'] })
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ Lunes: true, Martes: true, Miércoles: true, Jueves: true, Viernes: true, Sábado: true, Domingo: true })
  const [lead, setLead] = useState('4')
  const [unit, setUnit] = useState('horas')
  const [limit, setLimit] = useState('5')
  const selected = days.find((day) => day.id === selectedId) ?? days[0]
  const visibleDays = useMemo(() => {
    if (view === 'week') {
      const monday = new Date(cursor); monday.setDate(cursor.getDate() - mondayIndex(cursor))
      return Array.from({ length: 7 }, (_, index) => days.find((day) => dateKey(day.date) === dateKey(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index)))).filter(Boolean) as Day[]
    }
    return days.filter((day) => day.date.getMonth() === cursor.getMonth() && day.date.getFullYear() === cursor.getFullYear())
  }, [days, view, cursor])

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 3200) }
  function dayState(day: Day): DayState { if (!enabled[weekdayForDate(day.date)]) return 'disabled'; if (day.intervals.some((item) => item.type === 'bloqueado' && item.start === '00:00')) return 'blocked'; if (day.intervals.length) return 'configured'; return 'available' }
  function selectDay(day: Day) { if (dayState(day) === 'disabled') { notify('Debe habilitar este día para editar su configuración.'); return }; setSelectedId(day.id) }
  function toggleWeekday(name: string) { setEnabled((current) => ({ ...current, [name]: !current[name] })); notify(`${name} quedó ${enabled[name] ? 'deshabilitado' : 'habilitado'} para editar todas sus próximas repeticiones.`) }
  function saveInterval(event: React.FormEvent) {
    event.preventDefault(); if (!form.start || !form.end) return notify('Completá la hora de inicio y de fin.'); if (form.end <= form.start) return notify('La hora de fin debe ser posterior a la hora de inicio.')
    if (form.type === 'bloqueado' && selected.id === '2026-04-16' && form.start === '12:00' && form.end === '17:00') return notify('Existen reservas activas dentro de las próximas 24 horas. Debe gestionarlas desde Agenda antes de bloquear este horario.')
    if (selected.intervals.some((item) => item.id !== editing?.id && form.start < item.end && form.end > item.start)) return notify('El horario seleccionado se superpone con un intervalo existente.')
    setDays((current) => current.map((day) => day.id !== selected.id ? day : { ...day, intervals: editing ? day.intervals.map((item) => item.id === editing.id ? { ...item, ...form } : item) : [...day.intervals, { id: Date.now(), ...form }] }))
    setModal(null); setEditing(null); notify(editing ? 'Intervalo modificado correctamente.' : 'El intervalo se creó correctamente.')
  }
  function openEdit(interval: Interval) { setEditing(interval); setForm({ start: interval.start, end: interval.end, type: interval.type }); setModal('edit') }
  function deleteInterval(_all: boolean) {
    if (selected.id === '2026-04-15' && editing?.start === '19:00' && editing?.end === '20:30' && editing.type === 'laboral') return notify('Existen reservas activas dentro de las próximas 24 horas. Debe gestionarlas desde Agenda antes de eliminar este horario.')
    setDays((current) => current.map((day) => day.id !== selected.id ? day : { ...day, intervals: day.intervals.filter((item) => item.id !== editing?.id) })); setModal(null); notify('La instancia fue eliminada.')
  }
  function blockDay() {
    if (selected.id === '2026-04-15') return notify('¡Advertencia! El día / intervalo que intenta bloquear registra reservas activas dentro de las próximas 24 hs. Acceda a Agenda para reprogramarlas o cancelarlas, e intente nuevamente.')
    if (selected.id === '2026-04-23' && !reservationReprogrammed) return setModal('block')
    if (selected.hasReservation) return setModal('block'); confirmBlock()
  }
  function confirmBlock() { setDays((current) => current.map((day) => day.id === selected.id ? { ...day, intervals: day.intervals.some((item) => item.start === '00:00' && item.type === 'bloqueado') ? day.intervals : [...day.intervals, { id: Date.now(), start: '00:00', end: '23:59', type: 'bloqueado' }] } : day)); if (selected.id === '2026-04-23') setReservationReprogrammed(true); setModal(null); notify('El día quedó bloqueado. Podés revertirlo desde “Desbloquear día”.') }
  function unblockDay() { setDays((current) => current.map((day) => day.id === selected.id ? { ...day, intervals: day.intervals.filter((item) => !(item.start === '00:00' && item.end === '23:59' && item.type === 'bloqueado')) } : day)); notify('El día fue desbloqueado correctamente.') }
  function navigate(amount: number) { setCursor((current) => new Date(current.getFullYear(), current.getMonth() + (view === 'month' ? amount : 0), current.getDate() + (view === 'week' ? amount * 7 : 0))) }
  function savePreferences(event: React.FormEvent) { event.preventDefault(); if (!/^\d+$/.test(lead) || Number(lead) <= 0 || !/^\d+$/.test(limit) || Number(limit) <= 0) return notify('Ingrese un valor numérico entero mayor a cero.'); notify('Preferencias guardadas correctamente.') }

  return <div className="app-shell"><header className="topbar"><div className="brand">AgendaYA <span>— Administrador</span></div><nav><a>Inicio</a><a className="active">Disponibilidad</a><a>Eventos</a><a>Agenda</a></nav><button className="avatar" data-cy="profile-menu">AD</button></header><main className="content"><div className="page-heading"><div><p className="eyebrow">CONFIGURACIÓN</p><h1>Disponibilidad</h1><p className="muted">Definí cuándo pueden reservar reuniones contigo.</p></div><div className="sync"><span className="status-dot" /> Todos los cambios están guardados</div></div><section className="toolbar-card"><div className="toolbar-title"><CalendarDays size={18} /><div><strong>Calendario</strong><span>{formatMonth(cursor)}</span></div></div><div className="view-switch"><button data-cy="month-view-button" className={view === 'month' ? 'selected' : ''} onClick={() => setView('month')}>Vista mensual</button><button data-cy="week-view-button" className={view === 'week' ? 'selected' : ''} onClick={() => setView('week')}>Vista semanal</button></div><div className="arrows"><button aria-label="Mes anterior" data-cy="previous-month" onClick={() => navigate(-1)}><ChevronLeft size={17} /></button><button aria-label="Mes siguiente" data-cy="next-month" onClick={() => navigate(1)}><ChevronRight size={17} /></button></div></section><section className="workspace"><div className="calendar-panel"><div className="calendar-head"><span>{formatMonth(cursor).toUpperCase()}</span><div className="legend"><span><i className="dot green" /> Disponible</span><span><i className="dot blue" /> Configurado</span><span><i className="dot red" /> Bloqueado</span><span><i className="dot gray" /> No editable</span></div></div><div className={`calendar-grid ${view}`}><div className="week-labels">{shortDays.map((day) => <span key={day}>{day}</span>)}</div><div className="days-grid">{visibleDays.map((day, index) => <button key={day.id} style={index === 0 && view === 'month' ? { gridColumnStart: mondayIndex(day.date) + 1 } : undefined} data-cy={`calendar-day-${day.date.getDate()}`} aria-label={`${day.date.getDate()}, ${dayState(day)}`} onClick={() => selectDay(day)} className={`day-cell ${dayState(day)} ${selected.id === day.id ? 'selected-day' : ''}`}><b>{day.date.getDate()}</b>{day.intervals.filter((item) => !item.inactive).slice(0, 2).map((interval) => <span key={interval.id} className={`mini-interval ${interval.type}`}>{interval.start} – {interval.end}{interval.recurring ? ' · semanal' : ''}</span>)}</button>)}</div></div></div><aside className="detail-panel"><div className="detail-header"><div><p className="eyebrow">DÍA SELECCIONADO</p><h2>{asDate(selected.id).getDate()} de {asDate(selected.id).toLocaleDateString('es-AR', { month: 'long' })}</h2></div><span className={`state-pill ${dayState(selected)}`}>{dayState(selected) === 'blocked' ? 'Bloqueado' : dayState(selected) === 'disabled' ? 'Deshabilitado' : dayState(selected) === 'configured' ? 'Configurado' : 'Disponible'}</span></div><p className="detail-date">{formatDate(selected.id)}</p><div className="interval-heading"><strong>Intervalos</strong><span>{selected.intervals.length} configurados</span></div><div className="interval-list">{selected.intervals.length === 0 ? <div className="empty-state"><Clock3 size={23} /><span>Sin intervalos configurados</span><small>Agregá un horario para comenzar.</small></div> : selected.intervals.map((interval) => <div className={`interval-card ${interval.type} ${dayState(selected) === 'blocked' ? 'locked' : ''}`} key={interval.id}><div className="interval-time"><Clock3 size={16} /><strong>{interval.start} – {interval.end}</strong>{interval.recurring && <small className="recurrence-badge">Semanal</small>}</div><span>{interval.type === 'laboral' ? 'Horario laboral' : 'Bloqueo de horario'}</span><div className="interval-actions"><button data-cy={`edit-interval-${interval.id}`} onClick={() => openEdit(interval)} disabled={dayState(selected) === 'disabled' || dayState(selected) === 'blocked'}><Pencil size={13} /> Editar</button><button data-cy={`delete-interval-${interval.id}`} onClick={() => { setEditing(interval); setModal('delete') }} disabled={dayState(selected) === 'disabled' || dayState(selected) === 'blocked'}><Trash2 size={13} /> Eliminar</button></div></div>)}</div>{dayState(selected) === 'blocked' ? <button data-cy="unblock-day-button" className="secondary-button full-button" onClick={unblockDay}><RotateCcw size={16} /> Desbloquear día</button> : <><button data-cy="add-interval-button" className="primary-button" disabled={dayState(selected) === 'disabled'} onClick={() => { setEditing(null); setForm({ start: '', end: '', type: 'laboral', recurring: false }); setModal('interval') }}><Plus size={17} /> Añadir intervalo</button><button data-cy="block-day-button" className="danger-button" disabled={dayState(selected) === 'disabled'} onClick={blockDay}><LockKeyhole size={16} /> Bloquear día seleccionado</button></>}</aside></section><div className="test-notes-grid"><p className="test-note">Bloquear días: Probar bloquear los días 15 de abril y 23 de abril para verificar los criterios de aceptación 3 y 4 respectivamente.</p><p className="test-note">Probar Añadir un nuevo intervalo bloqueado el día 16 de abril de 2026, entre las 12:00 y 17:00hs para testear el Escenario 2 de los criterios de aceptación de la US_ADM_008.</p><p className="test-note">Editar/eliminar: probar eliminación del intervalo laboral del 15 de abril de 2026.</p></div><section className="bottom-grid"><div className="info-card"><div className="section-title"><Settings2 size={18} /><div><h2>Configuración semanal</h2><p>Habilitado = permite editar intervalos en las fechas futuras de ese día.</p></div></div><div className="test-note">Prueba: activar/desactivar un día y comprobar que todas sus fechas futuras cambien entre editable y no editable, conservando sus intervalos.</div><div className="toggles">{weekdays.map((day) => <label key={day} className="toggle-row"><span>{day}</span><input data-cy={`toggle-${day.toLowerCase()}`} type="checkbox" checked={enabled[day]} onChange={() => toggleWeekday(day)} /><i /></label>)}</div></div><form className="info-card preferences" onSubmit={savePreferences}><div className="section-title"><Clock3 size={18} /><div><h2>Preferencias de reuniones</h2><p>Definí reglas para nuevas reservas.</p></div></div><div className="test-note">Pruebas: usar números positivos para guardar; ingresar texto o 0 para validar consistencia; cambiar la antelación/límite para simular reservas existentes.</div><label>Antelación mínima<select data-cy="lead-time-unit" value={unit} onChange={(e) => setUnit(e.target.value)}><option value="horas">Horas</option><option value="días">Días</option></select><input data-cy="lead-time-input" type="text" value={lead} onChange={(e) => setLead(e.target.value)} /></label><label>Límite de reservas diarias<input data-cy="daily-limit-input" type="text" value={limit} onChange={(e) => setLimit(e.target.value)} /></label><button data-cy="save-preferences-button" className="secondary-button" type="submit"><Save size={16} /> Guardar preferencias</button></form></section><div className="bottom-grid"><div className="test-note">Añadir intervalos: probar fin posterior al inicio, superposición y tipo laboral/bloqueado. Usar 09:00–12:00 para creación exitosa.</div><div className="test-note">Editar/eliminar: modificar un intervalo y verificar actualización; eliminar instancia o recurrencia completa. Para reservas próximas, comprobar que la operación sea rechazada.</div><div className="test-note"></div><div className="test-note">Bloquear día: probar sin reservas, con reservas futuras y con reservas dentro de 24 horas. Luego usar “Desbloquear día” para revertir.</div></div></main>{toast && <div data-cy="notification" className="toast" role="status">{toast}</div>}{modal && <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true">{(modal === 'interval' || modal === 'edit') && <><div className="modal-title"><div><p className="eyebrow">{modal === 'edit' ? 'EDITAR INTERVALO' : 'NUEVO INTERVALO'}</p><h2>{modal === 'edit' ? 'Editar intervalo' : 'Añadir intervalo'}</h2></div><button className="icon-button" data-cy="close-modal" onClick={() => setModal(null)}><X size={18} /></button></div><form onSubmit={saveInterval}><label>Hora de inicio<input data-cy="interval-start-input" type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></label><label>Hora de fin<input data-cy="interval-end-input" type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></label><fieldset><legend>Tipo de intervalo</legend><label className="radio"><input data-cy="laboral-type-radio" type="radio" checked={form.type === 'laboral'} onChange={() => setForm({ ...form, type: 'laboral' })} /> Laboral</label><label className="radio"><input data-cy="blocked-type-radio" type="radio" checked={form.type === 'bloqueado'} onChange={() => setForm({ ...form, type: 'bloqueado' })} /> Bloqueado</label></fieldset><label className="repeat-row"><input data-cy="repeat-weekly-checkbox" type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} /> </label><div className="modal-actions"><button type="button" className="ghost-button" onClick={() => setModal(null)}>Cancelar</button><button data-cy="save-interval-button" className="primary-button" type="submit">Guardar intervalo</button></div></form></>}{modal === 'delete' && <><div className="modal-title"><div><p className="eyebrow">BAJA DE INTERVALO</p><h2>Eliminar intervalo</h2></div><button className="icon-button" onClick={() => setModal(null)}><X size={18} /></button></div><p className="modal-copy">¿Está seguro de que desea eliminar este intervalo? Esta acción es irreversible.</p><div className="modal-actions"><button className="ghost-button" onClick={() => deleteInterval(false)}>Eliminar definitivamente</button><button data-cy="delete-recurring-button" className="danger-button" onClick={() => deleteInterval(true)}></button></div></>}{modal === 'block' && <><div className="modal-title"><div><p className="eyebrow">RESERVA FUTURA DETECTADA</p><h2>¿Bloquear este día?</h2></div><button className="icon-button" onClick={() => setModal(null)}><X size={18} /></button></div><div className="warning-box"><LockKeyhole size={20} /><p>El día registra reservas activas. Las reservas futuras quedarán pendientes de reprogramación.</p></div><div className="modal-actions"><button data-cy="cancel-block-button" className="ghost-button" onClick={() => setModal(null)}>Cancelar</button><button data-cy="confirm-block-button" className="danger-button" onClick={confirmBlock}>Confirmar cambio</button></div></>}</div></div>}</div>
}
