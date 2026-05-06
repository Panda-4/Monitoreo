import React, { useState, useEffect } from 'react';
import Sidebar, { ViewType } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DictamenList from './components/DictamenList';
import DictamenForm from './components/DictamenForm';
import Configuracion from './components/Configuracion';
import Auditoria from './components/Auditoria';
import Login from './components/Login';
import { SolicitudModel } from './types';
import { Moon, Sun, Bell } from 'lucide-react';
import { login as authLogin, logout as authLogout, getUser, isAuthenticated, authFetch, AuthUser, API_BASE, setOnSessionExpired } from './services/authService';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [editingData, setEditingData] = useState<SolicitudModel | null>(null);
  const [data, setData] = useState<SolicitudModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getUser());
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Estados para notificaciones
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.length;

  const fetchNotifications = async () => {
    if (!loggedIn) return;
    try {
      const res = await authFetch(`${API_BASE}/api/notificaciones`);
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (e) {
      console.error('Error fetching notifs:', e);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/notificaciones/leer-todas`, { method: 'PUT' });
      if (res.ok) {
        setNotifications([]);
        setShowNotifications(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Polling para notificaciones
  useEffect(() => {
    if (loggedIn && (currentUser?.rol === 'ADMINISTRADOR' || currentUser?.rol === 'AUTORIZADOR')) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // 30s
      return () => clearInterval(interval);
    }
  }, [loggedIn, currentUser?.rol]);

  // Registrar interceptor global para sesión expirada
  useEffect(() => {
    setOnSessionExpired(() => {
      setCurrentUser(null);
      setLoggedIn(false);
      setData([]);
      setCurrentView('dashboard');
    });
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch(`${API_BASE}/api/solicitudes`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    const user = await authLogin(username, password);
    setCurrentUser(user);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    setLoggedIn(false);
    setData([]);
    setCurrentView('dashboard');
  };

  const handleCreate = () => {
    setEditingData(null);
    setCurrentView('dictamenes-form');
  };

  const handleEdit = (solicitud: SolicitudModel) => {
    setEditingData(solicitud);
    setCurrentView('dictamenes-form');
  };

  const handleSave = async (solicitud: SolicitudModel) => {
    try {
      if (solicitud.folioInterno) {
        const res = await authFetch(`${API_BASE}/api/solicitudes/${solicitud.folioInterno}`, {
          method: 'PUT',
          body: JSON.stringify(solicitud)
        });
        if (res.ok) {
          const updated = await res.json();
          setData(data.map(d => d.folioInterno === updated.folioInterno ? updated : d));
        }
      } else {
        const res = await authFetch(`${API_BASE}/api/solicitudes`, {
          method: 'POST',
          body: JSON.stringify(solicitud)
        });
        if (res.ok) {
          const created = await res.json();
          setData([created, ...data]);
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
    setCurrentView('dictamenes-list');
  };

  const handleDelete = async (folioInterno: number) => {
    if (!confirm('¿Está seguro de que desea eliminar esta solicitud?')) return;
    try {
      const res = await authFetch(`${API_BASE}/api/solicitudes/${folioInterno}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setData(data.filter(d => d.folioInterno !== folioInterno));
      } else {
        if (res.status === 403) {
          alert('No tiene permisos para eliminar este registro. Solo los Administradores pueden realizar esta acción.');
        } else {
          alert('Error al intentar eliminar el registro.');
        }
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error de conexión al intentar eliminar.');
    }
  };

  // If not authenticated, show Login
  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const userRole = currentUser?.rol || '';

  return (
    <div className={`flex min-h-screen font-sans ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar
        currentView={currentView}
        onChangeView={setCurrentView}
        onLogout={handleLogout}
        userRole={userRole}
      />

      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Top Header */}
        <header className={`backdrop-blur-md border-b sticky top-0 z-40 h-16 flex items-center justify-end px-8 shadow-sm print:hidden ${isDarkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-gray-200'}`}>
           <div className="flex items-center gap-6 text-sm font-medium">
             <button 
               onClick={() => setIsDarkMode(!isDarkMode)} 
               className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
               title="Alternar Modo Oscuro"
             >
               {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

             {/* Notificaciones (Solo Administradores y Autorizadores) */}
             {(userRole === 'ADMINISTRADOR' || userRole === 'AUTORIZADOR') && (
               <div className="relative">
                 <button 
                   onClick={() => setShowNotifications(!showNotifications)}
                   className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-gem-primary/10 text-gem-primary' : 'text-gray-500 hover:bg-gray-100'}`}
                 >
                   <Bell className="w-5 h-5" />
                   {unreadCount > 0 && (
                     <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                   )}
                 </button>

                 {/* Dropdown Notificaciones */}
                 {showNotifications && (
                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                     <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                       <h3 className="font-bold text-gray-800">Notificaciones</h3>
                       {unreadCount > 0 && (
                         <button onClick={markAllAsRead} className="text-xs font-semibold text-gem-primary hover:text-gem-primary-dark">
                           Marcar leídas
                         </button>
                       )}
                     </div>
                     <div className="max-h-[300px] overflow-y-auto">
                       {notifications.length === 0 ? (
                         <div className="p-6 text-center text-gray-500 text-sm">
                           No tienes notificaciones pendientes
                         </div>
                       ) : (
                         <div className="divide-y divide-gray-50">
                           {notifications.map(notif => (
                             <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors flex gap-3">
                               <div className="w-2 h-2 mt-1.5 rounded-full bg-gem-primary flex-shrink-0"></div>
                               <div>
                                 <p className="text-sm text-gray-800 font-medium leading-snug">{notif.mensaje}</p>
                                 <p className="text-xs text-gray-400 mt-1">
                                   {new Date(notif.fecha).toLocaleString()}
                                 </p>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>
                 )}
               </div>
             )}

             <div className="text-right hidden sm:block">
               <div className={`font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{currentUser?.nombreCompleto || 'Usuario'}</div>
               <div className="text-xs text-gem-primary">{userRole}</div>
             </div>
             <div className="w-9 h-9 rounded-full bg-gem-primary/10 border border-gem-primary/20 text-gem-primary shadow-sm flex items-center justify-center font-bold">
               {(currentUser?.nombreCompleto || 'U').charAt(0).toUpperCase()}
             </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 print:p-0 print:m-0">
          {/* Loading Spinner Global */}
          {isLoading && currentView !== 'configuracion' && currentView !== 'auditoria' && (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gem-primary/20 border-t-gem-primary rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500">Cargando datos...</p>
              </div>
            </div>
          )}

          {(!isLoading || currentView === 'configuracion' || currentView === 'auditoria') && (
            <>
              {currentView === 'dashboard' && <Dashboard data={data} userName={currentUser?.nombreCompleto || 'Usuario'} />}
              
              {currentView === 'dictamenes-list' && (
                <DictamenList 
                  data={data} 
                  onCreate={handleCreate} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  userRole={userRole}
                />
              )}

              {currentView === 'dictamenes-form' && (
                <DictamenForm 
                  onCancel={() => setCurrentView('dictamenes-list')}
                  onSave={handleSave}
                  initialData={editingData}
                />
              )}

              {currentView === 'configuracion' && <Configuracion />}
              
              {currentView === 'auditoria' && <Auditoria />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
