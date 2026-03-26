import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import MCQChallengeClient from "./MCQChallengeClient";
import mcqTopics from "../../../data/mcq_topics.json";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const topic = mcqTopics.find((t) => t.slug === slug);
  
  if (!topic) return { title: "MCQ Challenge | DevExCode" };
  
  return {
    title: `${topic.title} Challenge | DevExCode`,
    description: `Test your skills with multiple-choice questions on ${topic.title}. Prepare for interviews with DevExCode.`,
  };
}

export default async function MCQChallengePage({ params }) {
  const { slug } = await params;
  const topic = mcqTopics.find((t) => t.slug === slug);
  
  if (!topic) {
    notFound();
  }

  const dataPath = path.join(process.cwd(), "src", "data", "mcq", `${slug}_mcq.json`);
  let initialQuestions = [];
  
  try {
    const fileContent = fs.readFileSync(dataPath, "utf8");
    initialQuestions = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading MCQ data for ${slug}:`, error);
    // If no specific file, return empty array to client to show error
  }

  return <MCQChallengeClient topic={topic} initialQuestions={initialQuestions} />;
}
