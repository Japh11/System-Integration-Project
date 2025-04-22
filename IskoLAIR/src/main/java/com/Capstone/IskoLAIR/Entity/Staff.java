package com.Capstone.IskoLAIR.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    
    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL, orphanRemoval = true) 
    @JsonIgnore    
    private List<Assignment> assignments;

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Announcement> announcements;

    
    @Enumerated(EnumType.STRING)
    private Role role = Role.STAFF;
    
    public String getLastName() { 
    	return lastName; 
    }
    public void setLastName(String lastName) { 
    	this.lastName = lastName; 
    }

    public String getFirstName() { 
    	return firstName; 
    }
    public void setFirstName(String firstName) { 
    	this.firstName = firstName; 
    }

    public String getEmail() { 
    	return email; 
    }
    
    public void setEmail(String email) { 
    	this.email = email; 
    }
    
    public void setPassword(String password) { 
    	this.password = password; 
    }
    
    public String getPassword() { 
    	return password; 
    }

    public Role getRole() { 
    	return role; 
    }
    public void setRole(Role role) { 
    	this.role = role; 
    }
    
    public List<Assignment> getAssignments() { 
        return assignments; 
    }
    public void setAssignments(List<Assignment> assignments) { 
        this.assignments = assignments; 
    }
	
    public Long getId() {
        return id;  
    }

    public List<Announcement> getAnnouncements() {
        return announcements;
    }

    public void setAnnouncements(List<Announcement> announcements) {
        this.announcements = announcements;
    }
   
}
