package com.Capstone.IskoLAIR.Repository;

import com.Capstone.IskoLAIR.Entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    List<ChatMessage> findByChatId(String chatId);
    List<ChatMessage> findByChatIdOrderByTimestampAsc(String chatId);
    @Query("SELECT m FROM ChatMessage m WHERE " +
    	       "(m.senderId = :senderId AND m.senderRole = :senderRole AND m.recipientId = :recipientId AND m.recipientRole = :recipientRole) OR " +
    	       "(m.senderId = :recipientId AND m.senderRole = :recipientRole AND m.recipientId = :senderId AND m.recipientRole = :senderRole) " +
    	       "ORDER BY m.timestamp ASC")
    	List<ChatMessage> findChatMessagesBetween(
    	    @Param("senderId") String senderId,
    	    @Param("senderRole") String senderRole,
    	    @Param("recipientId") String recipientId,
    	    @Param("recipientRole") String recipientRole
    	);
}
