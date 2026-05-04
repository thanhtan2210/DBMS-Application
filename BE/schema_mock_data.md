# Database Schema for Mock Data Generation

Dưới đây là cấu trúc các bảng trong hệ thống để AI agent có thể dựa vào sinh mock data. Các bảng được chia theo từng module.

> **Lưu ý chung:**
> - Các trường `id` (PK/FK) mang kiểu số nguyên lớn (`Long` / `BIGINT`).
> - Các enum được định nghĩa dưới dạng chuỗi `String` (`VARCHAR`).
> - Kiểu tiền tệ (currency/price) dùng `BigDecimal` (`NUMERIC(15,2)`).
> - `BaseEntity` bao gồm các trường chuẩn: `created_at` (DATETIME), `updated_at` (DATETIME).
> - `BaseAuditEntity` kế thừa từ `BaseEntity` và có thêm: `deleted_at` (DATETIME) dùng cho soft-delete.

---

## 1. User Module

### Bảng `users`
Kế thừa từ `BaseAuditEntity`.

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `user_id` | Long | Khóa chính (PK), auto increment |
| `email` | String | Unique |
| `password_hash` | String | |
| `full_name` | String | |
| `phone` | String | |
| `role` | String (Enum) | Giá trị có thể: ADMIN, CUSTOMER, etc. |
| `status` | String (Enum) | ACTIVE, INACTIVE |
| `created_at` | LocalDateTime | (BaseEntity) |
| `updated_at` | LocalDateTime | (BaseEntity) |
| `deleted_at` | LocalDateTime | (BaseAuditEntity) |

### Bảng `customer_profiles`
Kế thừa từ `BaseEntity`.

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `customer_id` | Long | Khóa chính (PK), auto increment |
| `user_id` | Long | Khóa phụ (FK) tới `users`, unique |
| `date_of_birth` | LocalDate | |
| `gender` | String | |
| `loyalty_points` | Integer | Mặc định 0 |
| `default_shipping_address_id` | Long | ID địa chỉ giao hàng mặc định |
| `created_at` | LocalDateTime | (BaseEntity) |
| `updated_at` | LocalDateTime | (BaseEntity) |

### Bảng `addresses`
Kế thừa từ `BaseEntity`.

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `address_id` | Long | Khóa chính (PK), auto increment |
| `user_id` | Long | Khóa phụ (FK) tới `users` |
| `receiver_name` | String | |
| `phone` | String | |
| `street` | String | |
| `ward` | String | |
| `district` | String | |
| `city` | String | |
| `country` | String | Mặc định "Vietnam" |
| `postal_code` | String | |
| `is_default` | Boolean | |
| `created_at` | LocalDateTime | (BaseEntity) |
| `updated_at` | LocalDateTime | (BaseEntity) |

---

## 2. Product Module

### Bảng `categories`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `category_id` | Long | Khóa chính (PK), auto increment |
| `parent_category_id` | Long | Khóa phụ (FK) tới `categories` (Self-referencing) |
| `category_name` | String | |
| `description` | String (Text) | |
| `status` | String | Mặc định "ACTIVE" |

### Bảng `brands`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `brand_id` | Long | Khóa chính (PK), auto increment |
| `brand_name` | String | Unique |
| `description` | String (Text) | |
| `status` | String | Mặc định "ACTIVE" |

### Bảng `products`
Kế thừa từ `BaseAuditEntity`.

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `product_id` | Long | Khóa chính (PK), auto increment |
| `sku` | String | Unique |
| `product_name` | String | |
| `brand_id` | Long | Khóa phụ (FK) tới `brands` |
| `category_id` | Long | Khóa phụ (FK) tới `categories` |
| `description` | String (Text) | |
| `price` | BigDecimal | |
| `cost_price` | BigDecimal | |
| `status` | String | |
| `created_at` | LocalDateTime | (BaseEntity) |
| `updated_at` | LocalDateTime | (BaseEntity) |
| `deleted_at` | LocalDateTime | (BaseAuditEntity) |

### Bảng `product_variants`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `variant_id` | Long | Khóa chính (PK), auto increment |
| `product_id` | Long | Khóa phụ (FK) tới `products` |
| `variant_name` | String | |
| `color` | String | |
| `size` | String | |
| `price_override` | BigDecimal | Giá cho từng phiên bản nếu có thay đổi so với giá gốc |
| `barcode` | String | Unique |
| `status` | String | |

### Bảng `warehouses`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `warehouse_id` | Long | Khóa chính (PK), auto increment |
| `warehouse_name` | String | |
| `location` | String | |
| `status` | String | |

### Bảng `inventory`
(Có Unique constraint giữa `variant_id` và `warehouse_id`)

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `inventory_id` | Long | Khóa chính (PK), auto increment |
| `variant_id` | Long | Khóa phụ (FK) tới `product_variants` |
| `warehouse_id` | Long | Khóa phụ (FK) tới `warehouses` |
| `quantity_on_hand` | Integer | Tồn kho thực tế |
| `quantity_reserved` | Integer | Tồn kho đang bị giữ lại (do có đơn chờ) |
| `reorder_threshold` | Integer | Mốc báo bổ sung |
| `updated_at` | LocalDateTime | |

---

## 3. Order & Cart Module

### Bảng `carts`
Kế thừa từ `BaseEntity`.

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `cart_id` | Long | Khóa chính (PK), auto increment |
| `customer_id` | Long | Khóa phụ (FK) tới `customer_profiles` |
| `status` | String (Enum) | ACTIVE, etc. |
| `created_at` | LocalDateTime | (BaseEntity) |
| `updated_at` | LocalDateTime | (BaseEntity) |

### Bảng `cart_items`
Kế thừa từ `BaseEntity`.

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `cart_item_id` | Long | Khóa chính (PK), auto increment |
| `cart_id` | Long | Khóa phụ (FK) tới `carts` |
| `variant_id` | Long | Khóa phụ (FK) tới `product_variants` |
| `quantity` | Integer | |
| `unit_price` | BigDecimal | |
| `selected_flag` | Boolean | True / False |
| `created_at` | LocalDateTime | (BaseEntity) |
| `updated_at` | LocalDateTime | (BaseEntity) |

### Bảng `orders`
Kế thừa từ `BaseEntity`.

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `order_id` | Long | Khóa chính (PK), auto increment |
| `customer_id` | Long | Khóa phụ (FK) tới `customer_profiles` |
| `order_code` | String | Unique |
| `shipping_address_id` | Long | Khóa phụ (FK) tới `addresses` |
| `order_status` | String (Enum) | PENDING_PAYMENT, PROCESSING, SHIPPED, etc. |
| `payment_status` | String (Enum) | PENDING, COMPLETED, FAILED, etc. |
| `subtotal_amount` | BigDecimal | |
| `discount_amount` | BigDecimal | |
| `shipping_fee` | BigDecimal | |
| `tax_amount` | BigDecimal | |
| `total_amount` | BigDecimal | |
| `created_at` | LocalDateTime | (BaseEntity) |
| `updated_at` | LocalDateTime | (BaseEntity) |

### Bảng `order_items`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `order_item_id` | Long | Khóa chính (PK), auto increment |
| `order_id` | Long | Khóa phụ (FK) tới `orders` |
| `variant_id` | Long | Khóa phụ (FK) tới `product_variants` |
| `quantity` | Integer | |
| `unit_price` | BigDecimal | |
| `discount_amount` | BigDecimal | |
| `line_total` | BigDecimal | |

### Bảng `order_status_history`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `history_id` | Long | Khóa chính (PK), auto increment |
| `order_id` | Long | Khóa phụ (FK) tới `orders` |
| `old_status` | String (Enum) | |
| `new_status` | String (Enum) | |
| `changed_by` | String | ID/Name của người thao tác |
| `changed_at` | LocalDateTime | |
| `note` | String (Text) | Ghi chú |

---

## 4. Promotion Module

### Bảng `promotions`
Kế thừa từ `BaseEntity`.

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `promotion_id` | Long | Khóa chính (PK), auto increment |
| `promotion_code` | String | Unique |
| `promotion_name` | String | |
| `discount_type` | String (Enum) | PERCENTAGE, FIXED_AMOUNT, v.v.. |
| `discount_value` | BigDecimal | |
| `minimum_order_amount` | BigDecimal | |
| `max_discount_amount`| BigDecimal | |
| `usage_limit` | Integer | Số lượng dùng tối đa |
| `used_count` | Integer | Số lượng đã dùng |
| `start_time` | LocalDateTime | Thời gian bắt đầu |
| `end_time` | LocalDateTime | Thời gian kết thúc |
| `status` | String | |
| `created_at` | LocalDateTime | (BaseEntity) |
| `updated_at` | LocalDateTime | (BaseEntity) |

### Bảng `promotion_conditions`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `condition_id` | Long | Khóa chính (PK), auto increment |
| `promotion_id` | Long | Khóa phụ (FK) tới `promotions` |
| `applicable_category_id` | Long | Danh mục được áp dụng (Nullable) |
| `applicable_product_id` | Long | Sản phẩm được áp dụng (Nullable) |
| `applicable_customer_tier`| String | (Nullable) |
| `minimum_quantity` | Integer | |

### Bảng `order_promotions`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `order_promotion_id`| Long | Khóa chính (PK), auto increment |
| `order_id` | Long | Khóa phụ (FK) tới `orders` |
| `promotion_id` | Long | Khóa phụ (FK) tới `promotions` |
| `discount_amount` | BigDecimal | |

---

## 5. Payment Module

### Bảng `payments`
Kế thừa từ `BaseEntity`.

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `payment_id` | Long | Khóa chính (PK), auto increment |
| `order_id` | Long | Khóa phụ (FK) tới `orders` |
| `payment_method` | String (Enum) | CASH, CREDIT_CARD, PAYPAL, etc. |
| `payment_provider` | String | VNPay, MoMo, etc. |
| `transaction_ref` | String | Unique |
| `amount` | BigDecimal | |
| `payment_status` | String (Enum) | PENDING, SUCCESS, FAILED |
| `paid_at` | LocalDateTime | |
| `raw_response` | String (Text) | |
| `created_at` | LocalDateTime | (BaseEntity) |
| `updated_at` | LocalDateTime | (BaseEntity) |

---

## 6. Analytics / Inventory Log Module

### Bảng `user_events`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `event_id` | Long | Khóa chính (PK), auto increment |
| `user_id` | Long | (Nullable nếu guest) |
| `session_id` | String | |
| `event_type` | String (Enum) | CLICK, VIEW_PRODUCT, ADD_TO_CART |
| `product_id` | Long | |
| `variant_id` | Long | |
| `metadata_json` | String (Text) | Dữ liệu dạng JSON |
| `event_time` | LocalDateTime | |

### Bảng `sales_summary_daily`
(Bảng thống kê theo từng ngày)

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `summary_date` | LocalDate | Khóa chính (PK) |
| `total_orders` | Integer | |
| `total_items_sold` | Integer | |
| `gross_revenue` | BigDecimal | |
| `net_revenue` | BigDecimal | |
| `total_discount` | BigDecimal | |
| `total_customers` | Integer | |

### Bảng `inventory_movements`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `movement_id` | Long | Khóa chính (PK), auto increment |
| `variant_id` | Long | Khóa ngoại tới `product_variants` |
| `movement_type` | String (Enum) | IN, OUT, ADJUSTMENT |
| `quantity` | Integer | |
| `reference_type` | String | ORDER, RETURN, MANUAL_ADJUST |
| `reference_id` | Long | ID của reference |
| `created_at` | LocalDateTime | |

### Bảng `forecast_snapshots`

| Tên thuộc tính | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `snapshot_id` | Long | Khóa chính (PK), auto increment |
| `variant_id` | Long | |
| `forecast_date` | LocalDate | |
| `lookback_days` | Integer | Khoảng thời gian đã xét (số ngày) |
| `predicted_demand` | BigDecimal | Nhu cầu dự báo |
| `recommended_restock_qty` | Integer | Số lượng khuyên đề xuất dùng bổ sung |
| `generated_at` | LocalDateTime | |
