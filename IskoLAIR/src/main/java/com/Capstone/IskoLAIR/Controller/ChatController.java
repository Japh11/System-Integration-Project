package com.Capstone.IskoLAIR.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Capstone.IskoLAIR.Entity.ChatMessage;
import com.Capstone.IskoLAIR.Entity.ChatNotification;
import com.Capstone.IskoLAIR.Service.ChatMessageService;
import com.Capstone.IskoLAIR.Service.ChatRoomService;
import com.Capstone.IskoLAIR.Service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class ChatController {

    @Autowired private SimpMessagingTemplate messagingTemplate;
    @Autowired private ChatMessageService chatMessageService;
    @Autowired private ChatRoomService chatRoomService;
    @Autowired private UserService userService;
    @Autowired private ChatMessageService messageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        var chatId = chatRoomService.getChatId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true);
        chatMessage.setChatId(chatId.get());

        // 🚨 Ensure senderName and recipientName are set before saving
        if (chatMessage.getSenderName() == null || chatMessage.getSenderName().isEmpty()) {
            chatMessage.setSenderName(userService.resolveFullName(chatMessage.getSenderId(), chatMessage.getSenderRole()));
        }
        if (chatMessage.getRecipientName() == null || chatMessage.getRecipientName().isEmpty()) {
            chatMessage.setRecipientName(userService.resolveFullName(chatMessage.getRecipientId(), chatMessage.getSenderRole().equals("STAFF") ? "SCHOLAR" : "STAFF"));
        }

        ChatMessage saved = chatMessageService.save(chatMessage);

        messagingTemplate.convertAndSendToUser(
            chatMessage.getRecipientId(), "/queue/messages",
            new ChatNotification(saved.getId(), saved.getSenderId(), saved.getSenderName()));
    }



    @GetMapping("/api/contacts")
    public List<Object> getAllContacts(@RequestParam Long userId, @RequestParam String role) {
        System.out.println("🔍 Fetching contacts: userId = " + userId + ", role = " + role);
        return userService.getContactsByRole(userId, role);
    }


    
    @GetMapping("/api/messages")
    public List<ChatMessage> getChatMessages(
        @RequestParam String senderId,
        @RequestParam String senderRole,
        @RequestParam String recipientId,
        @RequestParam String recipientRole
    ) {
        return chatMessageService.getMessages(senderId, senderRole, recipientId, recipientRole);
    }
}
