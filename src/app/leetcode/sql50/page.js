import sql50 from "../../../data/sql50.json";
import SQL50Client from "./SQL50Client";

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "SQL 50 Study Plan - Database Interview Mastery | DevExCode",
  description: "Master the top 50 SQL questions to ace database and data engineering interviews. Comprehensive queries for Joins, Aggregations, Window Functions, and Subqueries.",
  canonicalPath: "/leetcode/sql50",
  keywords: ["sql 50", "sql interview", "database queries", "leetcode sql", "devexcode"],
});

export default async function SQL50Page() {
  const totalQuestions = sql50.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  return <SQL50Client sql50={{ sections: sql50 }} totalQuestions={totalQuestions} />;
}