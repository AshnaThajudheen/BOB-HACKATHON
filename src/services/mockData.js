// Mock data for the Auto Test & Documentation Generator

export const mockRepositories = [
  {
    id: '1',
    name: 'react-dashboard',
    url: 'https://github.com/user/react-dashboard',
    status: 'completed',
    analyzedAt: '2026-05-15T10:30:00Z',
    testsGenerated: 142,
    apiEndpoints: 38,
    coverage: 87,
    language: 'JavaScript',
    framework: 'React',
    linesOfCode: 15420,
  },
  {
    id: '2',
    name: 'express-api',
    url: 'https://github.com/user/express-api',
    status: 'completed',
    analyzedAt: '2026-05-14T15:45:00Z',
    testsGenerated: 89,
    apiEndpoints: 24,
    coverage: 92,
    language: 'JavaScript',
    framework: 'Express',
    linesOfCode: 8340,
  },
  {
    id: '3',
    name: 'python-ml-service',
    url: 'https://github.com/user/python-ml-service',
    status: 'processing',
    analyzedAt: '2026-05-16T01:20:00Z',
    testsGenerated: 45,
    apiEndpoints: 12,
    coverage: 65,
    language: 'Python',
    framework: 'Flask',
    linesOfCode: 6780,
  },
  {
    id: '4',
    name: 'vue-ecommerce',
    url: 'https://github.com/user/vue-ecommerce',
    status: 'failed',
    analyzedAt: '2026-05-13T09:15:00Z',
    testsGenerated: 0,
    apiEndpoints: 0,
    coverage: 0,
    language: 'JavaScript',
    framework: 'Vue',
    linesOfCode: 12560,
    error: 'Repository access denied',
  },
];

export const mockTestResults = {
  '1': {
    unitTests: [
      {
        id: 'test-1',
        name: 'UserService.test.js',
        framework: 'Jest',
        testCount: 24,
        code: `import { UserService } from '../services/UserService';

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  test('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    const user = await userService.createUser(userData);
    
    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  test('should validate email format', () => {
    expect(userService.isValidEmail('test@example.com')).toBe(true);
    expect(userService.isValidEmail('invalid-email')).toBe(false);
  });

  test('should handle duplicate email error', async () => {
    const userData = { name: 'Jane', email: 'existing@example.com' };
    
    await expect(userService.createUser(userData))
      .rejects
      .toThrow('Email already exists');
  });
});`,
      },
      {
        id: 'test-2',
        name: 'AuthController.test.js',
        framework: 'Jest',
        testCount: 18,
        code: `import { AuthController } from '../controllers/AuthController';

describe('AuthController', () => {
  test('should authenticate valid credentials', async () => {
    const credentials = {
      username: 'testuser',
      password: 'password123'
    };
    
    const result = await AuthController.login(credentials);
    
    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
  });

  test('should reject invalid credentials', async () => {
    const credentials = {
      username: 'testuser',
      password: 'wrongpassword'
    };
    
    await expect(AuthController.login(credentials))
      .rejects
      .toThrow('Invalid credentials');
  });
});`,
      },
    ],
    integrationTests: [
      {
        id: 'int-test-1',
        name: 'API.integration.test.js',
        framework: 'Supertest',
        testCount: 15,
        code: `import request from 'supertest';
import app from '../app';

describe('API Integration Tests', () => {
  test('GET /api/users should return user list', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('POST /api/users should create new user', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(newUser.name);
  });
});`,
      },
    ],
  },
};

export const mockDocumentation = {
  '1': {
    apiDocs: [
      {
        id: 'doc-1',
        title: 'Authentication API',
        type: 'OpenAPI',
        content: `openapi: 3.0.0
info:
  title: Authentication API
  version: 1.0.0
  description: User authentication and authorization endpoints

paths:
  /api/auth/login:
    post:
      summary: User login
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  format: password
      responses:
        '200':
          description: Successful login
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    type: object
        '401':
          description: Invalid credentials`,
      },
      {
        id: 'doc-2',
        title: 'User Management API',
        type: 'OpenAPI',
        content: `openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0

paths:
  /api/users:
    get:
      summary: Get all users
      responses:
        '200':
          description: List of users
    post:
      summary: Create new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string`,
      },
    ],
    readmeDocs: [
      {
        id: 'readme-1',
        title: 'Project Overview',
        content: `# React Dashboard

A modern, responsive dashboard application built with React and Material-UI.

## Features

- User authentication and authorization
- Real-time data visualization
- Responsive design for all devices
- RESTful API integration
- State management with Redux

## Installation

\`\`\`bash
npm install
npm start
\`\`\`

## Testing

\`\`\`bash
npm test
\`\`\``,
      },
    ],
  },
};

export const mockExplanations = {
  '1': [
    {
      id: 'exp-1',
      file: 'src/services/UserService.js',
      type: 'class',
      name: 'UserService',
      explanation: `The UserService class handles all user-related operations including creation, retrieval, and validation. It implements the repository pattern to abstract database operations and provides a clean API for user management.

Key responsibilities:
- User CRUD operations
- Email validation
- Password hashing
- User authentication logic`,
      complexity: 'Medium',
      linesOfCode: 145,
    },
    {
      id: 'exp-2',
      file: 'src/controllers/AuthController.js',
      type: 'class',
      name: 'AuthController',
      explanation: `The AuthController manages authentication flows including login, logout, and token refresh. It uses JWT tokens for stateless authentication and implements security best practices.

Key features:
- JWT token generation and validation
- Session management
- Password verification
- Rate limiting for login attempts`,
      complexity: 'High',
      linesOfCode: 203,
    },
    {
      id: 'exp-3',
      file: 'src/utils/validators.js',
      type: 'module',
      name: 'Validators',
      explanation: `A collection of validation utility functions used throughout the application. Provides consistent validation logic for common data types like emails, passwords, and URLs.

Functions include:
- isValidEmail: Validates email format using regex
- isStrongPassword: Checks password strength
- sanitizeInput: Prevents XSS attacks`,
      complexity: 'Low',
      linesOfCode: 67,
    },
  ],
};

export const mockStats = {
  totalRepositories: 24,
  totalTests: 1847,
  totalDocuments: 156,
  averageCoverage: 84,
  recentActivity: [
    { date: '2026-05-16', count: 3 },
    { date: '2026-05-15', count: 5 },
    { date: '2026-05-14', count: 2 },
    { date: '2026-05-13', count: 4 },
    { date: '2026-05-12', count: 6 },
    { date: '2026-05-11', count: 3 },
    { date: '2026-05-10', count: 1 },
  ],
};

// API simulation functions
export const analyzeRepository = async (repoUrl) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const newRepo = {
    id: Date.now().toString(),
    name: repoUrl.split('/').pop(),
    url: repoUrl,
    status: 'processing',
    analyzedAt: new Date().toISOString(),
    testsGenerated: 0,
    apiEndpoints: 0,
    coverage: 0,
    language: 'JavaScript',
    framework: 'Unknown',
    linesOfCode: 0,
  };
  
  return newRepo;
};

export const getRepositoryResults = async (repoId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    tests: mockTestResults[repoId] || mockTestResults['1'],
    documentation: mockDocumentation[repoId] || mockDocumentation['1'],
    explanations: mockExplanations[repoId] || mockExplanations['1'],
  };
};

// Made with Bob
