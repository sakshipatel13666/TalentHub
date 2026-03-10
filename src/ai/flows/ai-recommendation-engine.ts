'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized recommendations for talents and workshops.
 *
 * - recommendTalentsAndWorkshops - A function that handles the recommendation process.
 * - AiRecommendationEngineInput - The input type for the recommendTalentsAndWorkshops function.
 * - AiRecommendationEngineOutput - The return type for the recommendTalentsAndWorkshops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AiRecommendationEngineInputSchema = z.object({
  userId: z.string().describe('The unique identifier of the user requesting recommendations.'),
  pastInteractions: z.array(z.object({
    type: z.enum(['viewedTalent', 'hiredTalent', 'enrolledWorkshop', 'viewedWorkshop']),
    id: z.string().describe('The ID of the talent or workshop interacted with.'),
    name: z.string().describe('The name of the talent or workshop interacted with.'),
    category: z.string().optional().describe('The primary category of the talent or workshop.'),
  })).describe('A list of the user\'s past interactions with talents or workshops.'),
  searchHistory: z.array(z.string()).describe('A list of keywords or queries the user has searched for.'),
  preferences: z.array(z.string()).describe('User-defined explicit preferences or interests.'),
});
export type AiRecommendationEngineInput = z.infer<typeof AiRecommendationEngineInputSchema>;

// Output Schema
const AiRecommendationEngineOutputSchema = z.object({
  recommendedTalents: z.array(z.object({
    id: z.string().describe('The ID of the recommended talent.'),
    name: z.string().describe('The name of the recommended talent.'),
    skills: z.array(z.string()).describe('Key skills of the talent.'),
    bioSnippet: z.string().optional().describe('A brief snippet from the talent\'s bio highlighting their expertise.'),
    category: z.string().optional().describe('The primary category of the talent (e.g., "Music", "Coding", "Design").'),
  })).describe('A list of recommended talent profiles.'),
  recommendedWorkshops: z.array(z.object({
    id: z.string().describe('The ID of the recommended workshop.'),
    title: z.string().describe('The title of the recommended workshop.'),
    skillCategory: z.string().describe('The skill category of the workshop.'),
    descriptionSnippet: z.string().optional().describe('A brief snippet from the workshop\'s description.'),
  })).describe('A list of recommended workshops.'),
});
export type AiRecommendationEngineOutput = z.infer<typeof AiRecommendationEngineOutputSchema>;

export async function recommendTalentsAndWorkshops(input: AiRecommendationEngineInput): Promise<AiRecommendationEngineOutput> {
  return aiRecommendationEngineFlow(input);
}

const recommendationPrompt = ai.definePrompt({
  name: 'recommendationPrompt',
  input: {schema: AiRecommendationEngineInputSchema},
  output: {schema: AiRecommendationEngineOutputSchema},
  prompt: `You are a personalized recommendation engine for TalentHub.
Your goal is to suggest relevant talents for hiring and workshops for enrollment based on the user's provided data.
Consider their past interactions, search history, and explicit preferences to provide highly relevant suggestions.

User ID: {{{userId}}}

Past Interactions:
{{#if pastInteractions}}
  {{#each pastInteractions}}
    - Type: {{type}}, ID: {{id}}, Name: {{name}}{{#if category}}, Category: {{category}}{{/if}}
  {{/each}}
{{else}}
  No past interactions.
{{/if}}

Search History:
{{#if searchHistory}}
  {{#each searchHistory}}
    - "{{{this}}}"
  {{/each}}
{{else}}
  No search history.
{{/if}}

User Preferences:
{{#if preferences}}
  {{#each preferences}}
    - "{{{this}}}"
  {{/each}}
{{else}}
  No explicit preferences.
{{/if}}

Based on the above information, generate a list of recommended talents and workshops.
For talents, suggest 3-5 distinct individuals.
For workshops, suggest 2-4 distinct workshops.
Ensure the recommendations are diverse yet relevant.
Output your recommendations strictly in the JSON format defined by the output schema, without any additional text or explanations.`,
});

const aiRecommendationEngineFlow = ai.defineFlow(
  {
    name: 'aiRecommendationEngineFlow',
    inputSchema: AiRecommendationEngineInputSchema,
    outputSchema: AiRecommendationEngineOutputSchema,
  },
  async (input) => {
    const {output} = await recommendationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate recommendations.');
    }
    return output;
  }
);
