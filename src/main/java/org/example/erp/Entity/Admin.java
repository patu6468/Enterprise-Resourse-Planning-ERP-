package org.example.erp.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String password;
    private String role;        // e.g. "SUPER_ADMIN", "ADMIN"
    private String phone;

    // ── Getters & Setters ──────────────────────────────────────────
    public Integer getId()               { return id; }
    public void setId(Integer id)        { this.id = id; }

    public String getName()              { return name; }
    public void setName(String name)     { this.name = name; }

    public String getEmail()             { return email; }
    public void setEmail(String email)   { this.email = email; }

    public String getPassword()          { return password; }
    public void setPassword(String p)    { this.password = p; }

    public String getRole()              { return role; }
    public void setRole(String role)     { this.role = role; }

    public String getPhone()             { return phone; }
    public void setPhone(String phone)   { this.phone = phone; }
}
