import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { 
  CodeBracketIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";

async function getPracticeItems() {
  const contentDir = path.join(process.cwd(), 'src/content/practice/java');
  
  if (!fs.existsSync(contentDir)) {
    return {};
  }

  const categories = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const items = [];

  for (const category of categories) {
    const categoryDir = path.join(contentDir, category);
    const files = fs.readdirSync(categoryDir).filter(file => file.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      const slug = file.replace('.md', '');
      
      items.push({
        slug,
        category,
        title: data.title || slug,
        order: data.order || 99,
      });
    }
  }

  // Group by category and sort
  const grouped = items.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  for (const cat in grouped) {
    grouped[cat].sort((a, b) => a.order - b.order);
  }

  return grouped;
}

export default async function JavaPracticeListingPage() {
  const groupedItems = await getPracticeItems();
  const categories = Object.keys(groupedItems).sort();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-border pb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tighter mb-3">
                Java Code Practice
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Deep dive into execution flows and core concepts through practical examples.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-6">
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                  <CodeBracketIcon className="w-6 h-6" />
               </div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-16">
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No practice items found. Add some in src/content/practice/java!</p>
            </div>
          ) : (
            categories.map((category) => (
              <section key={category}>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 mb-8 pb-3 border-b border-primary/5 flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-[10px] font-black text-muted-foreground/30">
                    {groupedItems[category].length} Items
                  </span>
                </h2>

                <ul className="grid grid-cols-1 gap-4">
                  {groupedItems[category].map((item) => (
                    <li key={item.slug}>
                      <Link 
                        href={`/practice/java/${category}/${item.slug}`}
                        className="group flex items-center justify-between py-5 px-8 rounded-[32px] transition-all border border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary/40 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
                            <span className="text-xs font-black">{item.order}</span>
                          </div>
                          <span className="text-lg font-bold text-foreground/80 group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                           <Badge variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full px-4 py-1 text-[10px] font-black tracking-widest uppercase border-primary/20 text-primary">
                              PRACTICE NOW
                           </Badge>
                           <ChevronRightIcon className="w-5 h-5 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
