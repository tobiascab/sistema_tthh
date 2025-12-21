package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Long> {

    Optional<Modulo> findByCodigo(String codigo);

    List<Modulo> findByActivoTrueOrderByOrdenAsc();

    List<Modulo> findByEsDefaultTrue();

    List<Modulo> findByModuloPadreIsNullAndActivoTrueOrderByOrdenAsc();

    boolean existsByCodigo(String codigo);
}
