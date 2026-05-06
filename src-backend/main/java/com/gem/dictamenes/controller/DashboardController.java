package com.gem.dictamenes.controller;

import com.gem.dictamenes.repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final SolicitudRepository repository;

    @Autowired
    public DashboardController(SolicitudRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long total = repository.count();
        long pendientes = repository.countByEstatusGeneral("En Revisión Técnica") + repository.countByEstatusGeneral("Recibido");
        long aprobados = repository.countByEstatusGeneral("Autorizado por OM");
        long concluidos = repository.countByEstatusGeneral("Concluido");

        stats.put("totalSolicitudes", total);
        stats.put("enTramite", pendientes);
        stats.put("autorizadasOM", aprobados);
        stats.put("concluidas", concluidos);
        
        // Sum montoTotal is normally done in repository via @Query("SELECT SUM(s.montoSolicitud)...") 
        // For simplicity returning a mock sum or zero if empty.
        stats.put("montoTotalAutorizado", 0); // To be implemented later properly.

        return stats;
    }
}
