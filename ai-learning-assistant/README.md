# AI Learning Assistant

An intelligent learning platform that personalizes education through AI-powered assessments, adaptive learning plans, and real-time progress tracking.

## Features

- **Assessment System**: Interactive quizzes with knowledge gap analysis and adaptive difficulty scaling
- **AI Learning Engine**: Personalized study plans using LangChain and OpenAI
- **Progress Tracking**: Real-time performance monitoring and achievement system
- **User Authentication**: Secure login and profile management

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4, LangChain, Retrieval Augmented Generation with Pinecone
- **Analytics**: Real-time tracking via Supabase

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Pinecone account

### Environment Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ai-learning-assistant.git
   cd ai-learning-assistant
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Copy the example environment variables
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your environment variables in `.env.local`

### Database Setup

1. Create a new Supabase project
2. Run the database migration scripts (located in `./supabase/migrations`)
3. Update your `.env.local` with the Supabase URL and keys

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
ai-learning-assistant/
├── src/                # Source files
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── lib/            # Utility functions and API clients
│   └── styles/         # Global styles
├── public/             # Static assets
├── supabase/           # Supabase configurations
└── ...config files
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

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy!

### Docker Deployment

A Dockerfile is included for containerized deployments.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT models
- Vercel for Next.js
- Supabase for backend services
- Pinecone for vector database
