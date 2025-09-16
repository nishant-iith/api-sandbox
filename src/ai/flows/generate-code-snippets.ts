'use server';

/**
 * @fileOverview A code snippet generation AI agent.
 *
 * - generateCodeSnippet - A function that handles the code snippet generation process.
 * - GenerateCodeSnippetInput - The input type for the generateCodeSnippet function.
 * - GenerateCodeSnippetOutput - The return type for the generateCodeSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeSnippetInputSchema = z.object({
  method: z.string().describe('The HTTP method (GET, POST, PUT, PATCH, DELETE).'),
  url: z.string().describe('The API endpoint URL.'),
  headers: z.string().optional().describe('The request headers in JSON format.'),
  body: z.string().optional().describe('The request body in JSON format.'),
  codeLanguage: z.string().describe('The target programming language for the code snippet (e.g., JavaScript, Python, cURL).'),
  library: z.string().optional().describe('The library or tool to use for the code snippet (e.g., fetch, axios, cURL).'),
});
export type GenerateCodeSnippetInput = z.infer<typeof GenerateCodeSnippetInputSchema>;

const GenerateCodeSnippetOutputSchema = z.object({
  codeSnippet: z.string().describe('The generated code snippet for the API request.'),
});
export type GenerateCodeSnippetOutput = z.infer<typeof GenerateCodeSnippetOutputSchema>;

export async function generateCodeSnippet(input: GenerateCodeSnippetInput): Promise<GenerateCodeSnippetOutput> {
  return generateCodeSnippetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodeSnippetPrompt',
  input: {schema: GenerateCodeSnippetInputSchema},
  output: {schema: GenerateCodeSnippetOutputSchema},
  prompt: `You are a code generation expert, specializing in generating code snippets for making API requests in various programming languages and libraries.

  Given the following API request details, generate a code snippet in the specified language and library to execute the request.

  HTTP Method: {{{method}}}
  URL: {{{url}}}
  Headers: {{{headers}}}
  Body: {{{body}}}
  Language: {{{codeLanguage}}}
  Library: {{{library}}}

  Ensure the generated code is functional, efficient, and adheres to best practices for the specified language and library. Handle potential errors gracefully and include necessary imports or dependencies.
  Output only the code snippet in a code block, without any additional explanations or comments outside the code block.`,
});

const generateCodeSnippetFlow = ai.defineFlow(
  {
    name: 'generateCodeSnippetFlow',
    inputSchema: GenerateCodeSnippetInputSchema,
    outputSchema: GenerateCodeSnippetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
