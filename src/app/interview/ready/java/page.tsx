import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { 
  CheckCircleIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid, TagIcon as TagIconSolid } from "@heroicons/react/24/solid";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

async function getInterviewQuestionsWithProgress() {
  const session = await getServerSession(authOptions);
  const contentDir = path.join(process.cwd(), 'src/content/interview-prep/java');
  const categories = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const questions = [];
  let userProgress: any = { completed: [], tagged: [] };

  if (session?.user?.email) {
    const db = await getDb();
    const progressDoc = await db.collection('progress').findOne({ email: session.user.email });
    if (progressDoc?.java) {
      userProgress = progressDoc.java;
    }
  }

  for (const category of categories) {
    const categoryDir = path.join(contentDir, category);
    const files = fs.readdirSync(categoryDir).filter(file => file.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      const slug = file.replace('.md', '');
      
      questions.push({
        slug,
        category,
        title: data.title || slug,
        order: data.order || 99,
        isCompleted: userProgress.completed?.includes(slug) || false,
        isTagged: userProgress.tagged?.includes(slug) || false,
      });
    }
  }

  // Group by category and sort
  const grouped = questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  for (const cat in grouped) {
    grouped[cat].sort((a, b) => a.order - b.order);
  }

  return grouped;
}

export default async function JavaInterviewListingPage() {
  const groupedQuestions = await getInterviewQuestionsWithProgress();
  const categories = Object.keys(groupedQuestions).sort();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Compact */}
        <div className="mb-12 border-b border-border pb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tighter mb-3">
                Java Interview Prep
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Master the backend, one topic at a time.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/20" />
                Mastered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/20" />
                Revision
              </div>
            </div>
          </div>
        </div>

        {/* Categories List - Premium Minimalist Layout */}
        <div className="space-y-16">
          {categories.map((category) => (
            <section key={category}>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 mb-8 pb-3 border-b border-primary/5 flex items-center justify-between">
                <span>{category}</span>
                <span className="text-[10px] font-black text-muted-foreground/30">
                  {groupedQuestions[category].filter(q => q.isCompleted).length} / {groupedQuestions[category].length}
                </span>
              </h2>

              <ul className="space-y-2">
                {groupedQuestions[category].map((question) => (
                  <li key={question.slug}>
                    <Link 
                      href={`/interview/ready/java/${category}/${question.slug}`}
                      className={`group flex items-center justify-between py-3.5 px-6 rounded-2xl transition-all border border-transparent ${
                        question.isCompleted
                          ? 'bg-green-500/[0.02] hover:bg-green-500/[0.05] hover:border-green-500/20'
                          : 'hover:bg-card hover:border-border'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`transition-all duration-300 ${
                          question.isCompleted ? 'text-green-500 scale-110' : 'text-muted-foreground/20'
                        }`}>
                          {question.isCompleted ? (
                            <CheckCircleSolid className="w-6 h-6" />
                          ) : (
                            <CheckCircleIcon className="w-6 h-6" />
                          )}
                        </div>
                        <span className={`text-base font-bold transition-all duration-300 ${
                          question.isCompleted 
                            ? 'text-foreground/50 line-through decoration-green-500/20' 
                            : 'text-foreground/80 group-hover:text-primary'
                        }`}>
                          {question.title}
                        </span>
                      </div>

                      {/* DB Tags in listing */}
                      <div className="flex gap-2">
                        {question.isTagged && (
                          <div className="text-amber-500/80 p-1">
                            <TagIconSolid className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

      </div>
    </div>
  );
}
