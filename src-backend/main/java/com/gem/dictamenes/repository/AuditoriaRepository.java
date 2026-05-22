package com.gem.dictamenes.repository;

import com.gem.dictamenes.model.AuditoriaLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AuditoriaRepository extends JpaRepository<AuditoriaLog, Long> {

    @Query("SELECT a FROM AuditoriaLog a WHERE " +
           "(:accion IS NULL OR :accion = '' OR a.accion = :accion) AND " +
           "(:usuario IS NULL OR :usuario = '' OR LOWER(a.usuario) LIKE LOWER(CONCAT('%', :usuario, '%'))) AND " +
           "(coalesce(:fechaDesde, a.fecha) <= a.fecha) AND " +
           "(coalesce(:fechaHasta, a.fecha) >= a.fecha)")
    Page<AuditoriaLog> findByFilters(
            @Param("accion") String accion,
            @Param("usuario") String usuario,
            @Param("fechaDesde") LocalDateTime fechaDesde,
            @Param("fechaHasta") LocalDateTime fechaHasta,
            Pageable pageable
    );

    long countByAccion(String accion);
}
