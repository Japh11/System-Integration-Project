package com.Capstone.IskoLAIR.Repository;

import com.Capstone.IskoLAIR.Entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
	@Query("SELECT cr FROM ChatRoom cr WHERE (cr.senderId = :user1 AND cr.recipientId = :user2) OR (cr.senderId = :user2 AND cr.recipientId = :user1)")
	List<ChatRoom> findChatRoomBetweenUsers(@Param("user1") String user1, @Param("user2") String user2);

}
