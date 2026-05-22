import React, { useState, useEffect } from 'react';
import { History, ArrowRightLeft, ShieldAlert, ChevronDown, ChevronUp, ArrowRight, Search, Download, Calendar, RotateCcw, ChevronLeft, ChevronRight, Layers, PlusCircle, RefreshCw, Trash2 } from 'lucide-react';
import { authFetch, API_BASE } from '../services/authService';

interface CambioDetalle {
  campo: string;
  antes: string;
  despues: string;
}

interface AuditoriaLog {
  id: number;
  fecha: string;
  rol: string;
  usuario: string;
  accion: string;
  entidad: string;
  detalle: string;
  cambiosDetalle: string | null;
}

export default function Auditoria() {
  const [logs, setLogs] = useState<AuditoriaLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter states
  const [usuarioInput, setUsuarioInput] = useState('');
  const [usuarioFilter, setUsuarioFilter] = useState('');
  const [accionFilter, setAccionFilter] = useState('');
  const [fechaDesdeFilter, setFechaDesdeFilter] = useState('');
  const [fechaHastaFilter, setFechaHastaFilter] = useState('');

  // Stats/KPIs state
  const [stats, setStats] = useState({
    total: 0,
    creaciones: 0,
    actualizaciones: 0,
    eliminaciones: 0,
  });

  // Debounce username input
  useEffect(() => {
    const handler = setTimeout(() => {
      setUsuarioFilter(usuarioInput);
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(handler);
  }, [usuarioInput]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, pageSize, usuarioFilter, accionFilter, fechaDesdeFilter, fechaHastaFilter]);

  const fetchStats = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/auditoria/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', String(currentPage));
      params.append('size', String(pageSize));
      if (usuarioFilter) params.append('usuario', usuarioFilter);
      if (accionFilter) params.append('accion', accionFilter);
      if (fechaDesdeFilter) params.append('fechaDesde', fechaDesdeFilter + 'T00:00:00');
      if (fechaHastaFilter) params.append('fechaHasta', fechaHastaFilter + 'T23:59:59');

      const res = await authFetch(`${API_BASE}/api/auditoria?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const formattedData = data.content.map((log: any) => ({
          ...log,
          fecha: log.fecha ? log.fecha.replace('T', ' ').substring(0, 19) : ''
        }));
        setLogs(formattedData);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (accionFilter) params.append('accion', accionFilter);
      if (usuarioFilter) params.append('usuario', usuarioFilter);
      if (fechaDesdeFilter) params.append('fechaDesde', fechaDesdeFilter + 'T00:00:00');
      if (fechaHastaFilter) params.append('fechaHasta', fechaHastaFilter + 'T23:59:59');

      const res = await authFetch(`${API_BASE}/api/auditoria/export?${params.toString()}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `auditoria_logs_${new Date().toISOString().substring(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error al exportar CSV');
      }
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const handleClearFilters = () => {
    setUsuarioInput('');
    setUsuarioFilter('');
    setAccionFilter('');
    setFechaDesdeFilter('');
    setFechaHastaFilter('');
    setCurrentPage(0);
  };

  const toggleExpand = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const parseCambios = (json: string | null): CambioDetalle[] => {
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 tracking-tight">Auditoría del Sistema</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Registro de todas las operaciones realizadas en la plataforma.</p>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total de Operaciones', value: stats.total, icon: Layers, accent: 'from-blue-500 to-indigo-600', iconBg: 'bg-blue-50 dark:bg-blue-900/40', iconColor: 'text-blue-600 dark:text-blue-400' },
          { label: 'Creaciones', value: stats.creaciones, icon: PlusCircle, accent: 'from-emerald-500 to-teal-600', iconBg: 'bg-emerald-50 dark:bg-emerald-900/40', iconColor: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Actualizaciones', value: stats.actualizaciones, icon: RefreshCw, accent: 'from-amber-500 to-orange-600', iconBg: 'bg-amber-50 dark:bg-amber-900/40', iconColor: 'text-amber-600 dark:text-amber-400' },
          { label: 'Eliminaciones', value: stats.eliminaciones, icon: Trash2, accent: 'from-rose-500 to-red-600', iconBg: 'bg-rose-50 dark:bg-rose-900/40', iconColor: 'text-rose-600 dark:text-rose-400' }
        ].map((card, i) => (
          <div key={i} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.accent}`}></div>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-3xl font-extrabold text-gray-800 dark:text-slate-100">{card.value.toLocaleString()}</h4>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Registro de Auditoría (Tabla y Filtros) */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col pt-4">
        
        {/* Filtros avanzados */}
        <div className="px-6 pb-6 border-b border-gray-100 dark:border-slate-700">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg">Registro Detallado</h3>
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gem-primary hover:bg-gem-primary-dark transition-all rounded-xl shadow-lg shadow-gem-primary/10"
              >
                <Download className="w-4 h-4" /> Exportar CSV
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Buscador de usuario */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Buscar usuario..."
                  value={usuarioInput}
                  onChange={e => setUsuarioInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-gem-primary/20 focus:border-gem-primary transition-all text-sm text-gray-800 dark:text-slate-200"
                />
              </div>

              {/* Filtro por acción */}
              <div>
                <select 
                  value={accionFilter} 
                  onChange={e => { setAccionFilter(e.target.value); setCurrentPage(0); }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-gem-primary/20 focus:border-gem-primary transition-all text-sm text-gray-800 dark:text-slate-200"
                >
                  <option value="">Todas las acciones</option>
                  <option value="CREACIÓN">CREACIÓN</option>
                  <option value="ACTUALIZACIÓN">ACTUALIZACIÓN</option>
                  <option value="ELIMINACIÓN">ELIMINACIÓN</option>
                </select>
              </div>

              {/* Fecha Desde */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
                <input 
                  type="date" 
                  value={fechaDesdeFilter}
                  onChange={e => { setFechaDesdeFilter(e.target.value); setCurrentPage(0); }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-gem-primary/20 focus:border-gem-primary transition-all text-sm text-gray-800 dark:text-slate-200"
                  title="Fecha desde"
                />
              </div>

              {/* Fecha Hasta */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
                <input 
                  type="date" 
                  value={fechaHastaFilter}
                  onChange={e => { setFechaHastaFilter(e.target.value); setCurrentPage(0); }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-gem-primary/20 focus:border-gem-primary transition-all text-sm text-gray-800 dark:text-slate-200"
                  title="Fecha hasta"
                />
              </div>
            </div>

            {(usuarioFilter || accionFilter || fechaDesdeFilter || fechaHastaFilter) && (
              <div className="flex justify-end">
                <button 
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 text-xs font-bold text-gem-primary hover:text-gem-primary-dark transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-9 h-9 border-4 border-gem-primary/20 border-t-gem-primary rounded-full animate-spin"></div>
                <p className="text-xs font-semibold text-gray-400">Cargando bitácora...</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600 dark:text-slate-300">
               <thead className="bg-gray-50/80 dark:bg-slate-900/50 text-xs uppercase text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                     <th className="px-6 py-4 font-semibold w-10"></th>
                     <th className="px-6 py-4 font-semibold w-52">Fecha / Hora</th>
                     <th className="px-6 py-4 font-semibold">Usuario y Rol</th>
                     <th className="px-6 py-4 font-semibold text-center">Acción</th>
                     <th className="px-6 py-4 font-semibold">Módulo / Entidad</th>
                     <th className="px-6 py-4 font-semibold">Detalle del Cambio</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {logs.map(log => {
                    const cambios = parseCambios(log.cambiosDetalle);
                    const hasCambios = cambios.length > 0;
                    const isExpanded = expandedRows.has(log.id);

                    return (
                      <React.Fragment key={log.id}>
                        <tr className={`hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors ${hasCambios ? 'cursor-pointer' : ''}`}
                            onClick={() => hasCambios && toggleExpand(log.id)}>
                          <td className="px-4 py-4 text-center">
                            {hasCambios && (
                              <button 
                                className="p-1 rounded-lg text-gray-400 hover:text-gem-primary hover:bg-gem-primary/10 transition-all"
                                title="Ver cambios detallados"
                              >
                                {isExpanded 
                                  ? <ChevronUp className="w-4 h-4" /> 
                                  : <ChevronDown className="w-4 h-4" />
                                }
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-slate-400">
                            {log.fecha}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-800 dark:text-slate-200">{log.usuario}</div>
                            <div className="text-xs text-gem-primary font-medium mt-0.5">{log.rol}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              log.accion?.toUpperCase().includes('CREACIÓN') || log.accion?.toUpperCase().includes('CREACION') ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700' : 
                              log.accion?.toUpperCase().includes('ELIMINACIÓN') || log.accion?.toUpperCase().includes('ELIMINACION') ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700' :
                              'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700'
                            }`}>
                               <ArrowRightLeft className="w-3 h-3" />
                               {log.accion}
                            </span>
                            {hasCambios && (
                              <div className="mt-1">
                                <span className="text-[10px] font-medium text-gem-primary bg-gem-primary/10 px-2 py-0.5 rounded-full">
                                  {cambios.length} campo{cambios.length !== 1 ? 's' : ''} modificado{cambios.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-700 dark:text-slate-300">
                            {log.entidad}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-600 dark:text-slate-400 max-w-md truncate" title={log.detalle}>
                               {log.detalle}
                            </div>
                          </td>
                        </tr>

                        {/* Detalle expandido */}
                        {hasCambios && isExpanded && (
                          <tr>
                            <td colSpan={6} className="px-0 py-0">
                              <div className="mx-6 my-3 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/60 dark:to-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 flex items-center gap-2">
                                  <ArrowRightLeft className="w-4 h-4 text-gem-primary" />
                                  <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                                    Detalle de cambios — {cambios.length} campo{cambios.length !== 1 ? 's' : ''} modificado{cambios.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-gray-100 dark:border-slate-700">
                                      <th className="px-5 py-2.5 text-left text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-1/3">Campo</th>
                                      <th className="px-5 py-2.5 text-left text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider w-1/3">Valor Anterior</th>
                                      <th className="px-3 py-2.5 w-6"></th>
                                      <th className="px-5 py-2.5 text-left text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider w-1/3">Valor Nuevo</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                                    {cambios.map((c, idx) => (
                                      <tr key={idx} className="hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
                                        <td className="px-5 py-2.5 font-semibold text-gray-700 dark:text-slate-300 text-xs">
                                          {c.campo}
                                        </td>
                                        <td className="px-5 py-2.5">
                                          <span className="inline-block bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-medium px-2.5 py-1 rounded-lg border border-red-100 dark:border-red-800/40 max-w-[200px] truncate" title={c.antes}>
                                            {c.antes}
                                          </span>
                                        </td>
                                        <td className="px-1 py-2.5 text-center">
                                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 mx-auto" />
                                        </td>
                                        <td className="px-5 py-2.5">
                                          <span className="inline-block bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/40 max-w-[200px] truncate" title={c.despues}>
                                            {c.despues}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {logs.length === 0 && (
                     <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 mb-4">
                            <ShieldAlert className="w-6 h-6 text-gray-400 dark:text-slate-500" />
                          </div>
                          <p className="text-base font-medium">No hay registros</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
          )}
        </div>

        {/* Paginación */}
        {!loading && totalPages > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-slate-900/20">
            <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-3">
              <span>
                Mostrando {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} de {totalElements} registros
              </span>
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-[10px] text-gray-400">Por página:</span>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="px-2 py-0.5 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-bold text-gray-700 dark:text-slate-300 focus:ring-1 focus:ring-gem-primary outline-hidden"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                title="Primera página"
              >
                <ChevronLeft className="w-4 h-4 -mr-1.5 inline-block" />
                <ChevronLeft className="w-4 h-4 inline-block" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                title="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 px-2">
                Página {currentPage + 1} de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                title="Siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                title="Última página"
              >
                <ChevronRight className="w-4 h-4 inline-block" />
                <ChevronRight className="w-4 h-4 -ml-1.5 inline-block" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
