package com.Capstone.IskoLAIR.Service;

import com.Capstone.IskoLAIR.Entity.ChatRoom;
import com.Capstone.IskoLAIR.Repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    public Optional<String> getChatId(String senderId, String recipientId, boolean createIfNotExist) {
        List<ChatRoom> rooms = chatRoomRepository.findChatRoomBetweenUsers(senderId, recipientId);

        if (!rooms.isEmpty()) {
            return Optional.of(rooms.get(0).getChatId());
        }

        if (!createIfNotExist) {
            return Optional.empty();
        }

        String chatId = UUID.randomUUID().toString();

        ChatRoom newRoom = new ChatRoom();
        newRoom.setSenderId(senderId);
        newRoom.setRecipientId(recipientId);
        newRoom.setChatId(chatId);

        chatRoomRepository.save(newRoom);

        return Optional.of(chatId);
    }
}
