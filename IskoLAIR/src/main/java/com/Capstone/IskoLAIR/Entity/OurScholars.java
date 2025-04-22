package com.Capstone.IskoLAIR.Entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;

@Entity
@Table(name = "scholars") // Table for Scholar users
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class OurScholars  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String lastName;
    private String firstName;
    private String middleName;
    private int batchYear;
    private String accountNo;
    private String spasNo;
    private String sex;
    private String levelYear;
    private String school;
    private String course;
    private String status;
    private String typeOfScholarship;
    private String birthday;
    private String contactNumber;
    private String email;

    // Address fields
    private String brgy;
    private String municipality;
    private String province;
    private String district;
    private String region;

    @ManyToOne
    @JoinColumn(name = "created_by_admin_id")
    @JsonIgnore
    private Admin createdBy;

    public Admin getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Admin createdBy) {
        this.createdBy = createdBy;
    }

    
    // 📌 Relationship with Announcement
    @ManyToMany(mappedBy = "scholars")
    @JsonIgnore
    private List<Announcement> announcements;

    @OneToMany(mappedBy = "scholar", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Assignment> assignments = new ArrayList<>();

    @OneToMany(mappedBy = "scholar", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Submission> submissions;

    public List<Assignment> getAssignments() { 
        return assignments; 
    }

    public void setAssignments(List<Assignment> assignments) { 
        this.assignments = assignments; 
    }
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.SCHOLAR;

    private boolean firstTimeLogin = true;

    // 📌 Field to store the monitoring sheet file
    @Lob
    private byte[] monitoringSheet;

    // ✅ Getters & Setters
    public Long getId() { 
    	return id; 
    }

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

    public String getMiddleName() { 
    	return middleName; 
    }
    public void setMiddleName(String middleName) { 
    	this.middleName = middleName; 
    }

    public int getBatchYear() { 
    	return batchYear; 
    }
    public void setBatchYear(int batchYear) { 
    	this.batchYear = batchYear; 
    }

    public String getAccountNo() { 
    	return accountNo; 
    }
    public void setAccountNo(String accountNo) { 
    	this.accountNo = accountNo; 
    }

    public String getSpasNo() { 
    	return spasNo; 
    }
    public void setSpasNo(String spasNo) { 
    	this.spasNo = spasNo; 
    }

    public String getSex() { 
    	return sex; 
    }
    public void setSex(String sex) { 
    	this.sex = sex; 
    }

    public String getLevelYear() { 
    	return levelYear; 
    }
    public void setLevelYear(String levelYear) { 
    	this.levelYear = levelYear; 
    }

    public String getSchool() { 
    	return school; 
    }
    public void setSchool(String school) { 
    	this.school = school; 
    }

    public String getCourse() { 
    	return course; 
    }
    
    public void setCourse(String course) { this.course = course; }

    public String getStatus() { 
    	return status; 
    }
    
    public void setStatus(String status) { 
    	this.status = status; 
    }

    public String getBirthday() { 
    	return birthday; 
    }
    public void setBirthday(String birthday) { 
    	this.birthday = birthday; 
    }

    public String getContactNumber() { 
    	return contactNumber; 
    }
    
    public void setContactNumber(String contactNumber) { 
    	this.contactNumber = contactNumber; 
    }

    public String getEmail() { 
    	return email; 
    }
    
    public void setEmail(String email) { 
    	this.email = email; 
    }

    public String getBrgy() { 
    	return brgy; 
    }
    
    public void setBrgy(String brgy) { 
    	this.brgy = brgy; 
    }

    public String getMunicipality() { return municipality; }
    public void setMunicipality(String municipality) { 
    	this.municipality = municipality; 
    }

    public String getProvince() { 
    	return province; 
    }
    
    public void setProvince(String province) { 
    	this.province = province; 
    }

    public String getDistrict() { 
    	return district; 
    }
    
    public void setDistrict(String district) { 
    	this.district = district;
    }

    public String getRegion() { 
    	return region; 
    }
    
    public void setRegion(String region) { 
    	this.region = region; 
    }

    public void setPassword(String password) { 
    	this.password = password; 
    }
    
    public String getPassword() { 
    	return password; 
    }

    public String getTypeOfScholarship() {
        return typeOfScholarship;
    }

    public void setTypeOfScholarship(String typeOfScholarship) {
        this.typeOfScholarship = typeOfScholarship;
    }

    public Role getRole() { 
    	return role; 
    }
    public void setRole(Role role) { 
    	this.role = role; 
    }

    public boolean isFirstTimeLogin() 
    { 
    	return firstTimeLogin; 
    }
    
    public void setFirstTimeLogin(boolean firstTimeLogin) 
    { 
    	this.firstTimeLogin = firstTimeLogin; 
    }

    public byte[] getMonitoringSheet() { 
    	return monitoringSheet; 
    }
    
    public void setMonitoringSheet(byte[] monitoringSheet) { 
    	this.monitoringSheet = monitoringSheet; 
    }
    
    public List<Submission> getSubmissions() { return submissions; }
    	public void setSubmissions(List<Submission> submissions) { this.submissions = submissions;
    }

    public List<Announcement> getAnnouncements() {
        return announcements;
    }

    public void setAnnouncements(List<Announcement> announcements) {
        this.announcements = announcements;
    }
@PreRemove
  private void detatchAnnouncements() {
    for (Announcement ann : new ArrayList<>(announcements)) {
      ann.getScholars().remove(this);
    }
  }
}
