package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.FraseDelDia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FraseDelDiaRepository extends JpaRepository<FraseDelDia, Long> {
    
    List<FraseDelDia> findByActivaTrueOrderByOrdenAsc();
    
    @Query("SELECT f FROM FraseDelDia f WHERE f.activa = true ORDER BY f.orden ASC")
    List<FraseDelDia> findAllActivas();
    
    @Query(value = "SELECT * FROM frases_del_dia WHERE activa = true ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<FraseDelDia> findRandomActiva();
    
    long countByActivaTrue();
}
