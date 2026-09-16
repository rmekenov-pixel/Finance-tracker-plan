package com.financetracker.modules.note.entity;

import com.financetracker.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false, length = 20)
    @Builder.Default
    private NoteEntityType entityType = NoteEntityType.GENERAL;

    @Column(name = "entity_id")
    private UUID entityId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
