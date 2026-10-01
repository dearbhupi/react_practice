CREATE TABLE IF NOT EXISTS workspace.default.fieldnote_sales_source AS
SELECT
  date_sub(current_date(), CAST(day_offset AS INT)) AS order_date,
  CAST(revenue AS DECIMAL(18, 2)) AS revenue,
  CAST(order_count AS INT) AS order_count,
  CAST(customer_count AS INT) AS customer_count
FROM VALUES
  (6, 1840.0, 18, 18),
  (5, 2360.0, 23, 23),
  (4, 1980.0, 20, 20),
  (3, 3120.0, 29, 29),
  (2, 2750.0, 26, 26),
  (1, 3580.0, 34, 34),
  (0, 4210.0, 39, 39)
AS sales(day_offset, revenue, order_count, customer_count);