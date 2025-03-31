# AI Learning Assistant

An AI-powered learning assistant that helps users create personalized learning paths based on assessments and provides smart chat capabilities.

## Features

- AI-driven assessments to evaluate knowledge levels
- Personalized learning plans based on assessment results
- RAG-powered AI chat for programming questions with citations
- Progress tracking and visualization
- User authentication and profile management

## Tech Stack

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Supabase for authentication and database
- Shadcn UI components

## Development Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Module Import Path Configuration

This project uses the `@/` path alias to import modules. For example:

```typescript
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
```

The path mappings are configured in both `tsconfig.json` and `jsconfig.json`.

## Deployment

This project is configured for deployment on Vercel:

1. Push your changes to a Git repository
2. Connect the repository to Vercel
3. Vercel will automatically detect the Next.js project and deploy it

## Troubleshooting

If you encounter any issues with module resolution during development or build, run this script to automatically fix path imports:

```
node update-imports.js
```

## Environment Variables

The following environment variables are required:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

## Key Components

### Assessment System

- Interactive quiz interface
- Knowledge gap analysis using GPT-4
- Adaptive difficulty based on user performance
- Response storage in Supabase PostgreSQL

### AI Learning Engine

- Personalized study plan generation
- Context-aware explanations with RAG
- Dynamic content difficulty adjustment
- OpenAI function calling for structured responses

### Progress Tracking

- Dashboard with performance analytics
- Achievement system (streaks, completion badges)
- Visual progress indicators

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT models
- Vercel for Next.js
- Supabase for backend services
- Pinecone for vector database
