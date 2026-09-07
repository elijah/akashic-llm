// lib/llm/prompt-engine.ts - LLM Prompt Engineering for Civic Analysis

export function buildAnalysisPrompt(query: string, entityType: string, entities: string[]): string {
  const context = getContextForEntity(entityType);
  
  return `You are a civic analyst specializing in local government. 
Analyze the following user query about ${entityType.toLowerCase()}:

USER QUERY: "${query}"
DETECTED ENTITIES: ${entities.join(', ')}

CONTEXT:
${context}

Provide a concise analysis with:
1. Key findings
2. Relevant dates/deadlines
3. Actionable insights for local stakeholders
4. Sources to verify

Format your response as JSON matching the CivicEntity schema.`;
}

function getContextForEntity(entityType: string): string {
  const contexts: Record<string, string> = {
    GovernmentMeeting: `
    Focus on meeting outcomes, voting records, policy decisions, and public comments.
    Include meeting dates, attendees, and action items.`,
    
    Candidate: `
    Focus on candidate platforms, campaign finance, endorsements, and election dates.
    Highlight policy positions and public statements.`,
    
    CivicProject: `
    Focus on project scope, budget, timeline, environmental impact, and community feedback.
    Include responsible departments and funding sources.`,
    
    CourtCase: `
    Focus on case details, parties involved, legal issues, hearing dates, and precedents.
    Include court jurisdiction and potential community impact.`
  };
  
  return contexts[entityType] || contexts.GovernmentMeeting;
}

export function buildComparisonPrompt(entity1: string, entity2: string): string {
  return `Compare the following two civic entities:
  
  ENTITY 1: ${entity1}
  ENTITY 2: ${entity2}
  
  Provide a structured comparison covering:
  - Similarities and differences
  - Policy alignment/conflicts
  - Timeline overlaps
  - Stakeholder implications`;
}