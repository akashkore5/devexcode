import Link from "next/link";
import { 
  BookOpenIcon, 
  MapIcon, 
  CommandLineIcon, 
  CpuChipIcon,
  CircleStackIcon,
  AcademicCapIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import LearningPathsClient from "./LearningPathsClient";

// Import configurations (simulating what was in index.js)
const paths = [
  { title: "Java Path", slug: "java", desc: "Master core Java, JVM, and Spring ecosystem.", topics: 24, difficulty: "Beginner" },
  { title: "Database Path", slug: "databases", desc: "Relational, NoSQL, and Query Optimization.", topics: 18, difficulty: "Advanced" },
  { title: "React Path", slug: "react", desc: "Modern frontend with Hooks, Context, and Performance.", topics: 15, difficulty: "Intermediate" },
  { title: "Python Path", slug: "python", desc: "Scripting, Automation, and Data Engineering.", topics: 22, difficulty: "Beginner" },
  { title: "JS/TS Path", slug: "typescript", desc: "Type-safe modern web architectures.", topics: 30, difficulty: "Intermediate" },
  { title: "C++ Path", slug: "cpp", desc: "System level programming and memory management.", topics: 12, difficulty: "Advanced" },
  { title: "Go Path", slug: "go", desc: "Concurrent cloud-native services in Go.", topics: 14, difficulty: "Intermediate" },
  { title: "Node.js Path", slug: "nodejs", desc: "Scalable backend systems with Node.", topics: 19, difficulty: "Advanced" },
  { title: "Algorithms Path", slug: "dsa", desc: "Cracking the technical coding interview.", topics: 45, difficulty: "Hard" },
];

export default async function LearningPathsPage() {
  // In a real app, calculate topic counts from JSON here
  return <LearningPathsClient paths={paths} />;
}
