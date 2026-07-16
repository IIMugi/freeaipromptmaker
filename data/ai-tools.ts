export interface AITool {
  id: string;
  name: string;
  provider: string;
  website: string;
  promptMode: string;
  limitation: string;
}

export const aiTools: AITool[] = [
  {
    id: 'midjourney',
    name: 'Midjourney',
    provider: 'Midjourney',
    website: 'https://www.midjourney.com',
    promptMode: 'Descriptive prompt text plus supported text parameters.',
    limitation: 'Available parameters and defaults can change by model version.',
  },
  {
    id: 'flux',
    name: 'FLUX',
    provider: 'Black Forest Labs',
    website: 'https://bfl.ai',
    promptMode: 'Descriptive natural language; interface or API settings remain separate.',
    limitation: 'Black Forest Labs documents FLUX prompting without negative prompts; describe the desired outcome positively.',
  },
  {
    id: 'openai-images',
    name: 'OpenAI image generation',
    provider: 'OpenAI',
    website: 'https://platform.openai.com/docs/guides/image-generation',
    promptMode: 'Natural-language image instructions with settings supplied by the product or API.',
    limitation: 'Available models, sizes, and controls depend on the selected OpenAI surface.',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    provider: 'Stability AI and third-party interfaces',
    website: 'https://stability.ai',
    promptMode: 'Positive prompt plus separate negative-prompt and generation controls in many interfaces.',
    limitation: 'Syntax and capabilities vary substantially by checkpoint and interface.',
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    provider: 'Adobe',
    website: 'https://firefly.adobe.com',
    promptMode: 'Natural-language prompt with visual settings selected in the interface.',
    limitation: 'Features and availability depend on Adobe account, plan, region, and current product version.',
  },
];
