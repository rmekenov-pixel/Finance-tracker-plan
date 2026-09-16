package com.financetracker.modules.note.dto;

import com.financetracker.modules.note.entity.NoteEntityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateNoteRequest {

    @NotBlank(message = "Текст заметки обязателен")
    private String content;

    @NotNull(message = "Тип привязки обязателен")
    @Builder.Default
    private NoteEntityType entityType = NoteEntityType.GENERAL;

    private UUID entityId;
}
