import problems from "../data/problems.json";
import systemDesignQuestions from "../data/system_design_questions.json";
import learn10Topics from "../data/10min_topics.json";

export type Problem = {
  id: string | number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Beginner" | "Intermediate" | "Advanced";
  tags?: string[];
  url?: string;
  category?: string;
  question?: string;
};

const getLearn10Category = (id: number) => {
  if (id <= 10 || (id >= 101 && id <= 110) || (id >= 201 && id <= 210)) return "System Design";
  if ((id >= 11 && id <= 20) || (id >= 211 && id <= 220)) return "Databases";
  if (id >= 221 && id <= 230) return "LLM/AI Tools";
  if (id >= 231 && id <= 240) return "Dev Tools";
  if (id >= 241 && id <= 250) return "Backend Frameworks";
  if (id >= 251 && id <= 260) return "Frontend & Design";
  if (id >= 261 && id <= 270) return "API Design";
  if (id >= 271 && id <= 280) return "Debugging & Monitoring";
  if (id >= 281 && id <= 290) return "Cloud Native & Kubernetes";
  if (id >= 291 && id <= 300) return "Computer Science";
  if ((id >= 111 && id <= 120) || (id >= 171 && id <= 180)) return "API Design";
  if (id >= 121 && id <= 130) return "System Design";
  if ((id >= 131 && id <= 140) || (id >= 161 && id <= 170)) return "Computer Science";
  if (id >= 141 && id <= 150) return "Databases";
  if (id >= 151 && id <= 160) return "Frontend & Design";
  if (id >= 181 && id <= 190) return "Debugging & Monitoring";
  if (id >= 191 && id <= 200) return "Computer Science";
  return "System Design";
};

export const DataService = {
  getProblems: async (): Promise<Problem[]> => {
    return (problems as any[]).map(p => ({
      ...p,
      title: p.title || p.question || `Problem ${p.id}`
    }));
  },

  getSystemDesignQuestions: async (): Promise<Problem[]> => {
    return (systemDesignQuestions as any[]).map(q => ({
      ...q,
      title: q.title || q.question || `System Design ${q.id}`
    }));
  },

  getLearn10Topics: async (): Promise<Problem[]> => {
    return (learn10Topics as any[]).map(t => ({
      ...t,
      title: t.question,
      category: getLearn10Category(Number(t.id))
    }));
  },

  getProblemById: async (id: string | number): Promise<Problem | undefined> => {
    const all = await DataService.getProblems();
    return all.find(p => p.id.toString() === id.toString());
  },

  getSystemDesignQuestionById: async (id: string | number): Promise<Problem | undefined> => {
    const all = await DataService.getSystemDesignQuestions();
    return all.find(q => q.id.toString() === id.toString());
  },

  getLearn10TopicById: async (id: string | number): Promise<Problem | undefined> => {
    const all = await DataService.getLearn10Topics();
    return all.find(t => t.id.toString() === id.toString());
  },

  getTags: async (): Promise<string[]> => {
    const all = await DataService.getProblems();
    const tags = new Set<string>();
    all.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  },

  getSystemDesignTags: async (): Promise<string[]> => {
    const all = await DataService.getSystemDesignQuestions();
    const tags = new Set<string>();
    all.forEach(q => q.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  },

  getLearn10Categories: async (): Promise<string[]> => {
    const all = await DataService.getLearn10Topics();
    const categories = new Set<string>();
    all.forEach(t => { if (t.category) categories.add(t.category); });
    return Array.from(categories).sort();
  }
};
