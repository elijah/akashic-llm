# llm-api-init.ts

import { defineConfig } from 'next/config';
export const config = defineConfig({
  adapter: {
    base: 'http://localhost:11434/api/generate', # Ollama API endpoint
    options: {
      headers: {
        'X-API-Key': process.env.OLLAMA_API_KEY ?? 'llm-admin',
        Accept: 'application/json',
      },
    },
  },
});

# Setup instructions for Ollama
1. Install Ollama: `curl -fL https://ollama.com/install.sh | sh`
2. Pull Llama3 8B: `ollama pull llama3:8b`
3. Start API: `ollama serve --api`

# Optional: vLLM development config
```bash
# For future vLLM deployment:
vllm deploy --model mistral-7b-instruct --max-model-len 4096 --tensor-parallel-size 8 --enable-api
```