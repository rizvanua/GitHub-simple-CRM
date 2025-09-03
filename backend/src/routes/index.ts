import { Express } from 'express';
import authRoutes from './auth';
import projectRoutes from './projects';
import githubRoutes from './github';

const API_ENDPOINTS = [
  { route: "/api/auth", function: authRoutes },
  { route: "/api/projects", function: projectRoutes },
  { route: "/api/github", function: githubRoutes },
] as const;

export const useEndpoints = (app: Express) =>
  API_ENDPOINTS.map((endpoint) => app.use(endpoint.route, endpoint.function));
