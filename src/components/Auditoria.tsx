import React, { useState, useEffect } from 'react';
import { History, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { authFetch, API_BASE } from '../services/authService';

interface AuditoriaLog {
  id: number;
  fecha: string;
  rol: string;
  usuario: string;
  accion: string;
  entidad: string;
  detalle: string;
}

export default function Auditoria() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<AuditoriaLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/auditoria`);
      if (res.ok) {
        const data = await res.json();
        // Format dates simply for display
        const formattedData = data.map((log: any) => ({
          ...log,
          fecha: log.fecha ? log.fecha.replace('T', ' ').substring(0, 19) : ''
        }));
        // Sort descending by ID so newest is first
        formattedData.sort((a: AuditoriaLog, b: AuditoriaLog) => b.id - a.id);
        setLogs(formattedData);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    (log.usuario && log.usuario.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.detalle && log.detalle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.entidad && log.entidad.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-gem-primary" />
            Auditoría de Actividad
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Registro histórico de cambios y trazabilidad del sistema.</p>
        </div>
      </div>



      {/* Registro de Auditoría (Tabla) */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col pt-4">
        <div className="px-6 pb-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Registro Detallado</h3>
          <div className="flex gap-3 text-sm">
            <input 
              type="text" 
              placeholder="Buscar acción o usuario..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gem-primary/20 focus:border-gem-primary transition-all w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
             <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 border-y border-gray-200">
                <tr>
                   <th className="px-6 py-4 font-semibold w-52">Fecha / Hora</th>
                   <th className="px-6 py-4 font-semibold">Usuario y Rol</th>
                   <th className="px-6 py-4 font-semibold text-center">Acción</th>
                   <th className="px-6 py-4 font-semibold">Módulo / Entidad</th>
                   <th className="px-6 py-4 font-semibold">Detalle del Cambio</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 bg-white/50">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {log.fecha}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{log.usuario}</div>
                      <div className="text-xs text-gem-primary font-medium mt-0.5">{log.rol}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        log.accion?.toUpperCase().includes('CREACIÓN') || log.accion?.toUpperCase().includes('CREACION') ? 'bg-green-50 text-green-700 border-green-200' : 
                        log.accion?.toUpperCase().includes('ELIMINACIÓN') || log.accion?.toUpperCase().includes('ELIMINACION') ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                         <ArrowRightLeft className="w-3 h-3" />
                         {log.accion}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {log.entidad}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 max-w-md truncate" title={log.detalle}>
                         {log.detalle}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                   <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                          <ShieldAlert className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-base font-medium">No hay registros</p>
                      </td>
                   </tr>
                )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
