package org.example.erp.Repository;

import org.example.erp.Entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture,Integer> {
    List<Lecture> findByCourse(String course);
}
