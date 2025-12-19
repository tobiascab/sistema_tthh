package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.CumpleanosManual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CumpleanosManualRepository extends JpaRepository<CumpleanosManual, Long> {

    @Query(value = "SELECT * FROM cumpleanos_manuales c " +
            "WHERE MONTH(c.fecha_nacimiento) = :mes " +
            "ORDER BY DAY(c.fecha_nacimiento) ASC", nativeQuery = true)
    List<CumpleanosManual> findByMes(@Param("mes") int mes);
}
