CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    entity_type VARCHAR(20) NOT NULL DEFAULT 'GENERAL',
    entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notes_user_entity ON notes(user_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_created ON notes(user_id, created_at DESC);
