package com.financetracker.modules.note.repository;

import com.financetracker.modules.note.entity.Note;
import com.financetracker.modules.note.entity.NoteEntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {

    @Query("SELECT n FROM Note n WHERE n.user.id = :userId " +
           "AND (:entityType IS NULL OR n.entityType = :entityType) " +
           "ORDER BY n.createdAt DESC")
    List<Note> findByUserIdAndOptionalEntityType(
            @Param("userId") UUID userId,
            @Param("entityType") NoteEntityType entityType
    );

    List<Note> findByUserIdAndEntityTypeAndEntityIdOrderByCreatedAtDesc(
            UUID userId,
            NoteEntityType entityType,
            UUID entityId
    );

    Optional<Note> findByIdAndUserId(UUID id, UUID userId);

    long countByUserIdAndEntityTypeAndEntityId(UUID userId, NoteEntityType entityType, UUID entityId);
}
