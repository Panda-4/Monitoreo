import React from 'react';
import { Download, ChevronLeft, Edit } from 'lucide-react';
import { SolicitudModel } from '../types';

interface DictamenDetalleProps {
  solicitud: SolicitudModel;
  onBack: () => void;
  onEdit: (solicitud: SolicitudModel) => void;
  userRole: string;
}

export default function DictamenDetalle({ solicitud, onBack, onEdit, userRole }: DictamenDetalleProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En Opinión Técnica de Subdirección de Fianzas y Seguros': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800';
      case 'En proceso de elaboración': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800';
      case 'En Firma de Dirección General': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800';
      case 'En autorización de la OM': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Concluido Entregado a dependencia solicitante': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 print:py-0 print:max-w-full">
      {/* Header / Actions (Hidden on Print) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" /> Volver a la lista
        </button>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => window.print()} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Exportar PDF
          </button>
          <button 
            onClick={() => onEdit(solicitud)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-gem-primary hover:bg-gem-primary-dark transition-all shadow-md shadow-gem-primary/20"
          >
            <Edit className="w-4 h-4" /> Editar Solicitud
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col print:shadow-none print:border-none print:rounded-none">
        
        {/* Print Header */}
        <div className="hidden print:block w-full pb-4 border-b-2 border-gem-primary mb-6">
          <img src="/membrete.png" alt="Gobierno del Estado de México" className="w-full h-auto object-contain max-h-24" />
        </div>

        {/* Card Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:bg-transparent print:px-0 print:py-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
              Detalle de Solicitud #{solicitud.folioInterno?.toString().padStart(4, '0')}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium text-sm">
              Oficio: <span className="text-gray-700 dark:text-slate-300">{solicitud.numeroOficioSolicitud}</span>
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getStatusColor(solicitud.estatusGeneral)}`}>
            {solicitud.estatusGeneral}
          </span>
        </div>
        
        {/* Card Body */}
        <div className="p-8 space-y-10 print:px-0">
          
          {/* Section 1: Información General & Presupuestal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-6">
              <h3 className="text-sm font-extrabold text-gem-primary uppercase tracking-widest border-b-2 border-gray-100 dark:border-slate-700 pb-2">Información General</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Tipo de Solicitud</span>
                  <p className="text-gray-800 dark:text-slate-200 font-medium text-base">{solicitud.tipoSolicitud || '-'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Dependencia / OPD</span>
                  <p className="text-gray-800 dark:text-slate-200 font-medium text-base">{solicitud.dependenciaOPD || '-'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Unidad Administrativa</span>
                  <p className="text-gray-800 dark:text-slate-200 font-medium text-base">{solicitud.unidadAdministrativa || '-'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Monto de la Solicitud</span>
                  <p className="text-gray-900 dark:text-slate-100 font-bold text-lg font-mono">${solicitud.montoSolicitud?.toLocaleString('es-MX', {minimumFractionDigits: 2}) || '0.00'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-extrabold text-gem-primary uppercase tracking-widest border-b-2 border-gray-100 dark:border-slate-700 pb-2">Datos Presupuestales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Capítulo</span>
                  <p className="text-gray-800 dark:text-slate-200 font-medium text-base leading-relaxed">{solicitud.capitulo || '-'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Centro de Costos</span>
                  <p className="text-gray-800 dark:text-slate-200 font-medium text-base">{solicitud.centroCostos || '-'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Partida Presupuestal</span>
                  <p className="text-gray-800 dark:text-slate-200 font-medium text-base">{solicitud.partidaPresupuestal || '-'}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Giro</span>
                  <p className="text-gray-800 dark:text-slate-200 font-medium text-base">{solicitud.giro || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Fechas y Recepción */}
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-gem-primary uppercase tracking-widest border-b-2 border-gray-100 dark:border-slate-700 pb-2">Fechas y Recepción</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50/50 dark:bg-slate-900/30 p-5 rounded-xl border border-gray-100 dark:border-slate-700">
              <div>
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Recepción DGRM-OM</span>
                <p className="text-gray-800 dark:text-slate-200 font-medium">{solicitud.fechaRecepcionDGRMOM ? new Date(solicitud.fechaRecepcionDGRMOM).toLocaleDateString() : '-'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Excepción DGRM-OM</span>
                <p className="text-gray-800 dark:text-slate-200 font-medium">{solicitud.excepcionDGRMOM ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Recepción Dictaminación</span>
                <p className="text-gray-800 dark:text-slate-200 font-medium">{solicitud.fechaRecepcionDictaminacion ? new Date(solicitud.fechaRecepcionDictaminacion).toLocaleDateString() : '-'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Excepción Dictaminación</span>
                <p className="text-gray-800 dark:text-slate-200 font-medium">{solicitud.excepcionDictaminacion ? 'Sí' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Flujo de Autorización */}
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-gem-primary uppercase tracking-widest border-b-2 border-gray-100 dark:border-slate-700 pb-2">Dictaminación y Autorizaciones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Procedente</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold ${solicitud.procedente === true ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : solicitud.procedente === false ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                  {solicitud.procedente === true ? 'Sí' : solicitud.procedente === false ? 'No' : 'Pendiente'}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Dictamen Previo</span>
                <span className="text-gray-800 dark:text-slate-200 font-medium block">
                  {solicitud.cuentaDictamenPrevio || 'N/D'}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Autorización OM</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold ${solicitud.cuentaAutorizacionOM === true ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : solicitud.cuentaAutorizacionOM === false ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                  {solicitud.cuentaAutorizacionOM === true ? 'Sí' : solicitud.cuentaAutorizacionOM === false ? 'No' : 'Pendiente'}
                </span>
              </div>
            </div>
            
            {/* Descripción */}
            {solicitud.descripcionSolicitud && (
              <div className="mt-4">
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Descripción de la Solicitud</span>
                <p className="text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-sm leading-relaxed border border-gray-100 dark:border-slate-700">
                  {solicitud.descripcionSolicitud}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block w-full px-8 pb-16 pt-8 text-center font-bold text-gem-primary border-t-2 border-gem-secondary/50 mt-12 text-sm break-inside-avoid">
          "2026. Año del Humanismo Mexicano en el Estado de México."
        </div>
      </div>
    </div>
  );
}
