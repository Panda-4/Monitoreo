package com.gem.dictamenes.service.impl;

import com.gem.dictamenes.model.Solicitud;
import com.gem.dictamenes.model.AuditoriaLog;
import com.gem.dictamenes.model.Notificacion;
import com.gem.dictamenes.repository.SolicitudRepository;
import com.gem.dictamenes.repository.AuditoriaRepository;
import com.gem.dictamenes.repository.NotificacionRepository;
import com.gem.dictamenes.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitudServiceImpl implements SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final AuditoriaRepository auditoriaRepository;
    private final NotificacionRepository notificacionRepository;

    @Autowired
    public SolicitudServiceImpl(SolicitudRepository solicitudRepository, 
                                AuditoriaRepository auditoriaRepository, 
                                NotificacionRepository notificacionRepository) {
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
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String creador = auth != null ? auth.getName() : "SISTEMA";
            String msj = "Nueva solicitud #" + solicitud.getFolioInterno() + " (" + solicitud.getTipoSolicitud() + ") registrada por " + creador;
            
            Notificacion notifAdmin = new Notificacion();
            notifAdmin.setMensaje(msj);
            notifAdmin.setFecha(LocalDateTime.now());
            notifAdmin.setDestinatarioRol("ADMINISTRADOR");
            notifAdmin.setSolicitudId(solicitud.getFolioInterno());
            notifAdmin.setCreadoPor(creador);
            notifAdmin.setLeida(false);
            
            Notificacion notifAuth = new Notificacion();
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
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) return;

            String usuario = auth.getName();
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
