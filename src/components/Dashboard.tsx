import React from 'react';
import { FileText, CheckCircle, Clock, AlertTriangle, TrendingUp, BarChart3, Users } from 'lucide-react';
import { SolicitudModel } from '../types';

interface DashboardProps {
  data: SolicitudModel[];
  userName: string;
}

export default function Dashboard({ data, userName }: DashboardProps) {
  const total = data.length;
  const pendientes = data.filter(d => 
    d.estatusGeneral === 'Recibido' || d.estatusGeneral === 'En Revisión Técnica'
  ).length;
  const aprobados = data.filter(d => d.estatusGeneral === 'Autorizado por OM').length;
  const concluidos = data.filter(d => d.estatusGeneral === 'Concluido').length;
  
  const montoTotal = data.reduce((acc, curr) => acc + curr.montoSolicitud, 0);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gem-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Bienvenido de nuevo, <span className="text-gem-primary">{userName}</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium text-lg">
            Aquí tienes un resumen del estado actual de las solicitudes y dictámenes.
          </p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 text-right">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Fecha Actual</div>
          <div className="text-2xl font-bold text-gray-800">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Solicitudes', value: total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'En Trámite', value: pendientes, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Autorizadas (OM)', value: aprobados, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Concluidas', value: concluidos, icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white/80 backdrop-blur-xl border ${stat.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 font-mono">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-96 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-gem-primary/5 rounded-full blur-3xl pointer-events-none"></div>
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
               <BarChart3 className="w-5 h-5 text-gem-primary" />
               Volumen de Solicitudes (Mensual)
             </h3>
             <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
               <option>Últimos 6 meses</option>
               <option>Año actual</option>
             </select>
           </div>
           <div className="flex-1 flex items-end justify-between gap-4 pt-10">
              {[40, 70, 45, 90, 65, 85].map((height, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group relative">
                   <div 
                     className="w-full bg-gem-primary/20 rounded-t-lg relative transition-all duration-500 group-hover:bg-gem-primary/40" 
                     style={{ height: `${height}%` }}
                   >
                     <div className="absolute bottom-0 w-full bg-gem-primary rounded-t-lg transition-all duration-500" style={{ height: `${height * 0.6}%` }}></div>
                   </div>
                   <span className="text-xs font-semibold text-gray-500">{['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][i]}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-gem-primary to-gem-primary-dark text-white rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gem-secondary/20 rounded-full blur-3xl"></div>
          
          <h3 className="text-lg font-bold flex items-center gap-2 mb-8 relative z-10">
            <Users className="w-5 h-5 text-gem-secondary" />
            Impacto Financiero
          </h3>
          
          <div className="flex-1 flex flex-col justify-center relative z-10">
             <p className="text-gem-secondary font-medium tracking-wide text-sm mb-2 uppercase">Monto Total Solicitado</p>
             <h4 className="text-4xl font-bold font-mono tracking-tighter mb-6">
               ${(montoTotal / 1000000).toFixed(2)}M
             </h4>
             
             <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-white/80">Capítulo 3000</span>
                     <span className="font-semibold">65%</span>
                   </div>
                   <div className="w-full bg-white/10 rounded-full h-2">
                     <div className="bg-gem-secondary rounded-full h-2" style={{width: '65%'}}></div>
                   </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-white/80">Capítulo 5000</span>
                     <span className="font-semibold">35%</span>
                   </div>
                   <div className="w-full bg-white/10 rounded-full h-2">
                     <div className="bg-white/50 rounded-full h-2" style={{width: '35%'}}></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
