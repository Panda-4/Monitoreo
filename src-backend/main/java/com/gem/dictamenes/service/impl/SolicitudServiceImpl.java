package com.gem.dictamenes.service.impl;

import com.gem.dictamenes.model.Solicitud;
import com.gem.dictamenes.repository.SolicitudRepository;
import com.gem.dictamenes.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gem.dictamenes.model.AuditoriaLog;
import com.gem.dictamenes.repository.AuditoriaRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class SolicitudServiceImpl implements SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final AuditoriaRepository auditoriaRepository;
    private final com.gem.dictamenes.repository.NotificacionRepository notificacionRepository;

    @Autowired
    public SolicitudServiceImpl(SolicitudRepository solicitudRepository, AuditoriaRepository auditoriaRepository, com.gem.dictamenes.repository.NotificacionRepository notificacionRepository) {
        this.solicitudRepository = solicitudRepository;
        this.auditoriaRepository = auditoriaRepository;
        this.notificacionRepository = notificacionRepository;
    }

    @Override
    public List<Solicitud> findAll() {
        return solicitudRepository.findAll();
    }

    @Override
    public Solicitud findById(Long id) {
        return solicitudRepository.findById(id).orElse(null);
    }

    @Override
    public Solicitud save(Solicitud solicitud) {
        boolean isNew = solicitud.getFolioInterno() == null;
        Solicitud saved = solicitudRepository.save(solicitud);
        
        String accion = isNew ? "CREACIÓN" : "ACTUALIZACIÓN";
        registrarAuditoria(accion, "Folio Interno: " + saved.getFolioInterno());
        
        if (isNew) {
            generarNotificacionesNuevaSolicitud(saved);
        }
        
        return saved;
    }

    private void generarNotificacionesNuevaSolicitud(Solicitud solicitud) {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            String rol = auth.getAuthorities().stream()
                    .findFirst()
                    .map(a -> a.getAuthority().replace("ROLE_", ""))
                    .orElse("DESCONOCIDO");
            
            String creador = auth.getName();
            String msj = "Nueva solicitud #" + solicitud.getFolioInterno() + " (" + solicitud.getTipoSolicitud() + ") registrada por " + creador;
            
            com.gem.dictamenes.model.Notificacion notifAdmin = new com.gem.dictamenes.model.Notificacion();
            notifAdmin.setMensaje(msj);
            notifAdmin.setFecha(LocalDateTime.now());
            notifAdmin.setDestinatarioRol("ADMINISTRADOR");
            notifAdmin.setSolicitudId(solicitud.getFolioInterno());
            notifAdmin.setCreadoPor(creador);
            notifAdmin.setLeida(false);
            
            com.gem.dictamenes.model.Notificacion notifAuth = new com.gem.dictamenes.model.Notificacion();
            notifAuth.setMensaje(msj);
            notifAuth.setFecha(LocalDateTime.now());
            notifAuth.setDestinatarioRol("AUTORIZADOR");
            notifAuth.setSolicitudId(solicitud.getFolioInterno());
            notifAuth.setCreadoPor(creador);
            notifAuth.setLeida(false);
            
            notificacionRepository.saveAll(List.of(notifAdmin, notifAuth));
        } catch (Exception e) {
            System.err.println("Error generando notificaciones: " + e.getMessage());
        }
    }

    @Override
    public void delete(Long id) {
        solicitudRepository.deleteById(id);
        registrarAuditoria("ELIMINACIÓN", "Folio Interno: " + id);
    }
    
    private void registrarAuditoria(String accion, String detalles) {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            String usuario = auth.getName();
            // Extraer el rol del usuario autenticado
            String rol = auth.getAuthorities().stream()
                    .findFirst()
                    .map(a -> a.getAuthority().replace("ROLE_", ""))
                    .orElse("DESCONOCIDO");
            AuditoriaLog log = new AuditoriaLog();
            log.setUsuario(usuario);
            log.setRol(rol);
            log.setAccion(accion);
            log.setDetalle(detalles);
            log.setFecha(LocalDateTime.now());
            log.setEntidad("Solicitud");
            auditoriaRepository.save(log);
        } catch (Exception e) {
            System.err.println("Error guardando log de auditoría: " + e.getMessage());
        }
    }
}
