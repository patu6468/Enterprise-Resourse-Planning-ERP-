package org.example.erp.Controller;

import org.example.erp.Entity.Lecture;
import org.example.erp.Services.LectureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.erp.Entity.Faculty;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/lecture")
public class LectureController {

    @Autowired
    private LectureService service;

    @PostMapping("/addlecture")
    public ResponseEntity<String> addLecture(@RequestBody Lecture lecture) {
        service.addLecture(lecture);
        return ResponseEntity.ok("lecture added");
    }

    @GetMapping("/getlecture")
    public List<Lecture> findAll() {
        return service.findALl();
    }

    @PatchMapping("/updatelecture/{id}")
    public Lecture updateLecture(@RequestBody Lecture lecture, @PathVariable int id) {
        return service.updateLecture(lecture, id);
    }

    // ← ADD THIS: needed by React delete button
    @DeleteMapping("/deletelecture/{id}")
    public ResponseEntity<String> deleteLecture(@PathVariable int id) {
        service.deleteLecture(id);
        return ResponseEntity.ok("lecture deleted");
    }
}