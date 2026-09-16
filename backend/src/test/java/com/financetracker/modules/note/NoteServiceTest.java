package com.financetracker.modules.note;

import com.financetracker.modules.auth.dto.AuthResponse;
import com.financetracker.modules.auth.dto.RegisterRequest;
import com.financetracker.modules.auth.service.AuthService;
import com.financetracker.modules.note.dto.CreateNoteRequest;
import com.financetracker.modules.note.dto.NoteResponse;
import com.financetracker.modules.note.entity.NoteEntityType;
import com.financetracker.modules.note.service.NoteService;
import com.financetracker.shared.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class NoteServiceTest {

    @Autowired
    private NoteService noteService;

    @Autowired
    private AuthService authService;

    private UUID testUserId;

    @BeforeEach
    void setUp() {
        RegisterRequest req = RegisterRequest.builder()
                .email("note_user_" + UUID.randomUUID() + "@test.com")
                .password("password123")
                .name("Note User")
                .currency("KZT")
                .build();
        AuthResponse auth = authService.register(req);
        testUserId = auth.getUser().getId();
    }

    @Test
    void createAndGetGeneralNote_Success() {
        CreateNoteRequest req = CreateNoteRequest.builder()
                .content("Общая заметка: не забыть сверить бюджет")
                .entityType(NoteEntityType.GENERAL)
                .build();

        NoteResponse note = noteService.createNote(testUserId, req);
        assertNotNull(note.getId());
        assertEquals("Общая заметка: не забыть сверить бюджет", note.getContent());
        assertEquals(NoteEntityType.GENERAL, note.getEntityType());

        List<NoteResponse> notes = noteService.getNotes(testUserId, null);
        assertEquals(1, notes.size());
    }

    @Test
    void createAndGetLinkedNote_Success() {
        UUID fakeGoalId = UUID.randomUUID();

        CreateNoteRequest req = CreateNoteRequest.builder()
                .content("Заметка к цели: оплатить через Каспи")
                .entityType(NoteEntityType.GOAL)
                .entityId(fakeGoalId)
                .build();

        noteService.createNote(testUserId, req);

        List<NoteResponse> linkedNotes = noteService.getNotesByEntity(testUserId, NoteEntityType.GOAL, fakeGoalId);
        assertEquals(1, linkedNotes.size());
        assertEquals(fakeGoalId, linkedNotes.get(0).getEntityId());
    }

    @Test
    void deleteNote_SuccessAndIdorProtection() {
        CreateNoteRequest req = CreateNoteRequest.builder()
                .content("Заметка для удаления")
                .entityType(NoteEntityType.GENERAL)
                .build();

        NoteResponse note = noteService.createNote(testUserId, req);

        UUID alienUserId = UUID.randomUUID();
        assertThrows(NotFoundException.class, () -> noteService.deleteNote(alienUserId, note.getId()));

        noteService.deleteNote(testUserId, note.getId());
        List<NoteResponse> notes = noteService.getNotes(testUserId, null);
        assertEquals(0, notes.size());
    }
}
