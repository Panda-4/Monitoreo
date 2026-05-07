package com.gem.dictamenes.controller;

import com.gem.dictamenes.model.Solicitud;
import com.gem.dictamenes.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private final SolicitudService solicitudService;

    @Autowired
    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @GetMapping
    public List<Solicitud> getAll() {
        return solicitudService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> getById(@PathVariable Long id) {
        Solicitud solicitud = solicitudService.findById(id);
        return solicitud != null ? ResponseEntity.ok(solicitud) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Solicitud create(@Valid @RequestBody Solicitud solicitud) {
        return solicitudService.save(solicitud);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Solicitud> update(@PathVariable Long id, @Valid @RequestBody Solicitud solicitud) {
        solicitud.setFolioInterno(id);
        Solicitud updated = solicitudService.save(solicitud);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        solicitudService.delete(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Solicitud eliminada"));
    }
}
