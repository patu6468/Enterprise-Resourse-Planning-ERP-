package org.example.erp.Services;

import org.example.erp.Entity.Lecture;
import org.example.erp.Entity.Student;
import org.example.erp.Repository.LectureRepository;
import org.example.erp.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class StudentServices {

    @Autowired
    private StudentRepository repository;

    @Autowired
    private LectureRepository lectureRepository;

    public void save(Student student) {
        repository.save(student);
    }

    public int findByEmail(String email, String password) {
        Student existing_student = repository.findByEmail(email);

        if(existing_student!=null){
            String pass=existing_student.getPassword();
            String email1= existing_student.getEmail();
            if(email.equals(email1) && password.equals(pass)){
                return 1;
            }
            else{return 0;}
        }
        else{return -1;}

    }

    public Student findByEmail(String email) {
        return repository.findByEmail(email);
    }

    public List<Lecture> findAll(String course) {
        List<Lecture> existing = lectureRepository.findByCourse(course);

         return existing;
    }
}
