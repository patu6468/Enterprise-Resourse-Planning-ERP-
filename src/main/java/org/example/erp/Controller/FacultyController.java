package org.example.erp.Controller;

import org.example.erp.Entity.Faculty;
import org.example.erp.Entity.Student;
import org.example.erp.Services.FacultyServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/faculty")
public class FacultyController {

    @Autowired
    private FacultyServices services;

    @PostMapping("/add")
    public String save(@RequestBody Faculty faculty) {
        services.save(faculty);
        return "faculty added";
    }

    @GetMapping("/login/{email}/{password}")
    public ResponseEntity<String> findByEmail(@PathVariable String email, @PathVariable String password) {
        int check = services.findByEmail(email, password);
        if (check == -1) return ResponseEntity.ok("not found");
        else if (check == 0) return ResponseEntity.status(401).body("Invalid email or password");
        else return ResponseEntity.ok("Login successful");
    }

    @GetMapping("/getAllstudent")
    public List<Student> findAll() {
        return services.findAll();
    }

    /* ── ADD student ── */
    @PostMapping("/addstudent")
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        return ResponseEntity.ok(services.addStudent(student));
    }

    /* ── UPDATE student ── */
    @PatchMapping("/updatestudent/{id}")
    public Student updateStudent(@RequestBody Student student, @PathVariable String id) {
        return services.updateStudent(student, id);
    }

    @GetMapping("/getbyemail/{email}")
    public ResponseEntity<?> getByEmail(@PathVariable String email) {
        Faculty faculty = services.findFacultyByEmail(email);
        if (faculty == null) return ResponseEntity.status(404).body("Faculty not found");
        return ResponseEntity.ok(faculty);
    }
}
