'use server';
/**
 * @fileOverview An AI content assistant for TalentHub. This flow helps Talent Creators generate compelling
 * bios, portfolio descriptions, service offerings, workshop titles, and workshop descriptions.
 *
 * - aiContentAssistant - A function that handles the AI content generation process.
 * - AiContentAssistantInput - The input type for the aiContentAssistant function.
 * - AiContentAssistantOutput - The return type for the aiContentAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiContentAssistantInputSchema = z.object({
  contentType: z
    .enum([
      'bio',
      'portfolio_description',
      'service_offering',
      'workshop_title',
      'workshop_description',
    ])
    .describe('The type of content to generate or refine.'),
  context: z
    .string()
    .describe(
      'Key information, skills, experience, or topic related to the content.'
    ),
  currentText: z
    .string()
    .optional()
    .describe('Existing text to be refined or expanded.'),
  desiredLength: z
    .enum(['short', 'medium', 'long'])
    .optional()
    .describe('Desired length of the generated content.'),
  keywords: z
    .array(z.string())
    .optional()
    .describe('Specific keywords to include in the content.'),
});
export type AiContentAssistantInput = z.infer<
  typeof AiContentAssistantInputSchema
>;

const AiContentAssistantOutputSchema = z.object({
  generatedContent: z.string().describe('The AI-generated content.'),
});
export type AiContentAssistantOutput = z.infer<
  typeof AiContentAssistantOutputSchema
>;

export async function aiContentAssistant(
  input: AiContentAssistantInput
): Promise<AiContentAssistantOutput> {
  return aiContentAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiContentAssistantPrompt',
  input: {schema: AiContentAssistantInputSchema},
  output: {schema: AiContentAssistantOutputSchema},
  prompt: `You are an expert content creator for the TalentHub platform, specializing in crafting engaging, professional, and keyword-rich descriptions for talent profiles and workshops.

Your task is to generate or refine content based on the provided input.

Content Type: {{{contentType}}}

Context: {{{context}}}

{{#if currentText}}
Existing Text to Refine: {{{currentText}}}
Instruction: Refine and enhance the existing text, making it more engaging and keyword-rich.
{{else}}
Instruction: Generate new content from scratch.
{{/if}}

{{#if desiredLength}}
Desired Length: Make the content {{{desiredLength}}}.
{{/if}}

{{#if keywords}}
Keywords to include: {{#each keywords}}'{{{this}}}' {{/each}}
{{/if}}

Ensure the generated content is compelling, professional, and optimized to attract clients and students on a talent marketplace and learning platform.

Focus on the user's skills, experience, value proposition, or workshop benefits. Use clear, concise, and persuasive language.`,
});

const aiContentAssistantFlow = ai.defineFlow(
  {
    name: 'aiContentAssistantFlow',
    inputSchema: AiContentAssistantInputSchema,
    outputSchema: AiContentAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate content. Output was null or undefined.');
    }
    return output;
  }
);
