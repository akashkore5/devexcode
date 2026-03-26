import sql50 from "../../../data/sql50.json";
import SQL50Client from "./SQL50Client";

export const metadata = {
  title: "SQL 50 Study Plan - DevExCode",
  description: "Master the top 50 SQL questions to ace database interviews. Organized by topics like Select, Joins, and Aggregations.",
};

export default async function SQL50Page() {
  const totalQuestions = sql50.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  return <SQL50Client sql50={{ sections: sql50 }} totalQuestions={totalQuestions} />;
}