// app/api/llm/generate/route.ts - LLM Generation Endpoint

import { NextRequest, NextResponse } from 'next/server';
import { POST as proxyHandler, sanitizeOutput } from '@/lib/llm/proxy';

export async function POST(request: NextRequest) {
  // Add CORS headers
  const response = await proxyHandler(request);
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  
  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}