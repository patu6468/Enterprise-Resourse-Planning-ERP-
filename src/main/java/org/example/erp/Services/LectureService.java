package org.example.erp.Services;

import org.example.erp.Entity.Faculty;
import org.example.erp.Entity.Lecture;
import org.example.erp.Repository.FacultyRepository;
import org.example.erp.Repository.LectureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LectureService {

    @Autowired
    private LectureRepository repository;

     @Autowired
     private FacultyRepository facultyRepository;

    public void addLecture(Lecture lecture) {
        repository.save(lecture);
    }

    public List<Lecture> findALl() {
        return repository.findAll();
    }

    public Lecture updateLecture(Lecture incoming, int id) {
        Lecture existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecture not found: " + id));

        if (incoming.getSubject()      != null) existing.setSubject(incoming.getSubject());
        if (incoming.getFaculty_name() != null) existing.setFaculty_name(incoming.getFaculty_name());
        if (incoming.getDate()         != null) existing.setDate(incoming.getDate());
        if (incoming.getTime()         != null) existing.setTime(incoming.getTime());
        if (incoming.getCourse()       != null) existing.setCourse(incoming.getCourse());
        if (incoming.getStatus()       != null) existing.setStatus(incoming.getStatus());
        if (incoming.getFaculty()      != null) existing.setFaculty(incoming.getFaculty());

        return repository.save(existing);
    }





    public void deleteLecture(int id) {
         repository.deleteById(id);
    }
}
