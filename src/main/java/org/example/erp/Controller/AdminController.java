package org.example.erp.Controller;

import org.example.erp.Entity.Admin;
import org.example.erp.Entity.Faculty;
import org.example.erp.Entity.Student;
import org.example.erp.Services.AdminServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "https://enterprise-resourse-planning-erp.onrender.com")
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminServices services;

    /* ══════════════════════════════════════════════════════════════
       AUTH
    ══════════════════════════════════════════════════════════════ */

    // GET /admin/login/{email}/{password}
    @GetMapping("/login/{email}/{password}")
    public ResponseEntity<String> login(
            @PathVariable String email,
            @PathVariable String password) {

        int result = services.login(email, password);
        if (result == -1) return ResponseEntity.ok("not found");
        if (result ==  0) return ResponseEntity.status(401).body("Invalid email or password");
        return ResponseEntity.ok("Login successful");
    }

    // GET /admin/getbyemail/{email}  → returns Admin profile
    @GetMapping("/getbyemail/{email}")
    public ResponseEntity<?> getByEmail(@PathVariable String email) {
        Admin admin = services.getByEmail(email);
        if (admin == null) return ResponseEntity.status(404).body("Admin not found");
        return ResponseEntity.ok(admin);
    }

    /* ══════════════════════════════════════════════════════════════
       DASHBOARD STATS
       GET /admin/stats  → { totalStudents, totalFaculty }
    ══════════════════════════════════════════════════════════════ */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
                "totalStudents", services.totalStudents(),
                "totalFaculty",  services.totalFaculty()
        ));
    }

    /* ══════════════════════════════════════════════════════════════
       STUDENT MANAGEMENT
    ══════════════════════════════════════════════════════════════ */

    // GET /admin/getAllStudents
    @GetMapping("/getAllStudents")
    public List<Student> getAllStudents() {
        return services.getAllStudents();
    }

    // GET /admin/getStudent/{id}
    @GetMapping("/getStudent/{id}")
    public ResponseEntity<?> getStudent(@PathVariable String id) {
        Student s = services.getStudentById(id);
        if (s == null) return ResponseEntity.status(404).body("Student not found");
        return ResponseEntity.ok(s);
    }

    // PATCH /admin/updateStudent/{id}
    @PatchMapping("/updateStudent/{id}")
    public ResponseEntity<?> updateStudent(
            @PathVariable String id,
            @RequestBody Student student) {
        try {
            return ResponseEntity.ok(services.updateStudent(id, student));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // DELETE /admin/deleteStudent/{id}
    @DeleteMapping("/deleteStudent/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable String id) {
        services.deleteStudent(id);
        return ResponseEntity.ok("Student deleted");
    }

    /* ══════════════════════════════════════════════════════════════
       FACULTY MANAGEMENT
    ══════════════════════════════════════════════════════════════ */

    // GET /admin/getAllFaculty
    @GetMapping("/getAllFaculty")
    public List<Faculty> getAllFaculty() {
        return services.getAllFaculty();
    }

    // GET /admin/getFaculty/{id}
    @GetMapping("/getFaculty/{id}")
    public ResponseEntity<?> getFaculty(@PathVariable String id) {
        Faculty f = services.getFacultyById(id);
        if (f == null) return ResponseEntity.status(404).body("Faculty not found");
        return ResponseEntity.ok(f);
    }

    // POST /admin/addFaculty
    @PostMapping("/addFaculty")
    public ResponseEntity<Faculty> addFaculty(@RequestBody Faculty faculty) {
        return ResponseEntity.ok(services.addFaculty(faculty));
    }

    // PATCH /admin/updateFaculty/{id}
    @PatchMapping("/updateFaculty/{id}")
    public ResponseEntity<?> updateFaculty(
            @PathVariable String id,
            @RequestBody Faculty faculty) {
        try {
            return ResponseEntity.ok(services.updateFaculty(id, faculty));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // DELETE /admin/deleteFaculty/{id}
    @DeleteMapping("/deleteFaculty/{id}")
    public ResponseEntity<String> deleteFaculty(@PathVariable String id) {
        services.deleteFaculty(id);
        return ResponseEntity.ok("Faculty deleted");
    }
}
