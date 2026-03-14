import { DataService } from "@/lib/data-service";
import Learn10Client from "./Learn10Client";

export default async function Learn10Page() {
  const topics = await DataService.getLearn10Topics();
  const categories = await DataService.getLearn10Categories();
  
  return <Learn10Client initialTopics={topics} categories={categories} />;
}
