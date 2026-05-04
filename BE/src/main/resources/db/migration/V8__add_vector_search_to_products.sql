-- Kích hoạt extension pgvector (yêu cầu PostgreSQL đã cài đặt pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- Thêm cột tính toán nhúng vector với 384 chiều (kích thước chuẩn của all-MiniLM-L6-v2)
ALTER TABLE products ADD COLUMN search_embedding vector(384);

-- Không đánh index HNSW hoặc IVFFlat ngay vì dữ liệu có thể còn ít,
-- khi dữ liệu lớn (hàng triệu bản ghi) sẽ xem xét đánh index hnsw.
