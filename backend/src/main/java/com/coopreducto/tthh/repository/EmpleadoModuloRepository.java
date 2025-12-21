package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.EmpleadoModulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoModuloRepository extends JpaRepository<EmpleadoModulo, Long> {

    @Query("SELECT em FROM EmpleadoModulo em JOIN FETCH em.modulo WHERE em.empleado.id = :empleadoId AND em.habilitado = true")
    List<EmpleadoModulo> findByEmpleadoIdAndHabilitadoTrue(@Param("empleadoId") Long empleadoId);

    Optional<EmpleadoModulo> findByEmpleadoIdAndModuloId(Long empleadoId, Long moduloId);

    @Modifying
    @Query("DELETE FROM EmpleadoModulo em WHERE em.empleado.id = :empleadoId AND em.modulo.id = :moduloId")
    void deleteByEmpleadoIdAndModuloId(@Param("empleadoId") Long empleadoId, @Param("moduloId") Long moduloId);

    @Modifying
    @Query("DELETE FROM EmpleadoModulo em WHERE em.empleado.id = :empleadoId")
    void deleteAllByEmpleadoId(@Param("empleadoId") Long empleadoId);

    boolean existsByEmpleadoIdAndModuloCodigoAndHabilitadoTrue(Long empleadoId, String moduloCodigo);
}
