package com.financetracker.modules.note.dto;

import com.financetracker.modules.note.entity.Note;
import com.financetracker.modules.note.entity.NoteEntityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteResponse {
    private UUID id;
    private UUID userId;
    private String content;
    private NoteEntityType entityType;
    private UUID entityId;
    private Instant createdAt;

    public static NoteResponse fromEntity(Note n) {
        return NoteResponse.builder()
                .id(n.getId())
                .userId(n.getUser().getId())
                .content(n.getContent())
                .entityType(n.getEntityType())
                .entityId(n.getEntityId())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
