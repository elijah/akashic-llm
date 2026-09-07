// lib/llm/query-parser.ts - Natural Language to Civic Analysis

import { CivicEntity, GovernmentMeeting, Candidate, CivicProject, CourtCase } from '@akashic/types';

const CIVIC_ENTITIES = [
  { type: 'GovernmentMeeting', keywords: ['meeting', 'session', 'session', 'agenda'] },
  { type: 'Candidate', keywords: ['candidate', 'election', 'ballot', 'vote'] },
  { type: 'CivicProject', keywords: ['project', 'construction', 'public works', 'infrastructure'] },
  { type: 'CourtCase', keywords: ['case', 'court', 'legal', 'lawsuit'] }
];

async function parseQuery(query: string): Promise<{ type: CivicEntity['type']; entities: string[] }> {
  const lowerQuery = query.toLowerCase();
  
  // Match entity types
  for (const entity of CIVIC_ENTITIES) {
    for (const keyword of entity.keywords) {
      if (lowerQuery.includes(keyword)) {
        return {
          type: entity.type,
          entities: extractNamedEntities(query)
        };
      }
    }
  }
  
  // Default to GovernmentMeeting
  return {
    type: 'GovernmentMeeting',
    entities: extractKeyPhrases(query)
  };
}

// Example entity extraction
function extractNamedEntities(text: string): string[] {
  // Simplified NER using regex
  const matches = text.match(/([A-Za-z]+(?: [A-Za-z]+)*)/g) || [];
  return Array.from(new Set(matches)).slice(0, 5); // Limit to 5
}

function extractKeyPhrases(text: string): string[] {
  return text.match(/(?:[A-Za-z]+(?: [A-Za-z]+)*)/g) || [];
}