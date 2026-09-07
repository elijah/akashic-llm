// lib/llm/proxy.ts - API Proxy Layer with Rate Limiting

import { NextRequest, NextResponse } from 'next/server';

interface LLMRequest {
  prompt: string;
  model: string;
  max_tokens?: number;
  temperature?: number;
}

interface LLMResponse {
  message: string;
  entities: any[];
  timestamp: string;
}

const RATE_LIMIT = 10; // requests per minute
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  // Rate limiting
  const apiKey = request.headers.get('X-API-Key') || 'anonymous';
  const now = Date.now();
  
  const userLimit = requestCounts.get(apiKey) || { count: 0, resetTime: now + 60000 };
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + 60000;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', retryAfter: Math.ceil((userLimit.resetTime - now) / 1000) },
      { status: 429 }
    );
  }
  
  userLimit.count++;
  requestCounts.set(apiKey, userLimit);

  try {
    const body: LLMRequest = await request.json();
    
    // Validate request
    if (!body.prompt || !body.model) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, model' },
        { status: 400 }
      );
    }

    // Call Ollama API
    const ollamaResponse = await fetch(`${process.env.OLLAMA_HOST || 'http://localhost:11434'}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.OLLAMA_API_KEY || 'ollama-admin'
      },
      body: JSON.stringify({
        prompt: body.prompt,
        model: body.model,
        max_tokens: body.max_tokens || 512,
        temperature: body.temperature || 0.7,
        stream: false
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.statusText}`);
    }

    const ollamaData = await ollamaResponse.json();
    
    // Sanitize output
    const sanitizedResponse = sanitizeOutput(ollamaData.response);
    
    // Return structured response
    return NextResponse.json({
      message: sanitizedResponse,
      entities: [], // Will be populated by query parser
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('LLM Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
}

// Output sanitization
function sanitizeOutput(text: string): string {
  const blockedPatterns = [
    /\[instruction\]/gi,
    /bypass/gi,
    /illegal/gi,
    /ignore previous/gi,
    /system prompt/gi
  ];
  
  return blockedPatterns.reduce((sanitized, pattern) => 
    sanitized.replace(pattern, '***REDACTED***'), text);
}

export { sanitizeOutput };