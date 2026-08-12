package org.example.erp.Repository;

import org.example.erp.Entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student,String> {
    Student findByEmail(String email);
}

