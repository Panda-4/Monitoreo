import { FileText, CheckCircle, Clock, TrendingUp, DollarSign, ClipboardCheck, FileSearch, FileQuestion, ShieldAlert, Layers } from 'lucide-react';
import { SolicitudModel } from '../types';

interface DashboardProps {
  data: SolicitudModel[];
  userName: string;
}

// Donut Chart colors per status
const ESTATUS_COLORS = [
  { key: 'En Opinión Técnica de Subdirección de Fianzas y Seguros', label: 'Opinión Técnica', color: '#3B82F6', emoji: '🔵' },
  { key: 'En proceso de elaboración', label: 'En Proceso', color: '#F59E0B', emoji: '🟡' },
  { key: 'En Firma de Dirección General', label: 'Firma DG', color: '#8B5CF6', emoji: '🟣' },
  { key: 'En autorización de la OM', label: 'Autorización OM', color: '#10B981', emoji: '🟢' },
  { key: 'Concluido Entregado a dependencia solicitante', label: 'Concluido', color: '#6B7280', emoji: '⚫' },
];

export default function Dashboard({ data, userName }: DashboardProps) {
  const total = data.length;
  const enOpinion = data.filter(d => d.estatusGeneral === 'En Opinión Técnica de Subdirección de Fianzas y Seguros').length;
  const enProceso = data.filter(d => d.estatusGeneral === 'En proceso de elaboración').length;
  const enFirma = data.filter(d => d.estatusGeneral === 'En Firma de Dirección General').length;
  const enAutorizacion = data.filter(d => d.estatusGeneral === 'En autorización de la OM').length;
  const concluidos = data.filter(d => d.estatusGeneral === 'Concluido Entregado a dependencia solicitante').length;
  const enTramite = enOpinion + enProceso + enFirma + enAutorizacion;

  const montoTotal = data.reduce((acc, c) => acc + (c.montoSolicitud || 0), 0);
  const montoAutorizado = data.filter(d => d.estatusGeneral === 'Concluido Entregado a dependencia solicitante').reduce((acc, c) => acc + (c.montoSolicitud || 0), 0);
  const montoEnTramite = data.filter(d => d.estatusGeneral !== 'Concluido Entregado a dependencia solicitante').reduce((acc, c) => acc + (c.montoSolicitud || 0), 0);

  // Donut chart data
  const donutData = ESTATUS_COLORS.map(e => ({
    ...e,
    value: data.filter(d => d.estatusGeneral === e.key).length,
  })).filter(d => d.value > 0);

  const donutTotal = donutData.reduce((acc, d) => acc + d.value, 0);
  const RADIUS = 70;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Calculate segments
  let cumulativeOffset = 0;
  const segments = donutData.map(d => {
    const percentage = donutTotal > 0 ? d.value / donutTotal : 0;
    const arcLength = percentage * CIRCUMFERENCE;
    const segment = { ...d, percentage, arcLength, offset: cumulativeOffset };
    cumulativeOffset += arcLength;
    return segment;
  });

  // Type breakdown
  const tipos = [
    { label: 'Dictamen Técnico', icon: ClipboardCheck, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Dictamen de Procedencia', icon: FileSearch, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Opinión Técnica Previa', icon: FileQuestion, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { label: 'Dictamen Previo', icon: FileText, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' },
    { label: 'Excepción a Medidas de Austeridad', icon: ShieldAlert, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30' },
  ].map(t => ({ ...t, count: data.filter(d => d.tipoSolicitud === t.label).length }));

  const kpis = [
    { label: 'Total Solicitudes', value: total, icon: FileText, accent: 'from-blue-500 to-indigo-600', iconBg: 'bg-blue-50 dark:bg-blue-900/40', iconColor: 'text-blue-600 dark:text-blue-400' },
    { label: 'En Trámite', value: enTramite, icon: Clock, accent: 'from-amber-500 to-orange-600', iconBg: 'bg-amber-50 dark:bg-amber-900/40', iconColor: 'text-amber-600 dark:text-amber-400' },
    { label: 'En Autorización OM', value: enAutorizacion, icon: CheckCircle, accent: 'from-emerald-500 to-teal-600', iconBg: 'bg-emerald-50 dark:bg-emerald-900/40', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Concluidas', value: concluidos, icon: TrendingUp, accent: 'from-violet-500 to-purple-600', iconBg: 'bg-violet-50 dark:bg-violet-900/40', iconColor: 'text-violet-600 dark:text-violet-400' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 tracking-tight">Dashboard</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Bienvenido, {userName}. Resumen del sistema de dictámenes.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 relative overflow-hidden group hover:shadow-md transition-all">
              <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${kpi.accent}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${kpi.iconBg}`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-3xl font-bold text-gray-800 dark:text-slate-100">{kpi.value}</h4>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ===== DONUT CHART — Distribución por Estatus ===== */}
          <div className="lg:col-span-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Solicitudes por Estatus</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Distribución proporcional del pipeline de trámites
                </p>
              </div>
              <span className="text-xs font-bold bg-gem-primary/10 text-gem-primary px-3 py-1.5 rounded-lg border border-gem-primary/20">
                {total} total
              </span>
            </div>

            {total === 0 ? (
              <div className="flex items-center justify-center py-12 text-gray-400 dark:text-slate-500">
                <div className="text-center">
                  <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">Sin datos para mostrar</p>
                  <p className="text-xs mt-1">Registre solicitudes para ver la gráfica</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Legend */}
                <div className="flex-1 space-y-3 order-2 md:order-1">
                  {ESTATUS_COLORS.map((e) => {
                    const count = data.filter(d => d.estatusGeneral === e.key).length;
                    const pct = donutTotal > 0 ? ((count / donutTotal) * 100).toFixed(0) : '0';
                    return (
                      <div key={e.key} className="flex items-center gap-3 group cursor-default">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm ring-2 ring-white dark:ring-slate-800"
                          style={{ backgroundColor: e.color }}
                        />
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="text-sm font-medium text-gray-700 dark:text-slate-300 truncate">{e.label}</span>
                          <div className="flex items-center gap-2 ml-2 shrink-0">
                            <span className="text-sm font-bold text-gray-800 dark:text-slate-100">{count}</span>
                            <span className="text-xs text-gray-400 dark:text-slate-500 font-mono w-8 text-right">{pct}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SVG Donut */}
                <div className="relative order-1 md:order-2 shrink-0" style={{ width: 200, height: 200 }}>
                  <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    {/* Background ring */}
                    <circle
                      cx="100" cy="100" r={RADIUS}
                      fill="none"
                      stroke="currentColor"
                      className="text-gray-100 dark:text-slate-700"
                      strokeWidth="32"
                    />
                    {/* Data segments */}
                    {segments.map((seg, i) => (
                      <circle
                        key={i}
                        cx="100" cy="100" r={RADIUS}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="32"
                        strokeDasharray={`${seg.arcLength} ${CIRCUMFERENCE - seg.arcLength}`}
                        strokeDashoffset={-seg.offset}
                        className="transition-all duration-1000 ease-out"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                        }}
                      />
                    ))}
                  </svg>
                  {/* Center label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-gray-800 dark:text-slate-100">{total}</span>
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Total</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-6">Impacto Financiero</h3>
            <div className="flex-1 space-y-5">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Monto Total Solicitado</span>
                </div>
                <p className="text-2xl font-bold font-mono text-gray-800 dark:text-slate-100">${montoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Monto en Trámite</span>
                </div>
                <p className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300">${montoEnTramite.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Monto Concluido</span>
                </div>
                <p className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300">${montoAutorizado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              
              <div className="text-center pt-1 border-t border-gray-100 dark:border-slate-700 mt-auto">
                <span className="text-xs text-gray-400 dark:text-slate-500">Tasa de conclusión</span>
                <p className="text-lg font-bold text-gem-primary">{montoTotal > 0 ? ((montoAutorizado / montoTotal) * 100).toFixed(1) : '0.0'}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-5">Distribución por Tipo de Solicitud</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {tipos.map((t, i) => (
              <div key={i} className={`${t.bg} rounded-xl p-4 border border-transparent hover:border-gray-200 dark:hover:border-slate-600 transition-colors`}>
                <div className="flex items-center gap-2 mb-3">
                  <t.icon className={`w-5 h-5 ${t.color}`} />
                  <span className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t.count}</span>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-slate-400 leading-tight">{t.label}</p>
                {total > 0 && (
                  <div className="mt-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div className="bg-gem-primary h-1.5 rounded-full transition-all" style={{ width: `${(t.count / total) * 100}%` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
