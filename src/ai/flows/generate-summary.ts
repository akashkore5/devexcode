'use server';

/**
 * @fileOverview Generates a summary for a blog post using AI.
 *
 * - generateSummary - A function that generates a summary for a blog post.
 * - GenerateSummaryInput - The input type for the generateSummary function.
 * - GenerateSummaryOutput - The return type for the generateSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSummaryInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  content: z.string().describe('The content of the blog post.'),
  tags: z.array(z.string()).optional().describe('Optional tags associated with the blog post.'),
});
export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

const GenerateSummaryOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the blog post.'),
  progress: z.string().describe('Progress of the AI generation.'),
});
export type GenerateSummaryOutput = z.infer<typeof GenerateSummaryOutputSchema>;

export async function generateSummary(input: GenerateSummaryInput): Promise<GenerateSummaryOutput> {
  return generateSummaryFlow(input);
}

const generateSummaryPrompt = ai.definePrompt({
  name: 'generateSummaryPrompt',
  input: {schema: GenerateSummaryInputSchema},
  output: {schema: GenerateSummaryOutputSchema},
  prompt: `You are an expert blog post summarizer. Your goal is to create a concise and engaging summary of a blog post.

Title: {{{title}}}
Content: {{{content}}}

{{#if tags}}
Tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Include relevant tags in the summary if they enhance understanding.
{{/if}}

Summary:`,
});

const generateSummaryFlow = ai.defineFlow(
  {
    name: 'generateSummaryFlow',
    inputSchema: GenerateSummaryInputSchema,
    outputSchema: GenerateSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateSummaryPrompt(input);
    return {
      ...output!,
      progress: 'Generated a short summary of the blog post.',
    };
  }
);
