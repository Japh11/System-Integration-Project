package com.Capstone.IskoLAIR.Entity;

public class ChatNotification {
    private String id;
    private String senderId;
    private String senderName;

    // Constructor
    public ChatNotification(String id, String senderId, String senderName) {
        this.id = id;
        this.senderId = senderId;
        this.senderName = senderName;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getSenderId() {
        return senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    // Setters (optional if you're not modifying after construction)
}
