# Databricks notebook source
import pyspark.pipelines as dp
from pyspark.sql import functions as F

source_table = spark.conf.get("source_table", "samples.tpch.orders")


@dp.table(name="bronze_orders", comment="Raw orders read from the configured source table")
def bronze_orders():
    return spark.read.table(source_table)


@dp.table(name="silver_orders", comment="Validated and normalized order records")
def silver_orders():
    return (
        dp.read("bronze_orders")
        .select(
            F.to_date("o_orderdate").alias("order_date"),
            F.col("o_orderkey").cast("long").alias("order_id"),
            F.col("o_custkey").cast("long").alias("customer_id"),
            F.col("o_totalprice").cast("decimal(18, 2)").alias("revenue"),
        )
        .filter(
            F.col("order_date").isNotNull()
            & F.col("order_id").isNotNull()
            & (F.col("revenue") >= 0)
        )
    )


@dp.table(name="gold_daily_sales", comment="Daily sales metrics consumed by the FastAPI service")
def gold_daily_sales():
    return (
        dp.read("silver_orders")
        .groupBy("order_date")
        .agg(
            F.sum("revenue").alias("revenue"),
            F.countDistinct("order_id").alias("order_count"),
            F.countDistinct("customer_id").alias("customer_count"),
        )
    )
