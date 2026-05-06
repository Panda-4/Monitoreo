package com.gem.dictamenes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notificaciones")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mensaje;

    private LocalDateTime fecha;

    /** Rol al que va dirigida: ADMINISTRADOR, AUTORIZADOR */
    private String destinatarioRol;

    /** Folio de la solicitud relacionada (para navegación) */
    private Long solicitudId;

    /** Quién generó la acción */
    private String creadoPor;

    private Boolean leida = false;
}
