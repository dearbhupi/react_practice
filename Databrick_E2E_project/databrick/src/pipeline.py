# Databricks notebook source
import pyspark.pipelines as dp
from pyspark.sql import functions as F

source_table = spark.conf.get(
    "source_table", "workspace.default.fieldnote_sales_source"
)


@dp.table(name="bronze_orders", comment="Raw orders read from the configured source table")
def bronze_orders():
    return spark.read.table(source_table).select(
        F.to_date("order_date").alias("order_date"),
        F.col("revenue").cast("decimal(18, 2)").alias("revenue"),
        F.col("order_count").cast("long").alias("order_count"),
        F.col("customer_count").cast("long").alias("customer_count"),
    )


@dp.table(name="silver_orders", comment="Validated and normalized order records")
def silver_orders():
    return (
        dp.read("bronze_orders")
        .filter(
            F.col("order_date").isNotNull()
            & (F.col("revenue") >= 0)
            & (F.col("order_count") >= 0)
            & (F.col("customer_count") >= 0)
        )
    )


@dp.table(name="gold_daily_sales", comment="Daily sales metrics consumed by the FastAPI service")
def gold_daily_sales():
    return (
        dp.read("silver_orders")
        .groupBy("order_date")
        .agg(
            F.sum("revenue").alias("revenue"),
            F.sum("order_count").alias("order_count"),
            F.sum("customer_count").alias("customer_count"),
        )
    )
