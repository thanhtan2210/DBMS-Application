package com.example.assignment.user.repository;

import com.example.assignment.user.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUser_UserId(Long userId);

    Optional<Address> findByUser_UserIdAndIsDefault(Long userId, Boolean isDefault);
}
