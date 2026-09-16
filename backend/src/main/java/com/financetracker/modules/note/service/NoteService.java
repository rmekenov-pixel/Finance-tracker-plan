package com.financetracker.modules.note.service;

import com.financetracker.modules.auth.entity.User;
import com.financetracker.modules.auth.repository.UserRepository;
import com.financetracker.modules.note.dto.CreateNoteRequest;
import com.financetracker.modules.note.dto.NoteResponse;
import com.financetracker.modules.note.entity.Note;
import com.financetracker.modules.note.entity.NoteEntityType;
import com.financetracker.modules.note.repository.NoteRepository;
import com.financetracker.shared.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Transactional
    public NoteResponse createNote(UUID userId, CreateNoteRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        Note note = Note.builder()
                .user(user)
                .content(request.getContent().trim())
                .entityType(request.getEntityType() != null ? request.getEntityType() : NoteEntityType.GENERAL)
                .entityId(request.getEntityId())
                .build();

        Note saved = noteRepository.save(note);
        return NoteResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getNotes(UUID userId, NoteEntityType entityType) {
        return noteRepository.findByUserIdAndOptionalEntityType(userId, entityType)
                .stream()
                .map(NoteResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesByEntity(UUID userId, NoteEntityType entityType, UUID entityId) {
        return noteRepository.findByUserIdAndEntityTypeAndEntityIdOrderByCreatedAtDesc(userId, entityType, entityId)
                .stream()
                .map(NoteResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteNote(UUID userId, UUID noteId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new NotFoundException("Заметка не найдена или нет прав на удаление"));

        noteRepository.delete(note);
    }
}
