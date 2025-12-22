// AI Art Generator Tools Data
// Affiliate links will be added when user registers for affiliate programs

export interface AITool {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    logo: string;
    website: string;
    affiliateLink?: string; // Add after registering for affiliate programs
    pricing: {
        free: boolean;
        freeTier?: string;
        startingPrice?: string;
        currency: string;
    };
    features: string[];
    pros: string[];
    cons: string[];
    bestFor: string;
    rating: number; // out of 5
    category: 'image-generator' | 'video' | 'editing' | 'upscaler';
}

export const aiTools: AITool[] = [
    {
        id: 'midjourney',
        name: 'Midjourney',
        description: 'Midjourney is the industry-leading AI art generator known for its stunning, artistic outputs. It creates highly detailed, aesthetic images that often look like professional artwork. Perfect for artists and designers seeking high-quality visual content.',
        shortDescription: 'Industry-leading AI art with stunning artistic quality',
        logo: '/tools/midjourney.svg',
        website: 'https://midjourney.com',
        pricing: {
            free: false,
            startingPrice: '$10/month',
            currency: 'USD',
        },
        features: [
            'Discord-based interface',
            'Stunning artistic quality',
            'Style consistency',
            'Pan & zoom features',
            'Variation modes',
            'High resolution upscaling',
        ],
        pros: [
            'Best-in-class image quality',
            'Unique artistic style',
            'Active community',
            'Regular updates',
        ],
        cons: [
            'No free tier',
            'Discord-only (no web app)',
            'Learning curve for prompts',
        ],
        bestFor: 'Professional artists and designers',
        rating: 4.9,
        category: 'image-generator',
    },
    {
        id: 'leonardo-ai',
        name: 'Leonardo.ai',
        description: 'Leonardo.ai is a powerful AI art platform with a focus on game assets, character design, and concept art. It offers fine-tuned models and an intuitive web interface with advanced features like real-time canvas and motion generation.',
        shortDescription: 'Powerful AI for game assets & character design',
        logo: '/tools/leonardo.svg',
        website: 'https://leonardo.ai',
        affiliateLink: 'https://leonardo.ai/?via=freeaipromptmaker', // Placeholder - register at Impact.com
        pricing: {
            free: true,
            freeTier: '150 tokens/day',
            startingPrice: '$12/month',
            currency: 'USD',
        },
        features: [
            'Web-based interface',
            'Fine-tuned models',
            'Real-time canvas',
            'Motion generation',
            'Image guidance',
            'API access',
        ],
        pros: [
            'Generous free tier',
            'Great for game assets',
            'Easy to use interface',
            'Multiple AI models',
        ],
        cons: [
            'Token system can be limiting',
            'Some features Pro-only',
        ],
        bestFor: 'Game developers and concept artists',
        rating: 4.7,
        category: 'image-generator',
    },
    {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        description: 'DALL-E 3 by OpenAI is integrated into ChatGPT and offers exceptional prompt understanding. It excels at following complex instructions and generating images with text. Best for users who want accurate prompt interpretation.',
        shortDescription: 'OpenAI\'s flagship with superior prompt understanding',
        logo: '/tools/dalle.svg',
        website: 'https://openai.com/dall-e-3',
        pricing: {
            free: false,
            startingPrice: '$20/month',
            currency: 'USD',
        },
        features: [
            'ChatGPT integration',
            'Excellent text rendering',
            'High prompt accuracy',
            'Safety features',
            'API available',
        ],
        pros: [
            'Best prompt understanding',
            'Great text in images',
            'Easy ChatGPT access',
            'Consistent quality',
        ],
        cons: [
            'Requires ChatGPT Plus',
            'Limited style control',
            'Conservative safety filters',
        ],
        bestFor: 'Content creators needing accurate prompts',
        rating: 4.6,
        category: 'image-generator',
    },
    {
        id: 'stable-diffusion',
        name: 'Stable Diffusion',
        description: 'Stable Diffusion is the leading open-source AI image generator. Run it locally for free with unlimited generations, or use cloud services. Offers maximum customization through LoRAs, ControlNet, and community models.',
        shortDescription: 'Open-source powerhouse with unlimited customization',
        logo: '/tools/stable-diffusion.svg',
        website: 'https://stability.ai',
        pricing: {
            free: true,
            freeTier: 'Unlimited (local)',
            startingPrice: '$0 (local) / $10/month (cloud)',
            currency: 'USD',
        },
        features: [
            'Fully open source',
            'Run locally for free',
            'LoRA support',
            'ControlNet integration',
            'Thousands of models',
            'Complete customization',
        ],
        pros: [
            'Free to run locally',
            'Unlimited generations',
            'Massive community',
            'No content restrictions',
        ],
        cons: [
            'Requires technical setup',
            'Needs good GPU locally',
            'Steeper learning curve',
        ],
        bestFor: 'Technical users who want full control',
        rating: 4.8,
        category: 'image-generator',
    },
    {
        id: 'runway',
        name: 'Runway ML',
        description: 'Runway is the leading AI video generation platform. Create stunning videos from text or images with Gen-2 and Gen-3 models. Also offers image generation, green screen removal, and professional video editing tools.',
        shortDescription: 'Leading AI video generation platform',
        logo: '/tools/runway.svg',
        website: 'https://runwayml.com',
        pricing: {
            free: true,
            freeTier: '125 credits',
            startingPrice: '$15/month',
            currency: 'USD',
        },
        features: [
            'Text-to-video (Gen-2/Gen-3)',
            'Image-to-video',
            'Video editing suite',
            'Green screen removal',
            'Motion brush',
            'Camera controls',
        ],
        pros: [
            'Best AI video quality',
            'Professional tools',
            'Regular updates',
            'Gen-3 Alpha is impressive',
        ],
        cons: [
            'Credits run out fast',
            'Expensive for heavy use',
            'Video length limits',
        ],
        bestFor: 'Video creators and filmmakers',
        rating: 4.7,
        category: 'video',
    },
    {
        id: 'ideogram',
        name: 'Ideogram',
        description: 'Ideogram excels at generating images with accurate text and typography. It\'s the go-to tool for creating logos, posters, and designs that require readable text within the image.',
        shortDescription: 'Best AI for text and typography in images',
        logo: '/tools/ideogram.svg',
        website: 'https://ideogram.ai',
        pricing: {
            free: true,
            freeTier: '10 prompts/day',
            startingPrice: '$8/month',
            currency: 'USD',
        },
        features: [
            'Accurate text rendering',
            'Typography focus',
            'Magic Prompt',
            'Style presets',
            'High resolution',
        ],
        pros: [
            'Best text in images',
            'Great for logos',
            'Generous free tier',
            'Easy to use',
        ],
        cons: [
            'Limited daily free prompts',
            'Less artistic than Midjourney',
        ],
        bestFor: 'Designers needing text in images',
        rating: 4.5,
        category: 'image-generator',
    },
    {
        id: 'flux',
        name: 'Flux',
        description: 'Flux by Black Forest Labs is the newest contender in AI image generation. Known for photorealistic outputs and excellent prompt following. Available through various platforms and APIs.',
        shortDescription: 'New photorealistic AI with excellent prompt following',
        logo: '/tools/flux.svg',
        website: 'https://blackforestlabs.ai',
        pricing: {
            free: true,
            freeTier: 'Via platforms',
            startingPrice: 'Varies by platform',
            currency: 'USD',
        },
        features: [
            'Photorealistic outputs',
            'Great prompt adherence',
            'Multiple versions (Pro, Dev, Schnell)',
            'Fast generation',
            'Open weights available',
        ],
        pros: [
            'Excellent realism',
            'Fast generation',
            'Good at text',
            'Open-source options',
        ],
        cons: [
            'Newer, less refined',
            'Platform availability varies',
        ],
        bestFor: 'Photorealistic image generation',
        rating: 4.6,
        category: 'image-generator',
    },
];

export const toolCategories = [
    { id: 'image-generator', name: 'Image Generators', icon: '🎨' },
    { id: 'video', name: 'Video Generators', icon: '🎬' },
    { id: 'editing', name: 'AI Editing', icon: '✨' },
    { id: 'upscaler', name: 'Upscalers', icon: '🔍' },
];
