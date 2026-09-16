package com.financetracker.modules.note.controller;

import com.financetracker.modules.note.dto.CreateNoteRequest;
import com.financetracker.modules.note.dto.NoteResponse;
import com.financetracker.modules.note.entity.NoteEntityType;
import com.financetracker.modules.note.service.NoteService;
import com.financetracker.shared.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<NoteResponse> createNote(@Valid @RequestBody CreateNoteRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        NoteResponse response = noteService.createNote(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getNotes(
            @RequestParam(required = false) NoteEntityType entityType
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<NoteResponse> notes = noteService.getNotes(userId, entityType);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/entity/{type}/{id}")
    public ResponseEntity<List<NoteResponse>> getNotesByEntity(
            @PathVariable NoteEntityType type,
            @PathVariable UUID id
    ) {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<NoteResponse> notes = noteService.getNotesByEntity(userId, type, id);
        return ResponseEntity.ok(notes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNote(@PathVariable UUID id) {
        UUID userId = SecurityUtils.getCurrentUserId();
        noteService.deleteNote(userId, id);
        return ResponseEntity.ok(Map.of("message", "Заметка успешно удалена"));
    }
}
