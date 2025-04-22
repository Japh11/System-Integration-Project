package com.Capstone.IskoLAIR.Service;

import com.Capstone.IskoLAIR.Entity.ChatMessage;
import com.Capstone.IskoLAIR.Entity.MessageStatus;
import com.Capstone.IskoLAIR.Repository.ChatMessageRepository;
import com.Capstone.IskoLAIR.Service.ChatRoomService;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatRoomService chatRoomService;

    public ChatMessage save(ChatMessage chatMessage) {
        System.out.println("💾 Saving message from senderId: " + chatMessage.getSenderId() + " to recipientId: " + chatMessage.getRecipientId());
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setStatus(MessageStatus.RECEIVED);
        return chatMessageRepository.save(chatMessage);
    }

    /**
     * Fetch messages using only chatId (if you use a common chatId across both directions)
     */
    public List<ChatMessage> findChatMessages(String chatId) {
        return chatMessageRepository.findByChatId(chatId);
    }

    /**
     * 🔥 Prefer this method when fetching all chat messages between two users.
     * It ensures the correct pairing of sender and recipient, in either direction.
     */
    public List<ChatMessage> getMessages(String senderId, String senderRole, String recipientId, String recipientRole) {
        return chatMessageRepository.findChatMessagesBetween(senderId, senderRole, recipientId, recipientRole);
    }


    @PostConstruct
    public void init() {
        System.out.println("✅ ChatRoomService is injected: " + (chatRoomService != null));
    }
}
