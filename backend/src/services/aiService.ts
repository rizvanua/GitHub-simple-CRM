interface AICommentRequest {
    repositoryName: string;
    owner: string;
    description?: string;
    language?: string;
    stars: number;
    forks: number;
    openIssues: number;
    isPrivate?: boolean;
    isArchived?: boolean;
  }  

  interface GeminiCandidate {
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }
  
  interface GeminiResponse {
    candidates: GeminiCandidate[];
  }
  
  export class AIService {
    private geminiApiKey: string;  
    private geminiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  
    constructor() {
      this.geminiApiKey = process.env['GEMINI_API_KEY'] || '';
    }
  
    async generateProjectComment(repoData: AICommentRequest): Promise<string> {    
    this.geminiApiKey = process.env['GEMINI_API_KEY'] || '';
    if (!this.geminiApiKey) {
      console.warn('GEMINI_API_KEY not found. AI comments will be disabled.');
    }
    try {
        const prompt = this.buildPrompt(repoData);
        console.info('prompt', prompt);
        
        const response = await fetch(`${this.geminiBaseUrl}/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              maxOutputTokens: 150,
              temperature: 0.7,
            }
          }),
        });
  
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API error:', response.status, errorText);
          throw new Error(`Gemini API error: ${response.status}`);
        }
  
        const data = await response.json() as GeminiResponse;
        const comment = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        
        if (comment) {
          return comment;
        } else {
          return this.generateFallbackComment(repoData);
        }
      } catch (error) {
        console.error('Error generating AI comment:', error);
        return this.generateFallbackComment(repoData);
      }   
    }
  
    private buildPrompt(repoData: AICommentRequest): string {
        console.info('repoData', repoData);
      const { repositoryName, owner, description, language, stars, forks, openIssues, isPrivate, isArchived } = repoData;
      
      let prompt = `Generate a short comment about the GitHub repository "${owner}/${repositoryName}".`;
      
      if (description) {
        prompt += ` Description: ${description}`;
      }
      
      if (language) {
        prompt += ` Primary language: ${language}`;
      }
      
      prompt += ` Stats: ${stars} stars, ${forks} forks, ${openIssues} open issues.`;
      
      if (isPrivate) {
        prompt += ' This is a private repository.';
      }
      
      if (isArchived) {
        prompt += ' This repository is archived.';
      }
      
      prompt += ' Write a brief, engaging comment that highlights what makes this project interesting.';
      
      return prompt;
    }
  
    private generateFallbackComment(repoData: AICommentRequest): string {
      const { repositoryName, owner, language, stars } = repoData;
      
      let comment = `${owner}/${repositoryName}`;
      
      if (language) {
        comment += ` - ${language} project`;
      }
      
      if (stars > 1000) {
        comment += ` with ${stars.toLocaleString()} stars`;
      } else if (stars > 100) {
        comment += ` (${stars} stars)`;
      }
      
      return comment;
    }
  
    isAvailable(): boolean {
      return !!this.geminiApiKey;
    }
  }
  
  export const aiService = new AIService();


