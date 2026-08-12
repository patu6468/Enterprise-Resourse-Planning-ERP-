package org.example.erp.Repository;

import org.example.erp.Entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyRepository extends JpaRepository <Faculty,String>{
    Faculty findByEmail(String email);
}
