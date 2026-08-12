package org.example.erp.Services;

import org.example.erp.Entity.Admin;
import org.example.erp.Entity.Faculty;
import org.example.erp.Entity.Student;
import org.example.erp.Repository.AdminRepository;
import org.example.erp.Repository.FacultyRepository;
import org.example.erp.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServices {

    @Autowired private AdminRepository   adminRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private FacultyRepository facultyRepo;

    /* ══════════════════════════════════════════════════════════════
       ADMIN LOGIN
    ══════════════════════════════════════════════════════════════ */
    public int login(String email, String password) {
        Admin a = adminRepo.findByEmail(email);
        if (a == null)                          return -1;  // not found
        if (!a.getPassword().equals(password))  return  0;  // wrong password
        return 1;                                           // success
    }

    /* ══════════════════════════════════════════════════════════════
       ADMIN PROFILE
    ══════════════════════════════════════════════════════════════ */
    public Admin getByEmail(String email) {
        return adminRepo.findByEmail(email);
    }

    /* ══════════════════════════════════════════════════════════════
       STUDENT MANAGEMENT
    ══════════════════════════════════════════════════════════════ */
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    public Student getStudentById(String id) {
        return studentRepo.findById(id).orElse(null);
    }

    // Admin can update any student field
    public Student updateStudent(String id, Student incoming) {
        Student existing = studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));

        if (incoming.getName()         != null) existing.setName(incoming.getName());
        if (incoming.getEmail()        != null) existing.setEmail(incoming.getEmail());
        if (incoming.getGender()       != null) existing.setGender(incoming.getGender());
        if (incoming.getProgram()      != null) existing.setProgram(incoming.getProgram());
        if (incoming.getCaste()        != null) existing.setCaste(incoming.getCaste());
        if (incoming.getCity()         != null) existing.setCity(incoming.getCity());
        if (incoming.getState()        != null) existing.setState(incoming.getState());
        if (incoming.getDistrict()     != null) existing.setDistrict(incoming.getDistrict());
        if (incoming.getSubDistrict() != null) existing.setSubDistrict(incoming.getSubDistrict());
        if (incoming.getQualification()!= null) existing.setQualification(incoming.getQualification());
        if (incoming.getMobile()       != null) existing.setMobile(incoming.getMobile());
        if (incoming.getPinCode()     != null) existing.setPinCode(incoming.getPinCode());

//        // Password update with BCrypt hashing
//        if (incoming.getPassword() != null) {
//            existing.setPassword(new BCryptPasswordEncoder().encode(incoming.getPassword()));
//        }

        return studentRepo.save(existing);
    }
    public void deleteStudent(String id) {
        studentRepo.deleteById(id);
    }

    /* ══════════════════════════════════════════════════════════════
       FACULTY MANAGEMENT
    ══════════════════════════════════════════════════════════════ */
    public List<Faculty> getAllFaculty() {
        return facultyRepo.findAll();
    }

    public Faculty getFacultyById(String id) {
        return facultyRepo.findById(id).orElse(null);
    }

    // Add new faculty
    public Faculty addFaculty(Faculty faculty) {
        return facultyRepo.save(faculty);
    }

    // Update existing faculty
    public Faculty updateFaculty(String id, Faculty incoming) {
        Faculty existing = facultyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found: " + id));
        if(incoming.getId()              !=null) existing.setId(incoming.getId());
        if (incoming.getName()          != null) existing.setName(incoming.getName());
        if (incoming.getEmail()         != null) existing.setEmail(incoming.getEmail());
        if (incoming.getMobile()        != null) existing.setMobile(incoming.getMobile());
        if (incoming.getQualification() != null) existing.setQualification(incoming.getQualification());
        if (incoming.getGender()        != null) existing.setGender(incoming.getGender());
        if (incoming.getPassword()      != null) existing.setPassword(incoming.getPassword());

        return facultyRepo.save(existing);
    }

    // Delete faculty
    public void deleteFaculty(String id) {
        facultyRepo.deleteById(id);
    }

    /* ══════════════════════════════════════════════════════════════
       DASHBOARD STATS
    ══════════════════════════════════════════════════════════════ */
    public long totalStudents() { return studentRepo.count(); }
    public long totalFaculty()  { return facultyRepo.count(); }
}
