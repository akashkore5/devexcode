import { HomePage } from "@/components/HomePage";
import problems from "@/data/problems.json";
import systemDesignQuestions from "@/data/system_design_questions.json";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  let session = null;
  let serverError = false;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Home Page: Failed to fetch session:", (error as Error).message);
    serverError = true;
  }
  
  return (
    <HomePage 
      initialLoggedIn={!!session}
      initialName={session?.user?.name || ""}
      totalLeetcodeQuestions={problems.length}
      totalSystemDesignQuestions={systemDesignQuestions.length}
      serverError={serverError}
    />
  );
}
