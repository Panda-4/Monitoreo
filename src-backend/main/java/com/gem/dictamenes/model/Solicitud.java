package com.gem.dictamenes.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "solicitudes")
public class Solicitud {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long folioInterno;
    
    private String numeroOficioSolicitud;
    private LocalDate fechaRecepcionDGRMOM;
    private Boolean excepcionDGRMOM;
    
    private LocalDate fechaRecepcionDictaminacion;
    private Boolean excepcionDictaminacion;
    
    private String dependenciaOPD;
    private String unidadAdministrativa;
    private String centroCostos;
    private String capitulo;
    private String partidaPresupuestal;
    private String giro;
    
    private BigDecimal montoSolicitud;
    private String tipoSolicitud;
    private String estatusGeneral;

    // Campos Sub-formulario A y B y C agrupados, en una BD real podrían normalizarse
    private String descripcionSolicitud;
    private Boolean procedente;
    
    private LocalDate fechaEnvioAutorizacionOM;
    private LocalDate fechaEmisionAutorizacion;
    private LocalDate fechaEnvioFirmaDG;
    private LocalDate fechaEnvioDependencia;
    
    private LocalDate fechaEnvioRespuestaFirmaDG;
    private LocalDate fechaEnvioRespuestaDependencia;
    
    private String cuentaDictamenPrevio; // Si/No/NA
    private LocalDate fechaEmisionDictamenPrevio;
    private String numeroOficioDictamenPrevio;
    
    private String cuentaExcepcionAusteridad; // Si/No/NA
    private LocalDate fechaEmisionExcepcion;
    
    private BigDecimal montoEstudioMercado;
    private Boolean cuentaAutorizacionOM;
    private String numeroOficioAutorizacion;
    private LocalDate fechaEnvioRespuestaOM_DGRM;
    private LocalDate fechaRecepcionDGRM;
    private LocalDate fechaRespuestaDGRM_Dependencia;
    
    private String numeroOficioRespuesta;
    
    // Sub-formulario C
    private String tipoExcepcion;
    private String descripcionExcepcion;
    private BigDecimal montoSuficienciaPresupuestal;
    private LocalDate fechaRespuestaExcepcion;
}
