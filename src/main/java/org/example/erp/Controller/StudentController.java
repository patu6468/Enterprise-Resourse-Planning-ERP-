package org.example.erp.Controller;


import org.example.erp.Entity.Lecture;
import org.example.erp.Entity.Student;
import org.example.erp.Services.StudentServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@CrossOrigin(origins =  "http://localhost:3000")
@RestController
@RequestMapping("/student")
public class StudentController {

     @Autowired
     private StudentServices services;

     @PostMapping("/add")
    public String save(@RequestBody Student student){
         services.save(student);
         return "student save";
     }

     @GetMapping("/login/{email}/{password}")
    public ResponseEntity<String> findByEmail(@PathVariable String email, @PathVariable String password){
        int check= services.findByEmail(email,password);
         if(check==-1){
             return ResponseEntity.ok("not found");
         } else if (check==0) {
             return ResponseEntity.status(401).body("Invalid email or password");
         }else{
             return ResponseEntity.ok("Login successful");
         }
     }

    @GetMapping("/getbyemail/{email}")
    public ResponseEntity<?> getByEmail(@PathVariable String email) {
        Student student = services.findByEmail(email);
        if (student == null) return ResponseEntity.status(404).body("Student not found");
        return ResponseEntity.ok(student);
    }

     @GetMapping("/getlecture/{course}")
    public List<Lecture> findAll(@PathVariable String course){
         return services.findAll(course);
     }

}
