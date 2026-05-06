import React, { useState } from 'react';
import { Search, Plus, Filter, FileText, ChevronRight, Download, Eye, X } from 'lucide-react';
import { SolicitudModel } from '../types';

interface DictamenListProps {
  onCreate: () => void;
  onEdit: (solicitud: SolicitudModel) => void;
  onDelete: (folioInterno: number) => void;
  data: SolicitudModel[];
  userRole: string;
}

export default function DictamenList({ onCreate, onEdit, onDelete, data, userRole }: DictamenListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDetail, setSelectedDetail] = useState<SolicitudModel | null>(null);

  const filteredData = data.filter(d => 
    d.numeroOficioSolicitud.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.dependenciaOPD && d.dependenciaOPD.toLowerCase().includes(searchTerm.toLowerCase())) ||
    d.tipoSolicitud.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Recibido': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En Revisión Técnica': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Autorizado por OM': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Concluido': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
    <div className="w-full max-w-7xl mx-auto py-8 print:hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Sistema de Dictámenes</h2>
          <p className="text-gray-500 mt-2 font-medium">Consulta y seguimiento de solicitudes de dictamen.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button onClick={onCreate} className="flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gem-primary hover:bg-gem-primary-dark transition-all shadow-lg shadow-gem-primary/20">
             <Plus className="w-5 h-5" /> Nueva Solicitud
           </button>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col pt-4">
        
        {/* Filters */}
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por folio, oficio o dependencia..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gem-primary/20 focus:border-gem-primary transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all text-sm">
            <Filter className="w-4 h-4" /> Filtros Avanzados
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
             <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 border-y border-gray-200">
                <tr>
                   <th className="px-6 py-4 font-semibold w-24">Folio</th>
                   <th className="px-6 py-4 font-semibold">Oficio y Dependencia</th>
                   <th className="px-6 py-4 font-semibold">Tipo Solicitud</th>
                   <th className="px-6 py-4 font-semibold">Monto</th>
                   <th className="px-6 py-4 font-semibold text-center">Estatus</th>
                   <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 bg-white/50">
                {filteredData.map(item => (
                  <tr key={item.folioInterno} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                        #{item.folioInterno?.toString().padStart(4, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{item.numeroOficioSolicitud}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {item.dependenciaOPD}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {item.tipoSolicitud}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      ${item.montoSolicitud.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.estatusGeneral)}`}>
                         {item.estatusGeneral}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {userRole === 'ADMINISTRADOR' && (
                          <button 
                            onClick={() => item.folioInterno && onDelete(item.folioInterno)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex opacity-0 group-hover:opacity-100"
                            title="Eliminar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        )}
                        <button 
                           onClick={() => setSelectedDetail(item)}
                           className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors inline-flex opacity-0 group-hover:opacity-100"
                           title="Ver Detalle"
                        >
                           <Eye className="w-5 h-5" />
                        </button>
                        <button 
                           onClick={() => onEdit(item)}
                           className="p-2 text-gem-primary hover:bg-gem-primary/10 rounded-lg transition-colors inline-flex opacity-0 group-hover:opacity-100"
                           title="Editar"
                        >
                           <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredData.length === 0 && (
                   <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-base font-medium">No se encontraron solicitudes</p>
                        <p className="text-sm">Intenta con otros términos de búsqueda.</p>
                      </td>
                   </tr>
                )}
             </tbody>
          </table>
        </div>
        
      </div>
    </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm print:absolute print:inset-0 print:p-0 print:bg-white print:backdrop-blur-none">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:max-h-none print:overflow-visible">
            <div className="hidden print:block w-full pb-4 border-b-2 border-gem-primary mb-4">
              <img src="/membrete.png" alt="Gobierno del Estado de México" className="w-full h-auto object-contain max-h-24" />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 print:bg-white print:border-b-0 print:px-0 print:py-2">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Detalle de Solicitud #{selectedDetail.folioInterno?.toString().padStart(4, '0')}
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1">Oficio: {selectedDetail.numeroOficioSolicitud}</p>
              </div>
              <button 
                onClick={() => setSelectedDetail(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors print:hidden"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gem-primary uppercase tracking-wider border-b border-gray-100 pb-2">Información General</h4>
                  
                  <div><span className="text-sm text-gray-500 block mb-1">Estatus General</span><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedDetail.estatusGeneral)}`}>{selectedDetail.estatusGeneral}</span></div>
                  <div><span className="text-sm text-gray-500 block mb-1">Tipo de Solicitud</span><span className="text-gray-800 font-medium">{selectedDetail.tipoSolicitud || '-'}</span></div>
                  <div><span className="text-sm text-gray-500 block mb-1">Dependencia / OPD</span><span className="text-gray-800 font-medium">{selectedDetail.dependenciaOPD || '-'}</span></div>
                  <div><span className="text-sm text-gray-500 block mb-1">Unidad Administrativa</span><span className="text-gray-800 font-medium">{selectedDetail.unidadAdministrativa || '-'}</span></div>
                  <div><span className="text-sm text-gray-500 block mb-1">Monto de la Solicitud</span><span className="text-gray-800 font-medium">${selectedDetail.montoSolicitud?.toLocaleString('es-MX', {minimumFractionDigits: 2}) || '0.00'}</span></div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gem-primary uppercase tracking-wider border-b border-gray-100 pb-2">Datos Presupuestales</h4>
                  
                  <div><span className="text-sm text-gray-500 block mb-1">Centro de Costos</span><span className="text-gray-800 font-medium">{selectedDetail.centroCostos || '-'}</span></div>
                  <div><span className="text-sm text-gray-500 block mb-1">Capítulo</span><span className="text-gray-800 font-medium">{selectedDetail.capitulo || '-'}</span></div>
                  <div><span className="text-sm text-gray-500 block mb-1">Partida Presupuestal</span><span className="text-gray-800 font-medium">{selectedDetail.partidaPresupuestal || '-'}</span></div>
                  <div><span className="text-sm text-gray-500 block mb-1">Giro</span><span className="text-gray-800 font-medium">{selectedDetail.giro || '-'}</span></div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <h4 className="text-sm font-bold text-gem-primary uppercase tracking-wider border-b border-gray-100 pb-2">Fechas y Recepción</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 print:grid-cols-2 gap-4">
                    <div><span className="text-sm text-gray-500 block mb-1">Recepción DGRM-OM</span><span className="text-gray-800 font-medium">{selectedDetail.fechaRecepcionDGRMOM ? new Date(selectedDetail.fechaRecepcionDGRMOM).toLocaleDateString() : '-'}</span></div>
                    <div><span className="text-sm text-gray-500 block mb-1">Excepción DGRM-OM</span><span className="text-gray-800 font-medium">{selectedDetail.excepcionDGRMOM ? 'Sí' : 'No'}</span></div>
                    <div><span className="text-sm text-gray-500 block mb-1">Recepción Dictaminación</span><span className="text-gray-800 font-medium">{selectedDetail.fechaRecepcionDictaminacion ? new Date(selectedDetail.fechaRecepcionDictaminacion).toLocaleDateString() : '-'}</span></div>
                    <div><span className="text-sm text-gray-500 block mb-1">Excepción Dictaminación</span><span className="text-gray-800 font-medium">{selectedDetail.excepcionDictaminacion ? 'Sí' : 'No'}</span></div>
                  </div>
                </div>

                {selectedDetail.descripcionSolicitud && (
                  <div className="space-y-4 md:col-span-2 mt-2">
                    <h4 className="text-sm font-bold text-gem-primary uppercase tracking-wider border-b border-gray-100 pb-2">Descripción de la Solicitud</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl text-sm whitespace-pre-wrap">
                      {selectedDetail.descripcionSolicitud}
                    </p>
                  </div>
                )}

                <div className="space-y-4 md:col-span-2 mt-2">
                  <h4 className="text-sm font-bold text-gem-primary uppercase tracking-wider border-b border-gray-100 pb-2">Dictaminación Técnica y Autorizaciones</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 print:grid-cols-2 gap-4">
                    <div><span className="text-sm text-gray-500 block mb-1">Procedente</span><span className="text-gray-800 font-medium">{selectedDetail.procedente === true ? 'Sí' : selectedDetail.procedente === false ? 'No' : '-'}</span></div>
                    <div><span className="text-sm text-gray-500 block mb-1">Dictamen Previo</span><span className="text-gray-800 font-medium">{selectedDetail.cuentaDictamenPrevio || '-'}</span></div>
                    {selectedDetail.numeroOficioDictamenPrevio && <div><span className="text-sm text-gray-500 block mb-1">Oficio Dictamen Previo</span><span className="text-gray-800 font-medium">{selectedDetail.numeroOficioDictamenPrevio}</span></div>}
                    <div><span className="text-sm text-gray-500 block mb-1">Autorización OM</span><span className="text-gray-800 font-medium">{selectedDetail.cuentaAutorizacionOM === true ? 'Sí' : selectedDetail.cuentaAutorizacionOM === false ? 'No' : '-'}</span></div>
                    {selectedDetail.numeroOficioAutorizacion && <div><span className="text-sm text-gray-500 block mb-1">Oficio Autorización</span><span className="text-gray-800 font-medium">{selectedDetail.numeroOficioAutorizacion}</span></div>}
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2 mt-2">
                  <h4 className="text-sm font-bold text-gem-primary uppercase tracking-wider border-b border-gray-100 pb-2">Excepciones a Medidas de Austeridad</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4">
                    <div><span className="text-sm text-gray-500 block mb-1">Cuenta con Excepción</span><span className="text-gray-800 font-medium">{selectedDetail.cuentaExcepcionAusteridad || '-'}</span></div>
                    <div><span className="text-sm text-gray-500 block mb-1">Tipo de Excepción</span><span className="text-gray-800 font-medium">{selectedDetail.tipoExcepcion || '-'}</span></div>
                    {selectedDetail.montoSuficienciaPresupuestal != null && <div><span className="text-sm text-gray-500 block mb-1">Monto Suficiencia</span><span className="text-gray-800 font-medium">${selectedDetail.montoSuficienciaPresupuestal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></div>}
                  </div>
                  {selectedDetail.descripcionExcepcion && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500 block mb-1">Descripción de Excepción</span>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl text-sm whitespace-pre-wrap">{selectedDetail.descripcionExcepcion}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden print:block w-full px-8 pb-16 pt-4 text-center font-bold text-gem-primary border-t-2 border-gem-secondary/50 mt-12 text-sm break-inside-avoid">
              "2026. Año del Humanismo Mexicano en el Estado de México."
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 print:hidden">
              <button 
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-gem-primary hover:bg-gem-primary-dark transition-all shadow-sm flex items-center gap-2"
              >
                <Download className="w-5 h-5" /> Guardar como PDF
              </button>
              <button 
                onClick={() => setSelectedDetail(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
