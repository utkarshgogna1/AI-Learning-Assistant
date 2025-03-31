'use server';

import { Pinecone } from '@pinecone-database/pinecone';

let pineconeInstance: Pinecone | null = null;
let pineconeIndexInstance: any = null;

export async function getPineconeIndex() {
  if (!pineconeIndexInstance) {
    try {
      pineconeInstance = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT!,
      });
      
      pineconeIndexInstance = pineconeInstance.Index(process.env.PINECONE_INDEX!);
    } catch (error) {
      console.error('Error initializing Pinecone:', error);
      throw new Error('Failed to initialize Pinecone index');
    }
  }
  
  return pineconeIndexInstance;
} 