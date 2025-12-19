package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {

    Optional<PushSubscription> findByEndpoint(String endpoint);

    List<PushSubscription> findByRolName(String rolName);

    List<PushSubscription> findByUsuarioId(Long usuarioId);

    void deleteByEndpoint(String endpoint);

    boolean existsByEndpoint(String endpoint);
}
