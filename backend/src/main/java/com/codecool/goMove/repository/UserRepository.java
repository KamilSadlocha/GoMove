package com.codecool.goMove.repository;

import com.codecool.goMove.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByUserNameOrUserEmail(String name, String email);
    Optional<User> findByUserName(String userName);
}
