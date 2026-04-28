package com.realestatecrm.repository;

import com.realestatecrm.entity.Role;
import com.realestatecrm.entity.User;
import com.realestatecrm.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByStatus(UserStatus status);

    List<User> findByManagerId(Long managerId);

    long countByRole(Role role);
    long countByStatus(UserStatus status);
    List<User> findByRoleAndStatus(Role role, UserStatus status);
}