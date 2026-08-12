package org.example.erp.Repository;

import org.example.erp.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {

    // Used for login
    Admin findByEmail(String email);

    // Used for login validation
    Admin findByEmailAndPassword(String email, String password);
}
