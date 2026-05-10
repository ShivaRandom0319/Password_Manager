package com.example.vault.repository;

import com.example.vault.entity.PasswordRecord;
import com.example.vault.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordRecordRepository extends JpaRepository<PasswordRecord, Long> {

    List<PasswordRecord> findByUser(User user);

    Optional<PasswordRecord> findByIdAndUser(Long id, User user);

    List<PasswordRecord> findByUserAndNameContainingIgnoreCase(User user, String name);
}
