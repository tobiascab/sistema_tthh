package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByTokenRecuperacion(String token);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<Usuario> findByEstado(String estado);

    List<Usuario> findByRolId(Long rolId);

    @Query("SELECT u FROM Usuario u WHERE u.empleado.id = :empleadoId")
    Optional<Usuario> findByEmpleadoId(@Param("empleadoId") Long empleadoId);

    @Query("SELECT u FROM Usuario u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.nombres) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.apellidos) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Usuario> buscar(@Param("search") String search);

    long countByEstado(String estado);

    long countByRolId(Long rolId);
}
