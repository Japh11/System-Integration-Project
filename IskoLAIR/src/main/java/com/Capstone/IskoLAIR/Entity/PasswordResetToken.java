package com.Capstone.IskoLAIR.Entity;

import jakarta.persistence.*;
import java.util.Calendar;
import java.util.Date;

@Entity
public class PasswordResetToken {

    private static final int EXPIRATION = 60 * 24; // 24 hours validity

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String token;

    @OneToOne
    @JoinColumn(name = "scholar_id", nullable = false, unique = true)
    private OurScholars scholar;

    private Date expiryDate;

    public PasswordResetToken() {}

    public PasswordResetToken(String token, OurScholars scholar) {
        this.token = token;
        this.scholar = scholar;
        this.expiryDate = calculateExpiryDate();
    }

    private Date calculateExpiryDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.MINUTE, EXPIRATION);
        return calendar.getTime();
    }

    public boolean isExpired() {
        return new Date().after(this.expiryDate);
    }

    public void updateExpiryDate() {
        this.expiryDate = calculateExpiryDate();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public OurScholars getScholar() {
        return scholar;
    }

    public void setScholar(OurScholars scholar) {
        this.scholar = scholar;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }
}
