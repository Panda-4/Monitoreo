package com.gem.dictamenes.controller;

import com.gem.dictamenes.model.Notificacion;
import com.gem.dictamenes.model.Usuario;
import com.gem.dictamenes.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionRepository notificacionRepository;

    /**
     * Obtiene las notificaciones no leídas para el rol del usuario actual.
     */
    @GetMapping
    public List<Notificacion> getMyNotifications(@AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) return List.of();
        String rol = usuario.getRol().name();
        return notificacionRepository.findByDestinatarioRolAndLeidaFalseOrderByFechaDesc(rol);
    }

    /**
     * Cuenta las notificaciones no leídas para el rol del usuario actual.
     */
    @GetMapping("/count")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) return Map.of("count", 0L);
        String rol = usuario.getRol().name();
        long count = notificacionRepository.countByDestinatarioRolAndLeidaFalse(rol);
        return Map.of("count", count);
    }

    /**
     * Marca una notificación como leída.
     */
    @PutMapping("/{id}/leer")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return notificacionRepository.findById(id)
                .map(notif -> {
                    notif.setLeida(true);
                    notificacionRepository.save(notif);
                    return ResponseEntity.ok(Map.of("message", "Notificación marcada como leída"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Marca todas las notificaciones del rol del usuario como leídas.
     */
    @PutMapping("/leer-todas")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) return ResponseEntity.badRequest().build();
        String rol = usuario.getRol().name();
        List<Notificacion> unread = notificacionRepository.findByDestinatarioRolAndLeidaFalseOrderByFechaDesc(rol);
        unread.forEach(n -> n.setLeida(true));
        notificacionRepository.saveAll(unread);
        return ResponseEntity.ok(Map.of("message", "Todas las notificaciones marcadas como leídas", "count", unread.size()));
    }
}
