

package org.example.erp.Services;

import org.example.erp.Entity.Faculty;
import org.example.erp.Entity.Student;
import org.example.erp.Repository.FacultyRepository;
import org.example.erp.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyServices {

    @Autowired private FacultyRepository facultyRepository;
    @Autowired private StudentRepository studentRepository;

    /* ── Faculty login ── */
    public int findByEmail(String email, String password) {
        Faculty f = facultyRepository.findByEmail(email);
        if (f == null)                          return -1;
        if (!f.getPassword().equals(password))  return  0;
        return 1;
    }

    /* ── Save faculty ── */
    public void save(Faculty faculty) {
        facultyRepository.save(faculty);
    }

    /* ── Faculty profile by email ── */
    public Faculty findFacultyByEmail(String email) {
        return facultyRepository.findByEmail(email);
    }

    /* ── Get all students ── */
    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    /* ── ADD new student ── */
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    /* ── UPDATE existing student ── */
    public Student updateStudent(Student student, String id) {
        Student existing = studentRepository.findById(id).orElse(null);
        if (existing != null) {
            if (student.getName()          != null) existing.setName(student.getName());
            if (student.getEmail()         != null) existing.setEmail(student.getEmail());
            if (student.getGender()        != null) existing.setGender(student.getGender());
            if (student.getCaste()         != null) existing.setCaste(student.getCaste());  // fixed
            if (student.getPassword()      != null) existing.setPassword(student.getPassword());
            if (student.getMobile()        != null) existing.setMobile(student.getMobile());
            if (student.getCity()          != null) existing.setCity(student.getCity());
            if (student.getDistrict()      != null) existing.setDistrict(student.getDistrict());
            if (student.getSubDistrict()   != null) existing.setSubDistrict(student.getSubDistrict());  // fixed
            if (student.getPinCode()       != null) existing.setPinCode(student.getPinCode());          // fixed
            if (student.getProgram()       != null) existing.setProgram(student.getProgram());
            if (student.getQualification() != null) existing.setQualification(student.getQualification());
        }
        return studentRepository.save(existing);
    }
}

