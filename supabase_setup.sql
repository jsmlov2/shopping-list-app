-- shopping_items 테이블 생성
CREATE TABLE IF NOT EXISTS shopping_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 비활성화 (간단한 데모용)
ALTER TABLE shopping_items DISABLE ROW LEVEL SECURITY;

-- 인덱스 생성 (선택사항)
CREATE INDEX IF NOT EXISTS idx_shopping_items_created_at ON shopping_items(created_at);
