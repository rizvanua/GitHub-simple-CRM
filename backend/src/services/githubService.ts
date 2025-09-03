interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  description: string;
  language: string;
  default_branch: string;
  private: boolean;
  archived: boolean;
  disabled: boolean;
}

export interface RepositoryData {
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: number;
  githubPath: string;
  description?: string;
  language?: string;
  defaultBranch?: string;
  isPrivate?: boolean;
  isArchived?: boolean;
  isDisabled?: boolean;
}

export class GitHubService {
  private baseUrl = 'https://api.github.com';

  async getRepositoryData(repoPath: string): Promise<RepositoryData> {
    try {
      // Validate repository path format
      if (!this.isValidRepoPath(repoPath)) {
        throw new Error('Invalid repository path format. Expected format: owner/repository');
      }

      const url = `${this.baseUrl}/repos/${repoPath}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Simple-CRM-App'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Repository not found. Please check the repository path.');
        } else if (response.status === 403) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
      }

      const repo = await response.json() as GitHubRepository;

      return {
        owner: repo.owner.login,
        name: repo.name,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        createdAt: new Date(repo.created_at).getTime(),
        githubPath: repo.full_name,
        description: repo.description,
        language: repo.language,
        defaultBranch: repo.default_branch,
        isPrivate: repo.private,
        isArchived: repo.archived,
        isDisabled: repo.disabled
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch repository data from GitHub');
    }
  }

  private isValidRepoPath(repoPath: string): boolean {
    // Check if the path follows the format: owner/repository
    const repoPathRegex = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
    return repoPathRegex.test(repoPath);
  }

  async checkRepositoryExists(repoPath: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/repos/${repoPath}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Simple-CRM-App'
        }
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const githubService = new GitHubService();
