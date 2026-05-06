package com.gem.dictamenes.repository;

import com.gem.dictamenes.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    long countByEstatusGeneral(String estatusGeneral);
}
