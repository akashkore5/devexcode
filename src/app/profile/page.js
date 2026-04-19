import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ProfileClient from "./ProfileClient";
import problems from "../../data/problems.json";
import systemDesignQuestions from "../../data/system_design_questions.json";
import learn10Questions from "../../data/10min_topics.json";
import devTipsData from "../../data/micro_dev_tips.json";
import techBattlesData from "../../data/tech_battles.json";
import gfgProblems from "../../data/gfgproblems.json";

export const metadata = {
  title: "Your Profile | DevExCode",
  description: "Track your progress on Leetcode, system design, and more with DevExCode.",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const validateTotal = (data) => {
    return Array.isArray(data) && data.every(item => item && (typeof item.id === "number" || typeof item.id === "string")) ? data.length : 0;
  };

  const props = {
    totalLeetcodeQuestions: validateTotal(problems),
    totalSystemDesignQuestions: validateTotal(systemDesignQuestions),
    totalLearn10Questions: validateTotal(learn10Questions),
    totalDevTips: validateTotal(devTipsData),
    totalTechBattles: validateTotal(techBattlesData),
    totalGfgProblems: validateTotal(gfgProblems),
  };

  return <ProfileClient {...props} />;
}
