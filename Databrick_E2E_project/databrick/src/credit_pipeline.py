# Databricks notebook source
import pyspark.pipelines as dp
from pyspark.sql import functions as F

credit_source_table = spark.conf.get(
    "credit_source_table", "workspace.default.german_credit_data"
)


@dp.table(
    name="bronze_credit_applications",
    comment="Raw German credit applications from the configured source table",
)
def bronze_credit_applications():
    source = spark.read.table(credit_source_table)
    source_columns = {
        "Age": "age",
        "Sex": "sex",
        "Job": "job",
        "Housing": "housing",
        "Saving accounts": "saving_accounts",
        "Checking account": "checking_account",
        "Credit amount": "credit_amount",
        "Duration": "duration",
        "Purpose": "purpose",
        "Risk": "risk",
    }
    return source.select(
        *(F.col(source_name).alias(target_name) for source_name, target_name in source_columns.items())
    )


@dp.table(
    name="silver_credit_applications",
    comment="Cleaned credit amount, duration, purpose, and historical risk label",
)
def silver_credit_applications():
    source = dp.read("bronze_credit_applications")
    return (
        source.select(
            F.col("credit_amount").cast("double").alias("credit_amount"),
            F.col("duration").cast("int").alias("duration"),
            F.lower(F.trim(F.col("purpose"))).alias("purpose"),
            F.lower(F.trim(F.col("risk"))).alias("risk"),
        )
        .filter(
            (F.col("credit_amount") > 0)
            & (F.col("duration") > 0)
            & F.col("purpose").isNotNull()
            & F.col("risk").isin("good", "bad")
        )
        .withColumn(
            "duration_band",
            F.when(F.col("duration") <= 12, "Short · 1–12 mo")
            .when(F.col("duration") <= 36, "Medium · 13–36 mo")
            .otherwise("Long · 37+ mo"),
        )
    )


@dp.table(
    name="gold_credit_summary",
    comment="Overall application count and descriptive historical risk metrics",
)
def gold_credit_summary():
    risk_flag = F.when(F.col("risk") == "bad", 1.0).otherwise(0.0)
    return dp.read("silver_credit_applications").agg(
        F.count("*").alias("application_count"),
        F.sum(F.when(F.col("risk") == "good", 1).otherwise(0)).alias("good_count"),
        F.sum(F.when(F.col("risk") == "bad", 1).otherwise(0)).alias("bad_count"),
        F.round(F.avg(risk_flag), 4).alias("bad_rate"),
        F.round(F.avg("credit_amount"), 2).alias("avg_credit_amount"),
        F.round(F.avg("duration"), 1).alias("avg_duration"),
    )


@dp.table(
    name="gold_credit_by_purpose",
    comment="Historical risk-label rates grouped by stated loan purpose",
)
def gold_credit_by_purpose():
    return (
        dp.read("silver_credit_applications")
        .groupBy("purpose")
        .agg(
            F.count("*").alias("application_count"),
            F.sum(F.when(F.col("risk") == "bad", 1).otherwise(0)).alias("bad_count"),
            F.round(F.avg(F.when(F.col("risk") == "bad", 1.0).otherwise(0.0)), 4).alias("bad_rate"),
        )
    )


@dp.table(
    name="gold_credit_by_duration",
    comment="Historical risk-label rates grouped by loan-duration band",
)
def gold_credit_by_duration():
    return (
        dp.read("silver_credit_applications")
        .groupBy("duration_band")
        .agg(
            F.count("*").alias("application_count"),
            F.sum(F.when(F.col("risk") == "bad", 1).otherwise(0)).alias("bad_count"),
            F.round(F.avg(F.when(F.col("risk") == "bad", 1.0).otherwise(0.0)), 4).alias("bad_rate"),
        )
    )