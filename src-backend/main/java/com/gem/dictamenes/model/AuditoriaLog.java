package com.gem.dictamenes.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "auditoria_logs")
public class AuditoriaLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fecha;
    private String rol;
    private String usuario;
    private String accion;
    private String entidad;
    private String detalle;
}
