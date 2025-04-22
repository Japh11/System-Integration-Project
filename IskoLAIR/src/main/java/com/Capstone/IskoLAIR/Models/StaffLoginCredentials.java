package com.Capstone.IskoLAIR.Models;

public class StaffLoginCredentials {
    private String email;
    private String password;

    // Constructors
    public StaffLoginCredentials() {}
    public StaffLoginCredentials(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters & Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
