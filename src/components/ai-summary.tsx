'use client';
import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateSummary } from '@/ai/flows/generate-summary';
import type { GenerateSummaryInput, GenerateSummaryOutput } from '@/ai/flows/generate-summary';
import type { PostData } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function AiSummary({ post }: { post: PostData }) {
  const [summaryResult, setSummaryResult] = useState<GenerateSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummaryResult(null);
    try {
      const input: GenerateSummaryInput = {
        title: post.title,
        content: post.content,
        tags: post.tags,
      };
      const result = await generateSummary(input);
      if (result.summary) {
        setSummaryResult(result);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not generate a summary for this post.",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while generating the summary.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 bg-card/70 border-accent/20 border-dashed">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2 font-headline text-accent">
                    <Wand2 />
                    AI-Powered Summary
                </CardTitle>
                <CardDescription>Get a quick overview of this article.</CardDescription>
            </div>
            {!summaryResult && (
                 <Button onClick={handleGenerateSummary} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Summary'}
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-2">
                <div className="animate-pulse bg-muted-foreground/20 h-4 w-full rounded-md"></div>
                <div className="animate-pulse bg-muted-foreground/20 h-4 w-5/6 rounded-md"></div>
                <div className="animate-pulse bg-muted-foreground/20 h-4 w-3/4 rounded-md"></div>
            </div>
        )}
        {summaryResult?.summary && <p className="whitespace-pre-wrap text-foreground/90">{summaryResult.summary}</p>}
      </CardContent>
    </Card>
  );
}
