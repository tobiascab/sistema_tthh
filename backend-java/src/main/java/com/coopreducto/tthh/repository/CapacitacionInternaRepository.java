package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.CapacitacionInterna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CapacitacionInternaRepository extends JpaRepository<CapacitacionInterna, Long> {
    List<CapacitacionInterna> findByEstado(String estado);
}
