import { FileText, CheckCircle, Clock, TrendingUp, DollarSign, ClipboardCheck, FileSearch, FileQuestion, ShieldAlert, Layers } from 'lucide-react';
import { SolicitudModel } from '../types';

interface DashboardProps {
  data: SolicitudModel[];
  userName: string;
}

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

  // Real monthly data from records
  const currentYear = new Date().getFullYear();
  const monthLabels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const monthlyData = monthLabels.map((_, i) =>
    data.filter(d => {
      if (!d.fechaRecepcionDGRMOM) return false;
      const dt = new Date(d.fechaRecepcionDGRMOM + 'T00:00:00');
      return dt.getFullYear() === currentYear && dt.getMonth() === i;
    }).length
  );

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

  // Logic for dynamic chart range
  const currentMonth = new Date().getMonth();
  const firstMonthWithData = monthlyData.findIndex(v => v > 0);
  const startMonth = firstMonthWithData === -1 ? Math.max(0, currentMonth - 3) : firstMonthWithData;
  
  let lastIdx = -1;
  for (let i = monthlyData.length - 1; i >= 0; i--) {
    if (monthlyData[i] > 0) {
      lastIdx = i;
      break;
    }
  }
  const endMonth = Math.max(currentMonth, lastIdx);
  
  const visibleMonths = monthlyData.slice(startMonth, endMonth + 1);
  const visibleLabels = monthLabels.slice(startMonth, endMonth + 1);
  const maxVisible = Math.max(...visibleMonths, 1);

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
          {/* Monthly Chart */}
          <div className="lg:col-span-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Actividad de Solicitudes</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Rango: {visibleLabels[0] || '—'} – {visibleLabels[visibleLabels.length - 1] || '—'} {currentYear}
                </p>
              </div>
              <span className="text-xs font-bold bg-gem-primary/10 text-gem-primary px-3 py-1.5 rounded-lg border border-gem-primary/20">
                {total} acumuladas
              </span>
            </div>

            {/* Chart Area */}
            <div className="relative" style={{ height: '220px' }}>
              {/* Grid Lines */}
              <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none pl-6">
                {[0, 1, 2, 3].map((_, i) => (
                  <div key={i} className="w-full border-t border-gray-100 dark:border-slate-700/50 relative">
                    <span className="absolute -top-2.5 -left-6 text-[9px] text-gray-300 dark:text-slate-600 font-mono tabular-nums">
                      {Math.round((maxVisible / 3) * (3 - i))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="absolute inset-x-0 top-0 bottom-0 flex items-end justify-around gap-3 pl-6 pr-2">
                {visibleMonths.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group relative" style={{ height: '100%' }}>
                    {/* Tooltip */}
                    {val > 0 && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg">
                        {val} solicitud{val !== 1 ? 'es' : ''}
                      </div>
                    )}
                    
                    {/* Bar Column */}
                    <div className="flex-1 w-full flex flex-col justify-end items-center">
                      {val > 0 && (
                        <span className="text-[11px] font-extrabold text-gem-primary dark:text-gem-primary-light mb-1">
                          {val}
                        </span>
                      )}
                      <div
                        className="w-full max-w-[60px] bg-linear-to-t from-gem-primary to-gem-primary-light rounded-t-lg transition-all duration-1000 ease-out shadow-sm group-hover:brightness-110 group-hover:shadow-lg group-hover:shadow-gem-primary/30 relative"
                        style={{ height: `${(val / maxVisible) * 90}%`, minHeight: val > 0 ? '6px' : '2px' }}
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-white/15 to-transparent rounded-t-lg"></div>
                      </div>
                    </div>
                    
                    {/* Month Label */}
                    <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400 mt-1.5 uppercase tracking-wider leading-none h-4 flex items-center">
                      {visibleLabels[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
