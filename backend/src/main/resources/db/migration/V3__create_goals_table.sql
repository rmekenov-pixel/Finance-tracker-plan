CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PLANNED',
    target_amount DECIMAL(15, 2),
    current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    due_date DATE,
    sort_order INT NOT NULL DEFAULT 0,
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status, sort_order);
CREATE INDEX IF NOT EXISTS idx_goals_user_category ON goals(user_id, category);
