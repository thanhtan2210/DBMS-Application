  
# Application Requirements Specification  
## Project: High-Volume E-commerce Transaction Management and Real-time Analytics System

## 1. Purpose
This document defines the detailed application requirements for a high-volume e-commerce system intended for implementation on **PostgreSQL**.  
The requirements are written in a form that can be used directly by an AI coding agent to generate an initial project template, database schema, service modules, API routes, and basic UI pages.

This system is designed to satisfy the DBMS assignment requirement that the application support at least **10 functional requirements** and include enough operations to demonstrate:
- Insert
- Delete
- Update
- Query with a single condition
- Query with a composite condition
- Query with a join
- Query with a subquery
- Query with aggregate functions

---

## 2. Recommended Scope

### 2.1 Main Goal
Build an e-commerce platform back office + customer-facing flow that can handle:
- high transaction volume
- frequent product/catalog updates
- shopping cart and checkout flows
- payment tracking
- order lifecycle management
- analytics/reporting
- forecasting support

### 2.2 Recommended DBMS
**PostgreSQL**

### 2.3 Why PostgreSQL fits this application
PostgreSQL is suitable because the system contains:
- strongly related entities
- transactional operations
- concurrency-sensitive operations
- reporting queries using joins, subqueries, and aggregates
- inventory and order consistency requirements

---

## 3. Actors

### 3.1 Customer
Can register, manage cart, place orders, pay, and view order status.

### 3.2 Admin
Manages customers, products, promotions, reports, forecasting, and order monitoring.

### 3.3 Warehouse/Operations Staff
Updates fulfillment status and stock movement after order confirmation.

### 3.4 Payment Gateway (external or mocked)
Used to simulate payment initiation and payment confirmation callback.

### 3.5 Analytics Processor / Internal System Job
Processes clickstream or user behavior logs and prepares analytical summaries.

---

## 4. Core Data Needed

The following logical data groups should exist in the template code.  
Exact table design can be refined later, but the AI agent should scaffold around these entities.

### 4.1 User and Customer Data
- `users`
  - user_id
  - email
  - password_hash
  - full_name
  - phone
  - role (`customer`, `admin`, `staff`)
  - status
  - created_at
  - updated_at

- `customer_profiles`
  - customer_id
  - user_id
  - date_of_birth
  - gender
  - loyalty_points
  - default_shipping_address_id
  - created_at
  - updated_at

- `addresses`
  - address_id
  - user_id
  - receiver_name
  - phone
  - street
  - ward
  - district
  - city
  - country
  - postal_code
  - is_default
  - created_at
  - updated_at

### 4.2 Product and Catalog Data
- `categories`
  - category_id
  - parent_category_id
  - category_name
  - description
  - status

- `brands`
  - brand_id
  - brand_name
  - description
  - status

- `products`
  - product_id
  - sku
  - product_name
  - brand_id
  - category_id
  - description
  - price
  - cost_price
  - status
  - created_at
  - updated_at

- `product_variants`
  - variant_id
  - product_id
  - variant_name
  - color
  - size
  - price_override
  - barcode
  - status

- `inventory`
  - inventory_id
  - variant_id
  - warehouse_id
  - quantity_on_hand
  - quantity_reserved
  - reorder_threshold
  - updated_at

- `warehouses`
  - warehouse_id
  - warehouse_name
  - location
  - status

### 4.3 Cart and Order Data
- `carts`
  - cart_id
  - customer_id
  - status (`active`, `converted`, `abandoned`)
  - created_at
  - updated_at

- `cart_items`
  - cart_item_id
  - cart_id
  - variant_id
  - quantity
  - unit_price
  - selected_flag
  - created_at
  - updated_at

- `orders`
  - order_id
  - customer_id
  - order_code
  - shipping_address_id
  - order_status
  - payment_status
  - subtotal_amount
  - discount_amount
  - shipping_fee
  - tax_amount
  - total_amount
  - created_at
  - updated_at

- `order_items`
  - order_item_id
  - order_id
  - variant_id
  - quantity
  - unit_price
  - discount_amount
  - line_total

- `order_status_history`
  - history_id
  - order_id
  - old_status
  - new_status
  - changed_by
  - changed_at
  - note

### 4.4 Payment Data
- `payments`
  - payment_id
  - order_id
  - payment_method
  - payment_provider
  - transaction_ref
  - amount
  - payment_status
  - paid_at
  - raw_response
  - created_at

### 4.5 Promotion Data
- `promotions`
  - promotion_id
  - promotion_code
  - promotion_name
  - discount_type (`percentage`, `fixed`)
  - discount_value
  - minimum_order_amount
  - max_discount_amount
  - usage_limit
  - used_count
  - start_time
  - end_time
  - status

- `promotion_conditions`
  - condition_id
  - promotion_id
  - applicable_category_id
  - applicable_product_id
  - applicable_customer_tier
  - minimum_quantity

- `order_promotions`
  - order_promotion_id
  - order_id
  - promotion_id
  - discount_amount

### 4.6 Behavior and Analytics Data
- `user_events`
  - event_id
  - user_id
  - session_id
  - event_type (`view_product`, `search`, `add_to_cart`, `checkout_start`, `purchase`)
  - product_id
  - variant_id
  - metadata_json
  - event_time

- `inventory_movements`
  - movement_id
  - variant_id
  - movement_type (`purchase_in`, `sale_out`, `reserve`, `release`, `adjustment`)
  - quantity
  - reference_type
  - reference_id
  - created_at

- `forecast_snapshots`
  - snapshot_id
  - variant_id
  - forecast_date
  - lookback_days
  - predicted_demand
  - recommended_restock_qty
  - generated_at

- `sales_summary_daily`
  - summary_date
  - total_orders
  - total_items_sold
  - gross_revenue
  - net_revenue
  - total_discount
  - total_customers

---

## 5. General Business Rules

1. Login/logout is not counted toward the 10 functional requirements.
2. Each order must belong to exactly one customer.
3. Each order must contain at least one order item.
4. Order total must be recalculated whenever cart items, discounts, or shipping fee change.
5. Inventory must not become negative after checkout confirmation.
6. Reserved inventory must be tracked separately from available stock.
7. Payment confirmation updates payment status and may update order status.
8. Order status transitions must be controlled; invalid jumps should be rejected.
9. Promotion usage must respect time window, usage limit, and minimum conditions.
10. Analytics/reporting data can be generated from transactional tables or from summary tables.

---

## 6. Functional Requirements Overview

The 10 confirmed functional requirements are:

1. Customer Management  
2. Product Management  
3. Order Placement  
4. Payment Integration  
5. Cart Management  
6. Discounts and Promotions  
7. User Behavior Analytics  
8. Inventory Forecasting  
9. Sales Reporting  
10. Order Status Management  

---

## 7. Detailed Functional Requirements

---

## FR-01. Customer Management

### Objective
Allow admin to create, update, deactivate, view, and delete customer records; allow customer profile retrieval for order and analytics usage.

### Primary Actors
- Admin
- Customer

### Required Data
#### Input Data
- full_name
- email
- password
- phone
- date_of_birth
- gender
- address fields
- account status

#### Stored Data
- `users`
- `customer_profiles`
- `addresses`

### Preconditions
- Admin is authenticated for admin-side operations.
- Email must be unique.

### Main Flow
1. Admin opens customer management page.
2. Admin chooses create customer.
3. System validates required fields and uniqueness of email/phone where applicable.
4. System inserts a record into `users`.
5. System inserts a record into `customer_profiles`.
6. If address exists, system inserts default address into `addresses`.
7. System returns success response and customer detail view.
8. Admin may later search/filter customers by status, city, registration period, or loyalty level.
9. Admin may update customer profile and address.
10. Admin may deactivate a customer instead of hard deleting.
11. If business policy allows physical deletion, system deletes dependent address/profile records first or uses soft delete.

### Alternate / Exception Flows
- Duplicate email -> reject with validation error.
- Invalid phone format -> reject.
- Delete requested for customer with active orders -> block hard delete, suggest deactivate.

### Postconditions
- Customer profile becomes available for checkout, reporting, and analytics.

### Required Operations for DBMS Coverage
- Insert: add customer
- Update: update customer profile/status
- Delete: remove address or soft-delete customer
- Single-condition query: find customer by email
- Composite-condition query: customers by city + status
- Join query: users + customer_profiles + addresses
- Aggregate: count customers by status or city

### Suggested API/Service Modules
- `POST /admin/customers`
- `GET /admin/customers`
- `GET /admin/customers/:id`
- `PUT /admin/customers/:id`
- `DELETE /admin/customers/:id`
- `PATCH /admin/customers/:id/status`

---

## FR-02. Product Management

### Objective
Allow admin to manage product catalog, categories, brands, variants, and inventory references.

### Primary Actors
- Admin
- Warehouse Staff

### Required Data
#### Input Data
- product_name
- sku
- brand
- category
- description
- base price
- variant data (size, color, barcode)
- stock data
- reorder threshold
- product status

#### Stored Data
- `categories`
- `brands`
- `products`
- `product_variants`
- `inventory`
- `warehouses`

### Preconditions
- Brand/category should exist or be created beforehand.
- SKU and barcode should be unique.

### Main Flow
1. Admin opens product management module.
2. Admin creates or selects category and brand.
3. Admin creates a product with core information.
4. System inserts record into `products`.
5. Admin adds one or more product variants.
6. System inserts records into `product_variants`.
7. Admin initializes stock in a warehouse.
8. System inserts records into `inventory`.
9. Admin can update price, description, category, brand, or status.
10. Admin can search products by SKU, category, brand, status, or price range.
11. Admin can deactivate products no longer sold.
12. Admin can remove variants if they are unused or archived.

### Alternate / Exception Flows
- Duplicate SKU/barcode -> reject.
- Attempt to delete product that appears in order history -> restrict hard delete, switch to inactive.
- Negative price or threshold -> reject.

### Postconditions
- Product becomes visible to cart, order, promotion, and analytics modules.

### Required Operations for DBMS Coverage
- Insert: new product/variant
- Update: product info/price/status
- Delete: remove variant or archive product
- Single-condition query: find product by SKU
- Composite-condition query: products by category + active status + price range
- Join query: products + brands + categories + inventory
- Subquery: products priced above average in their category
- Aggregate: stock count per category / average price per brand

### Suggested API/Service Modules
- `POST /admin/products`
- `GET /admin/products`
- `GET /admin/products/:id`
- `PUT /admin/products/:id`
- `DELETE /admin/products/:id`
- `POST /admin/products/:id/variants`
- `PUT /admin/variants/:id`
- `GET /admin/inventory`

---

## FR-03. Order Placement

### Objective
Allow customers to create an order from cart items and store a complete transactional record.

### Primary Actors
- Customer
- System

### Required Data
#### Input Data
- customer_id
- selected cart items
- shipping address
- applied promotion codes
- shipping option
- payment method

#### Stored Data
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `inventory`
- `inventory_movements`
- `order_promotions`

### Preconditions
- Customer has an active cart.
- Cart has at least one selected item.
- Inventory is sufficient for all selected variants.
- Shipping address is valid.

### Main Flow
1. Customer reviews cart and selects checkout.
2. System loads selected cart items and latest prices.
3. System validates product availability and stock.
4. System calculates subtotal, discount, shipping fee, tax, and total.
5. Customer confirms shipping address and payment method.
6. System begins database transaction.
7. System inserts order into `orders`.
8. System inserts each selected item into `order_items`.
9. System reserves or deducts stock in `inventory`.
10. System records inventory movement in `inventory_movements`.
11. System updates cart status or marks selected items as converted.
12. System commits transaction.
13. System returns order confirmation page.

### Alternate / Exception Flows
- Stock changed during checkout -> reject or refresh cart quantities.
- Price changed since item added to cart -> recalculate and ask for confirmation.
- Transaction failure -> rollback all inserts/updates.

### Postconditions
- Order is created with full item breakdown.
- Inventory is reserved or reduced consistently.

### Required Operations for DBMS Coverage
- Insert: orders/order_items
- Update: inventory reserve and cart state
- Join query: order details with customer + items + products
- Subquery: customers whose latest order total exceeds their average order value
- Aggregate: order total quantity and revenue

### Concurrency Notes
This requirement is critical for demonstrating:
- transaction
- concurrency control
- row locking / `SELECT ... FOR UPDATE`
- rollback on failure

### Suggested API/Service Modules
- `POST /checkout/preview`
- `POST /orders`
- `GET /orders/:id`
- `GET /customers/:id/orders`

---

## FR-04. Payment Integration

### Objective
Support payment creation, confirmation, and payment status tracking.

### Primary Actors
- Customer
- Payment Gateway
- System
- Admin

### Required Data
#### Input Data
- order_id
- payment_method
- provider name
- callback payload / transaction reference
- amount
- payment result

#### Stored Data
- `payments`
- `orders`

### Preconditions
- Order exists.
- Order is in a payable state.
- Amount must match order total or allowed partial logic.

### Main Flow
1. Customer chooses payment method during checkout.
2. System creates payment intent or payment request.
3. System inserts a pending record in `payments`.
4. System redirects user to mock gateway or simulated payment page.
5. Payment gateway returns callback or frontend confirmation.
6. System validates callback data and transaction reference.
7. System updates `payments.payment_status`.
8. If successful, system updates `orders.payment_status` to paid.
9. System may also update `orders.order_status` from pending_payment to confirmed/processing.
10. Admin can review payment attempts and failed transactions.

### Alternate / Exception Flows
- Callback signature invalid -> reject callback.
- Payment failed -> mark payment as failed and keep order unpaid.
- Duplicate callback -> idempotent handling.

### Postconditions
- Payment trail is stored for audit and reporting.

### Required Operations for DBMS Coverage
- Insert: create payment record
- Update: payment status / order payment status
- Single-condition query: payment by transaction_ref
- Join query: payments + orders + customers
- Aggregate: success rate by payment method

### Suggested API/Service Modules
- `POST /payments/initiate`
- `POST /payments/callback`
- `GET /admin/payments`
- `GET /admin/payments/:id`

---

## FR-05. Cart Management

### Objective
Allow customers to create and manage shopping cart contents before placing an order.

### Primary Actors
- Customer

### Required Data
#### Input Data
- customer_id
- variant_id
- quantity
- selected_flag

#### Stored Data
- `carts`
- `cart_items`
- `product_variants`
- `inventory`

### Preconditions
- Customer must have an active cart or system creates one.
- Variant must be active.

### Main Flow
1. Customer opens product detail page.
2. Customer clicks add to cart.
3. System checks for active cart.
4. If no active cart exists, system creates one.
5. System checks whether item already exists in cart.
6. If item exists, system updates quantity.
7. Otherwise system inserts a new `cart_items` record.
8. Customer can increase/decrease quantity.
9. Customer can remove an item from cart.
10. Customer can mark items as selected for checkout.
11. System shows cart summary with subtotal and estimated discount/shipping.

### Alternate / Exception Flows
- Requested quantity exceeds available stock -> cap or reject.
- Product deactivated after being in cart -> mark unavailable.
- Cart item quantity becomes zero -> remove item.

### Postconditions
- Customer has an up-to-date cart used by checkout.

### Required Operations for DBMS Coverage
- Insert: new cart or cart item
- Update: quantity/selected flag
- Delete: remove cart item
- Single-condition query: cart by customer_id
- Composite-condition query: active selected items in a cart
- Join query: cart_items + variants + products + inventory
- Aggregate: subtotal and item count

### Suggested API/Service Modules
- `GET /cart`
- `POST /cart/items`
- `PUT /cart/items/:id`
- `DELETE /cart/items/:id`
- `PATCH /cart/items/:id/select`

---

## FR-06. Discounts and Promotions

### Objective
Allow admin to create promotions and allow customers to apply valid discount codes during checkout.

### Primary Actors
- Admin
- Customer
- System

### Required Data
#### Input Data
- promotion_code
- promotion_name
- discount type/value
- start/end time
- usage limit
- min order amount
- applicable category/product/customer tier
- cart/order context

#### Stored Data
- `promotions`
- `promotion_conditions`
- `order_promotions`
- `orders`
- `order_items`

### Preconditions
- Promotion must be active.
- Current time must be within validity window.
- Usage limit must not be exceeded.

### Main Flow
1. Admin creates a promotion campaign.
2. System inserts data into `promotions`.
3. Admin optionally configures category/product/customer conditions.
4. System stores rules in `promotion_conditions`.
5. Customer enters promotion code at cart or checkout.
6. System loads promotion and checks validity window.
7. System validates usage limit, order minimum, and applicable items/customer.
8. System calculates discount amount.
9. System shows discount preview.
10. During order creation, system persists applied promotion in `order_promotions`.
11. System increments promotion usage count when payment/order reaches valid state.

### Alternate / Exception Flows
- Expired code -> reject.
- Order total below minimum -> reject.
- Promotion not applicable to selected items -> reject.
- Multiple promotions conflict -> choose best or reject based on rule.

### Postconditions
- Discount is traceable in order detail and reports.

### Required Operations for DBMS Coverage
- Insert: promotion / condition / order_promotion
- Update: promotion status or used_count
- Delete: disable or remove unused promotion
- Composite-condition query: active promotions by date + status + min amount
- Join query: promotions + conditions + orders
- Subquery: promotions used more than average campaign usage
- Aggregate: discount amount by campaign

### Suggested API/Service Modules
- `POST /admin/promotions`
- `GET /admin/promotions`
- `PUT /admin/promotions/:id`
- `DELETE /admin/promotions/:id`
- `POST /checkout/apply-promotion`

---

## FR-07. User Behavior Analytics

### Objective
Collect and analyze high-volume user interaction events to support business insight and future optimization.

### Primary Actors
- Customer
- System
- Admin/Analyst

### Required Data
#### Input Data
- user_id or anonymous session_id
- event_type
- product_id / variant_id
- timestamp
- metadata_json
- source page / search keyword / device type

#### Stored Data
- `user_events`
- optionally derived summary tables later

### Preconditions
- Event logging endpoint or background queue is available.
- Event schema must be validated.

### Main Flow
1. Customer browses the site.
2. Frontend sends events such as product view, search, add to cart, checkout start.
3. Backend logs events into `user_events`.
4. Admin opens analytics dashboard.
5. System aggregates event counts by time, product, category, or event type.
6. System calculates conversion funnel metrics such as:
   - views
   - add-to-cart
   - checkout-start
   - purchase
7. Admin filters analytics by date range, device, category, or campaign.
8. System displays top viewed products, highest add-to-cart rate, and conversion rates.

### Alternate / Exception Flows
- Invalid event payload -> reject or log error.
- Duplicate event from retry -> optional deduplication using session + timestamp + event_type hash.

### Postconditions
- Raw behavior data exists for analytics, recommendations, and forecasting input.

### Required Operations for DBMS Coverage
- Insert: log user event
- Single-condition query: events by type
- Composite-condition query: events by type + date range + product
- Join query: user_events + products + categories
- Subquery: products with cart-add count above platform average
- Aggregate: counts, distinct sessions, conversion rates

### Suggested API/Service Modules
- `POST /events`
- `GET /admin/analytics/events-summary`
- `GET /admin/analytics/funnel`
- `GET /admin/analytics/top-products`

---

## FR-08. Inventory Forecasting

### Objective
Generate short-term demand forecasts and suggested restock quantities based on historical sales and stock movement.

### Primary Actors
- Admin
- Warehouse Staff
- System Job

### Required Data
#### Input Data
- historical order items
- inventory movements
- current stock
- reorder threshold
- lookback period
- forecast date range

#### Stored Data
- `order_items`
- `orders`
- `inventory`
- `inventory_movements`
- `forecast_snapshots`

### Preconditions
- Historical sales data exists.
- Forecast job or manual trigger exists.

### Main Flow
1. Admin selects forecast period or triggers scheduled job.
2. System extracts historical sales per variant for chosen lookback window.
3. System calculates average daily demand or another simple forecasting metric.
4. System compares predicted demand against current available stock.
5. System calculates recommended restock quantity.
6. System stores result in `forecast_snapshots`.
7. Admin reviews forecast table and filters by category, warehouse, or risk level.
8. Admin uses result for replenishment planning.

### Alternate / Exception Flows
- No historical sales -> return zero-demand or use fallback default.
- Product recently launched -> mark low-confidence forecast.

### Postconditions
- Forecast outputs are available for operational decision-making.

### Required Operations for DBMS Coverage
- Join query: orders + order_items + inventory
- Subquery: variants whose recent sales exceed their historical average
- Aggregate: avg daily sales, total sold, stock gap
- Insert: forecast snapshot
- Query with composite condition: low-stock items in selected warehouse/category

### Suggested API/Service Modules
- `POST /admin/forecast/run`
- `GET /admin/forecast`
- `GET /admin/forecast/:variantId`

### Implementation Note
A simple first version is enough:
- moving average over last 7/30 days
- recommended_restock_qty = max(predicted_demand - available_stock, 0)

---

## FR-09. Sales Reporting

### Objective
Provide business reports for revenue, order count, products sold, customer activity, and discount usage.

### Primary Actors
- Admin
- Manager

### Required Data
#### Input Data
- date range
- category / brand / warehouse filter
- order status filter
- payment method filter

#### Stored Data
- `orders`
- `order_items`
- `products`
- `product_variants`
- `customers`
- `payments`
- `order_promotions`
- optionally `sales_summary_daily`

### Preconditions
- Report filter parameters are valid.

### Main Flow
1. Admin opens reporting dashboard.
2. Admin selects time range and filters.
3. System executes reporting queries.
4. System returns metrics such as:
   - total orders
   - gross revenue
   - net revenue
   - items sold
   - average order value
   - top customers
   - top products
   - revenue by category
   - discount cost
5. Admin can switch between summary and drill-down views.
6. Admin may export results to CSV in later versions.

### Alternate / Exception Flows
- Large date range with slow query -> use summary table or pagination.
- No data in range -> return zeroed metrics.

### Postconditions
- Admin can analyze platform performance and make decisions.

### Required Operations for DBMS Coverage
- Composite-condition query: report by date range + status + payment type
- Join query: orders + items + products + payments + promotions
- Subquery: top products above average sales
- Aggregate: SUM, COUNT, AVG, MAX, DISTINCT COUNT

### Suggested API/Service Modules
- `GET /admin/reports/sales-overview`
- `GET /admin/reports/top-products`
- `GET /admin/reports/top-customers`
- `GET /admin/reports/revenue-by-category`

---

## FR-10. Order Status Management

### Objective
Track and control the order lifecycle from creation to fulfillment/cancellation/refund-related states.

### Primary Actors
- Admin
- Warehouse Staff
- Customer
- System

### Required Data
#### Input Data
- order_id
- new_status
- changed_by
- note
- payment state
- shipment state

#### Stored Data
- `orders`
- `order_status_history`
- `payments`
- optionally shipping tables later

### Preconditions
- Order exists.
- Requested status transition is valid.

### Recommended Statuses
- `pending_payment`
- `paid`
- `confirmed`
- `processing`
- `packed`
- `shipped`
- `delivered`
- `cancelled`
- `payment_failed`
- `returned`

### Main Flow
1. System creates order in initial status.
2. After successful payment, order becomes `paid` or `confirmed`.
3. Staff reviews and changes status to `processing`.
4. Staff packs order and changes status to `packed`.
5. Staff ships order and changes status to `shipped`.
6. Delivery confirmation sets status to `delivered`.
7. Each change writes a record to `order_status_history`.
8. Customer can view full status timeline.

### Alternate / Exception Flows
- Attempt to ship unpaid order -> reject unless COD rule exists.
- Cancel request after shipped -> reject or create return flow.
- Duplicate status update -> ignore or log as no-op.

### Postconditions
- Order state is auditable and reportable.

### Required Operations for DBMS Coverage
- Update: order_status
- Insert: order_status_history
- Single-condition query: orders by current status
- Composite-condition query: orders by status + date range + payment status
- Join query: orders + history + customer
- Aggregate: count orders by status / average processing time

### Suggested API/Service Modules
- `PATCH /admin/orders/:id/status`
- `GET /admin/orders`
- `GET /admin/orders/:id/status-history`

---

## 8. Mapping of Functional Requirements to Assignment Query Types

| Query/Update Type | Example Requirement Coverage |
|---|---|
| Insert | FR-01, FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-08 |
| Delete | FR-01, FR-02, FR-05, FR-06 |
| Update | FR-01, FR-02, FR-03, FR-04, FR-05, FR-06, FR-10 |
| Query with a single condition | FR-01, FR-02, FR-04, FR-05, FR-10 |
| Query with a composite condition | FR-01, FR-02, FR-06, FR-07, FR-08, FR-09, FR-10 |
| Query with a join | FR-01, FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-08, FR-09, FR-10 |
| Query with a subquery | FR-02, FR-03, FR-06, FR-07, FR-08, FR-09 |
| Query with aggregate functions | FR-01, FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-08, FR-09, FR-10 |

---

## 9. Recommended Initial Project Modules for the AI Coding Agent

### Backend Modules
- auth
- users
- customers
- addresses
- categories
- brands
- products
- variants
- inventory
- carts
- orders
- payments
- promotions
- analytics
- forecasting
- reports

### Suggested Backend Layers
- routes/controllers
- services
- repositories/data access
- DTO/request validators
- entities/models
- migrations
- seeders
- background jobs

### Suggested Frontend Pages
- login
- admin customer management
- admin product management
- product listing
- product detail
- cart
- checkout
- order history
- admin promotions
- admin analytics dashboard
- admin forecasting dashboard
- admin sales reports
- admin order management

---

## 10. Suggested Non-Functional Notes for Template Generation

1. Use soft delete where possible for auditability.
2. Add timestamps to all major tables.
3. Add indexes on:
   - email
   - sku
   - barcode
   - order_code
   - transaction_ref
   - order_status
   - payment_status
   - created_at
   - event_time
4. Use database transaction for order creation and payment confirmation updates.
5. Add row locking or stock verification logic during checkout.
6. Use pagination for list endpoints.
7. Separate admin routes from customer routes.
8. Keep analytics logging append-only for simplicity.
9. Add seed data for categories, brands, products, customers, promotions.
10. Make the first version codeable before adding advanced features.

---

## 11. Minimal Delivery Priority for the Coding Agent

### Phase 1: Core Transactional Flow
- FR-01 Customer Management
- FR-02 Product Management
- FR-05 Cart Management
- FR-03 Order Placement
- FR-04 Payment Integration
- FR-10 Order Status Management

### Phase 2: Business Features
- FR-06 Discounts and Promotions
- FR-09 Sales Reporting

### Phase 3: High-Volume / Analytics Features
- FR-07 User Behavior Analytics
- FR-08 Inventory Forecasting

---

## 12. Final Instruction for the AI Coding Agent
Generate a project template for a **PostgreSQL-based e-commerce system** with:
- modular backend structure
- REST API routes for each functional requirement
- database models/migrations for all core entities
- placeholder services for analytics and forecasting
- clear separation between admin and customer modules
- seed scripts and sample data
- room for future extension to high-volume analytics scenarios

The code template should prioritize:
- correctness of transactional flow
- clean database relationships
- easy demonstration of SQL query types required by the assignment
- enough structure so the team can implement the real application quickly
