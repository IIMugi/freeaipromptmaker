import type { AIModel } from '@/lib/prompt-builder';

export interface PromptUseCase {
  slug: string;
  title: string;
  intent: string;
  intro: string;
  samplePrompts: string[];
  negatives: string[];
  keywords: string[];
  /** 500+ word expert guide with unique, in-depth content for this use case */
  expertGuide: string;
  /** 3-5 actionable pro tips specific to this use case */
  proTips: string[];
  /** Top 3 model recommendations with reasons, specific to this use case */
  bestModels: { name: string; reason: string }[];
}

export const promptUseCases: PromptUseCase[] = [
  {
    slug: 'anime',
    title: 'Anime',
    intent: 'Create clean anime character and scene prompts with consistent style and strong composition.',
    intro: 'Use this page to build anime prompts with better character detail, color harmony, and camera control.',
    samplePrompts: [
      'anime protagonist, dynamic pose, sunset backlight, cinematic framing, detailed line art',
      'slice of life cafe scene, warm palette, shallow depth of field, soft bloom',
      'futuristic anime city, rain reflections, dramatic perspective, neon highlights',
      'magical girl transformation sequence, sparkle effects, radiant aura, pastel gradient sky',
      'samurai standoff at dawn, ink wash aesthetic, wind-blown sakura petals, wide-angle composition',
    ],
    negatives: ['blurry eyes', 'distorted hands', 'extra limbs', 'muddy colors'],
    keywords: ['anime prompt generator ai', 'anime ai art prompts', 'anime character prompt'],
    expertGuide: `Anime art generation is one of the most popular use cases for AI image tools, but achieving results that look like they came from a professional studio requires a deep understanding of the medium's visual language. Unlike photorealistic generation, anime prompts must encode style-specific tokens that reference decades of artistic convention — from the thick outlines and vibrant palettes of shonen series to the watercolor gradients of Studio Ghibli backgrounds.

The single most important principle in anime prompt engineering is **style anchoring**. Without explicitly naming a style reference (e.g., "in the style of Makoto Shinkai" or "cel-shaded illustration"), models default to a generic, uncanny blend that looks neither anime nor photorealistic. Always anchor your style in the first clause of your prompt.

**Character consistency** is the second pillar. Anime characters are defined by exaggerated proportions — large expressive eyes, small noses, and dynamic hair shapes. To avoid the model defaulting to Western comic proportions, include tokens like "anime-style proportions," "detailed eye highlights," and "sharp line art." When generating full-body shots, specify pose tokens explicitly ("dynamic action pose," "three-quarter view") because AI models tend to default to static, front-facing compositions.

**Color theory in anime** differs significantly from photorealism. Anime uses flat color fills with strategic gradient shading rather than physically accurate light simulation. Prompting for "cel shading," "flat color palette," and "anime-style shadows" produces far more authentic results than relying on the model's default rendering. For background work, reference specific scene types: "anime cityscape at golden hour," "fantasy forest with volumetric light rays," or "school rooftop at sunset with lens flare."

**Negative prompts are critical** for anime. Common artifacts include merged fingers, asymmetric eyes, inconsistent clothing details, and unwanted photorealistic textures. Always include "bad anatomy, extra fingers, merged limbs, 3D render, photorealistic skin texture" in your negative prompt to keep outputs clean and stylistically consistent.

For sequential art or character sheets, specify layout tokens: "character reference sheet, front side back views, white background, consistent design." This forces the model to produce assets you can actually use in a production pipeline rather than standalone illustrations.`,
    proTips: [
      'Anchor your style in the first 5 words — "cel-shaded anime illustration" or "Makoto Shinkai style" sets the entire aesthetic.',
      'Use "detailed eye highlights, catchlight" to get expressive anime eyes instead of flat, lifeless circles.',
      'For action scenes, pair "dynamic pose" with specific camera angles like "low angle, dutch tilt" for dramatic impact.',
      'Always add "consistent line weight, clean lineart" to avoid the messy, sketch-like output common with anime prompts.',
      'Reference specific series aesthetics: "Demon Slayer color grading" or "Your Name sky palette" for recognizable quality benchmarks.',
    ],
    bestModels: [
      { name: 'Stable Diffusion XL', reason: 'Best for anime with custom LoRA models trained on specific anime styles. Unmatched control with ControlNet for poses.' },
      { name: 'Midjourney v7', reason: 'Excellent stylized quality with natural language prompts. Great for concept art and atmospheric scenes.' },
      { name: 'Leonardo.ai', reason: 'Strong built-in anime fine-tunes and character consistency features for production workflows.' },
    ],
  },
  {
    slug: 'logos',
    title: 'Logos',
    intent: 'Generate clean logo and brand mark prompts for typography, symbols, and icon sets.',
    intro: 'Build logo-focused prompts for ideation, concept directions, and high-clarity visual identity drafts.',
    samplePrompts: [
      'minimal geometric logo for fintech app, flat vector, white background',
      'wordmark logo for AI startup, modern sans-serif, high contrast',
      'symbol + wordmark combo, clean negative space, scalable icon style',
      'abstract wave logo for ocean conservation nonprofit, blue gradient, circular form',
      'monogram logo combining letters A and M, gold foil effect, luxury aesthetic',
    ],
    negatives: ['photorealistic texture', 'complex gradients', 'illegible text', 'busy background'],
    keywords: ['ai logo prompt generator', 'logo prompt builder', 'typography prompt generator'],
    expertGuide: `Logo generation with AI is fundamentally different from other image generation tasks because logos demand **technical precision** that most generative models were not designed for. Understanding these constraints is what separates usable brand concepts from random graphics.

The primary challenge in AI logo generation is **text rendering**. Most diffusion models struggle with clean, readable typography because they generate images pixel-by-pixel rather than understanding letterforms as geometric constructs. To work around this, focus your prompts on the **symbol or icon component** of the logo rather than complete wordmarks. Generate the mark, then pair it with manually set typography in a vector editor like Figma or Illustrator.

**Simplicity is the golden rule** for logo prompting. Professional logos work at 16×16 pixels (favicons) and on billboards. Prompt for "minimal, scalable, flat design" rather than detailed illustrations. Include "white background, centered composition, no shadows, vector style" to get outputs that can actually be traced into production vectors.

**Color strategy matters enormously.** Logos need to work in single-color (black on white) before they work in color. Start by generating a monochrome version: "black and white logo, high contrast, clean silhouette." Once you have a strong shape, re-prompt with your brand colors. This workflow mirrors how professional designers actually develop brand identities.

**Negative space logos** (like the FedEx arrow or the NBC peacock) are the hallmark of expert design. Prompt for them explicitly: "clever use of negative space, hidden symbol, dual-meaning logo." AI models can occasionally produce surprisingly elegant negative space solutions, especially when given clear subject constraints.

For **industry-specific logos**, always include sector keywords: "tech startup logo, circuit board motif" or "organic food brand, leaf integration, earth tones." These tokens activate latent associations that produce more relevant and contextually appropriate designs.

**Iterative refinement** is essential for logos. Use your first generation as a direction-finder, not a final product. Identify which elements work (shape, proportion, style), then re-prompt with more specific constraints. A typical professional logo process involves 3–5 rounds of iteration, and AI-assisted workflows should follow the same discipline.`,
    proTips: [
      'Generate the icon/symbol separately from text — AI models struggle with clean typography but excel at geometric symbols.',
      'Always prompt for "white background, centered, scalable" to get outputs ready for vector tracing in Illustrator or Figma.',
      'Start in monochrome ("black and white, high contrast") to validate that the shape works before adding color.',
      'Include "no gradients, flat fill, solid shapes" for logos that need to work at small sizes like favicons.',
      'Use "negative space logo" explicitly to trigger clever dual-meaning designs that look more professional.',
    ],
    bestModels: [
      { name: 'Ideogram 2.0', reason: 'Industry-leading text rendering capability makes it the top choice for wordmarks and logo + text combinations.' },
      { name: 'Recraft V3', reason: 'Vector-oriented output with cleaner geometric shapes and icon-quality results.' },
      { name: 'DALL-E 3', reason: 'Strong natural language understanding for complex concept descriptions and abstract brand ideas.' },
    ],
  },
  {
    slug: 'product-photography',
    title: 'Product Photography',
    intent: 'Build ad-ready product photography prompts with lighting and composition control.',
    intro: 'Use this flow for ecommerce and ad visuals: controlled lighting, material fidelity, and clear background separation.',
    samplePrompts: [
      'premium sneaker product shot, studio softbox lighting, reflective floor, 85mm lens',
      'perfume bottle hero shot, moody gradient background, rim light, macro detail',
      'smartwatch floating shot, clean shadow, minimal modern composition',
      'artisan coffee bag packaging shot, rustic wood surface, natural window light, lifestyle staging',
      'wireless earbuds hero image, tech-minimal aesthetic, subtle reflection, high-key lighting',
    ],
    negatives: ['cluttered scene', 'low detail', 'overexposed highlights', 'warped proportions'],
    keywords: ['product photography ai prompt generator', 'ecommerce image prompt', 'ad shot ai prompt'],
    expertGuide: `Product photography is one of the highest commercial-value applications of AI image generation, directly impacting conversion rates in ecommerce, advertising, and brand marketing. The difference between an amateur product shot and a professional one comes down to three controllable variables: **lighting, material rendering, and composition**.

**Lighting is everything** in product photography. Studio photographers spend hours positioning softboxes, reflectors, and strip lights to create the exact highlight and shadow pattern that makes a product look premium. In AI prompts, you must be equally specific. Instead of "well-lit product photo," specify the exact lighting setup: "butterfly lighting from above, fill light from left, rim light from right" or "single-source dramatic side lighting with deep shadows." The more precise your lighting language, the more professional the output.

**Material rendering** determines whether a product looks real or CG. Different materials require different prompting strategies. For **glass and transparent objects** (perfume bottles, glasses), include "caustics, refraction, transparency, crystal clear material." For **metallic surfaces** (watches, electronics), prompt for "brushed metal texture, sharp reflections, no fingerprints." For **fabric and textiles** (clothing, bags), use "visible weave texture, natural drape, subtle wrinkles." Each material category requires its own set of rendering tokens.

**Composition frameworks** from professional photography translate directly into prompt tokens. The most common product photography compositions include: **hero shot** (product centered, dramatic lighting, eye-level angle), **lifestyle shot** (product in use context, environmental storytelling), **flat lay** (top-down arrangement with props), and **detail shot** (macro close-up of texture or feature). Name the composition type explicitly in your prompt.

**Background control** is critical for ecommerce. Most marketplaces require pure white backgrounds (Amazon's requirement), while brand advertising uses gradient, textured, or contextual backgrounds. For white backgrounds, prompt: "product on pure white background, soft shadow, studio photography, isolated subject." For lifestyle backgrounds, be specific about the surface and environment: "marble countertop, morning light, kitchen context, shallow depth of field."

**Camera language** significantly impacts the output quality. Include focal length ("85mm lens, f/2.8"), camera angle ("45-degree overhead, eye-level, low angle hero shot"), and depth of field ("shallow DOF, background blur, sharp subject focus"). These tokens are well-understood by modern AI models and produce dramatically more professional results than generic "product photo" prompts.`,
    proTips: [
      'Specify the exact lighting setup — "three-point studio lighting" produces far better results than "well-lit."',
      'For ecommerce, always include "pure white background, soft natural shadow, isolated product" for marketplace-ready images.',
      'Match material rendering tokens to your product: "brushed metal" for electronics, "visible thread texture" for fashion.',
      'Include focal length and aperture ("85mm f/1.8") to get professional depth of field and compression.',
      'Add "no watermark, no text overlay, clean composition" to get outputs ready for direct use.',
    ],
    bestModels: [
      { name: 'Flux Pro', reason: 'Highest photorealism fidelity for product shots with accurate material rendering and lighting.' },
      { name: 'Midjourney v7', reason: 'Excellent aesthetic quality with strong composition instincts. Great for hero shots and advertising visuals.' },
      { name: 'DALL-E 3', reason: 'Strong understanding of complex scene descriptions and product context. Good for lifestyle compositions.' },
    ],
  },
  {
    slug: 'youtube-thumbnails',
    title: 'YouTube Thumbnails',
    intent: 'Generate high-CTR thumbnail prompts with readable composition and visual contrast.',
    intro: 'Create thumbnail prompts optimized for clarity at small sizes and strong visual hierarchy.',
    samplePrompts: [
      'bold youtube thumbnail, expressive face close-up, high contrast lighting, empty text area',
      'tech review thumbnail style, clean split layout, neon accent glow, sharp subject',
      'tutorial thumbnail, simple background, dominant focal point, dynamic angle',
      'reaction thumbnail, exaggerated surprise expression, bold color pop background, vignette edges',
      'before and after split composition, dramatic transformation, side-by-side comparison layout',
    ],
    negatives: ['tiny text', 'flat contrast', 'busy composition', 'unclear subject'],
    keywords: ['youtube thumbnail ai prompt generator', 'thumbnail prompt builder', 'high ctr thumbnail prompt'],
    expertGuide: `YouTube thumbnails are a specialized design discipline where **click-through rate (CTR) optimization** directly equals revenue. A thumbnail that performs 2% better in CTR can mean thousands of additional views, making this one of the highest-ROI applications of AI image generation.

**The 3-second rule** governs thumbnail design. Viewers scroll through dozens of thumbnails per minute, spending roughly 3 seconds deciding whether to click. Your thumbnail must communicate the video's value proposition in that instant. This means: one dominant subject, one clear emotion or promise, and maximum contrast between foreground and background.

**Face-forward design** is the most reliable CTR driver. Human faces with exaggerated expressions (surprise, excitement, curiosity) consistently outperform faceless thumbnails. When prompting, specify: "close-up face, exaggerated expression, wide eyes, open mouth, dramatic studio lighting." The face should occupy at least 40% of the frame for maximum impact at small display sizes.

**Color psychology** is critical for thumbnail performance. YouTube's interface uses white and dark backgrounds, so your thumbnails need to pop against both. High-saturation colors (electric blue, vibrant red, neon yellow) outperform muted tones. Prompt for "bold color pop background, high saturation, neon accents" or use complementary color pairs: "teal and orange contrast, blue and yellow split." Avoid colors that blend into YouTube's interface (white, light gray, red that matches the subscribe button).

**Composition for small sizes** is where most AI-generated thumbnails fail. Remember that most viewers see thumbnails at approximately 320×180 pixels on mobile. Fine details are invisible. Prompt for "bold shapes, thick outlines, high contrast, readable at small scale." Avoid complex scenes with multiple subjects — a single clear focal point always wins.

**Text space reservation** is an often-overlooked strategy. Most successful thumbnails include 2-4 words of text overlay (added post-generation). Prompt for "empty space on right side for text" or "clean area upper third for title overlay" to ensure your AI-generated image has usable real estate for text addition in your editing software.

**Split compositions** work extremely well for comparison, transformation, and reaction content. Prompt for "side-by-side comparison layout, before and after, dramatic difference, clear dividing line." These layouts immediately communicate that the video contains a transformation or comparison, which drives curiosity clicks.`,
    proTips: [
      'Always leave empty space for text overlay — prompt for "clean area on left/right for title text" explicitly.',
      'Face thumbnails outperform everything — use "close-up face, exaggerated expression, dramatic lighting" as your base.',
      'Design for 320×180px (mobile) not 1280×720px — "bold shapes, high contrast, thick outlines, readable small."',
      'Use complementary color pairs (teal/orange, blue/yellow) to pop against YouTube\'s dark and light mode interfaces.',
    ],
    bestModels: [
      { name: 'Midjourney v7', reason: 'Best for dramatic, high-contrast compositions with strong aesthetic appeal. Excellent face rendering.' },
      { name: 'Flux Pro', reason: 'Superior photorealism for face-forward thumbnails with accurate expressions and lighting.' },
      { name: 'DALL-E 3', reason: 'Best text understanding for prompts describing complex compositional layouts and scene arrangements.' },
    ],
  },
  {
    slug: 'cinematic-portraits',
    title: 'Cinematic Portraits',
    intent: 'Build dramatic portrait prompts with lens, lighting, and mood-level precision.',
    intro: 'Use cinematic portrait prompting patterns for storytelling, emotional lighting, and consistent grading.',
    samplePrompts: [
      'cinematic portrait, rain reflections, 50mm lens, teal-orange grade, dramatic rim light',
      'editorial portrait, moody side light, textured background, high detail skin',
      'night portrait, neon signage bokeh, shallow depth of field, film grain',
      'vintage film portrait, Kodak Portra 400 color science, soft window light, grain texture',
      'dramatic chiaroscuro portrait, Rembrandt lighting, dark background, painterly quality',
    ],
    negatives: ['plastic skin', 'low detail', 'oversaturated tones', 'bad anatomy'],
    keywords: ['cinematic prompt generator', 'portrait ai prompt', 'film style prompt builder'],
    expertGuide: `Cinematic portraits represent the intersection of photography, filmmaking, and fine art — and getting them right with AI requires understanding the technical language that professional cinematographers use daily.

**Lighting is the single most important variable** in cinematic portraiture. The term "cinematic lighting" is too vague for AI prompts. Instead, name specific lighting patterns: **Rembrandt lighting** (triangle of light on the shadow-side cheek), **butterfly lighting** (overhead light creating a butterfly shadow under the nose), **split lighting** (half the face lit, half in shadow), or **rim lighting** (backlight creating an edge glow around the subject). Each pattern evokes a different mood: Rembrandt feels classical and dignified, split lighting feels mysterious and dramatic, and rim lighting feels energetic and modern.

**Color grading** defines the cinematic feel. The most popular cinematic grade is **teal-and-orange** (cool shadows, warm highlights) used in virtually every Hollywood blockbuster. Other effective grades include: **desaturated cool** (Fincher-style, blue-green shadows with muted skin), **warm vintage** (golden highlights, creamy skin tones, slight grain), and **high-contrast monochrome** (deep blacks, bright whites, dramatic skin texture). Include these as explicit tokens: "teal and orange color grade," "Kodak Portra 400 color science," or "bleach bypass processing."

**Lens selection** profoundly affects portrait character. An **85mm lens** is the traditional portrait focal length — flattering compression, beautiful bokeh, natural proportions. A **135mm lens** increases compression further, creating an intimate, telephoto look. A **35mm lens** includes environmental context with slight wide-angle distortion that feels documentary or street-photography-esque. A **50mm lens** is neutral and versatile. Always specify: "shot on 85mm f/1.4" rather than just "portrait."

**Film emulation** adds authenticity that purely digital rendering lacks. Reference specific film stocks: "Kodak Portra 400 color science" (warm, creamy skin), "Fuji Pro 400H" (cooler, green-shifted), "Ilford HP5 black and white" (gritty, high contrast), or "CineStill 800T" (warm tungsten tones with halation glow around highlights).

**Skin rendering** is the make-or-break detail. Prompt for "natural skin texture, visible pores, realistic subsurface scattering" — never accept "plastic skin" or "airbrushed" results. Include "high-detail skin, natural imperfections, subtle freckles" for authentic human rendering.

**Environmental storytelling** elevates a portrait from a headshot to a cinematic frame. Rather than "portrait with background," describe the narrative: "detective in a rain-soaked alley, neon reflections on wet pavement, condensation on glass." The background should support the character's story, not just fill space.`,
    proTips: [
      'Name specific lighting patterns (Rembrandt, butterfly, split) instead of generic "cinematic lighting" for dramatically better results.',
      'Include film stock references — "Kodak Portra 400 color science" or "CineStill 800T" for authentic cinematic color.',
      'Always specify focal length and aperture ("85mm f/1.4") — this controls background blur, compression, and overall portrait feel.',
      'Add "natural skin texture, visible pores, subsurface scattering" to avoid the plastic-skin problem common in AI portraits.',
      'Use environmental storytelling: describe what the background reveals about the character, not just "blurred background."',
    ],
    bestModels: [
      { name: 'Flux Pro', reason: 'Highest photorealism for human faces with accurate skin rendering and natural lighting response.' },
      { name: 'Midjourney v7', reason: 'Superior aesthetic quality and color grading. Best for artistic and editorial portrait styles.' },
      { name: 'Stable Diffusion XL', reason: 'Maximum control over specific styles with custom models and ControlNet for precise pose/expression control.' },
    ],
  },
  {
    slug: 'real-estate-interiors',
    title: 'Real Estate Interiors',
    intent: 'Generate polished interior prompts for listing visuals and architectural presentation.',
    intro: 'Craft interior image prompts with realistic lighting, lens framing, and material consistency.',
    samplePrompts: [
      'luxury modern living room, wide-angle 24mm, natural window light, editorial real estate style',
      'minimal Scandinavian kitchen interior, soft daylight, clean surfaces, high realism',
      'cozy bedroom interior, warm ambient lighting, balanced composition, lifestyle staging',
      'spa-like bathroom, marble surfaces, brass fixtures, diffused natural light, luxury aesthetic',
      'open-plan loft apartment, industrial-modern design, floor-to-ceiling windows, golden hour',
    ],
    negatives: ['warped perspective', 'broken geometry', 'heavy noise', 'clutter'],
    keywords: ['real estate ai prompt generator', 'interior design prompt builder', 'architecture interior prompt'],
    expertGuide: `Real estate interior visualization is a rapidly growing AI use case with direct commercial value — virtual staging, listing photography, and interior design concept presentations all benefit from fast, high-quality generation.

**Perspective accuracy** is the most critical quality factor for interior renders. Architectural interiors must have correct vertical lines (no converging walls), consistent vanishing points, and geometrically valid room proportions. Prompt for "architectural perspective, corrected verticals, wide-angle 24mm lens, straight wall lines" to minimize the geometric distortion that plagues AI interior renders. Always include "no warped geometry, accurate perspective" in your negatives.

**Lighting makes or breaks interior realism.** Professional real estate photography uses a technique called "flambient" — a blend of flash and ambient light. For AI prompts, the closest equivalent is: "natural window light mixed with warm interior ambient, soft shadows, no harsh highlights, even exposure." Specify the time of day: "morning light from east-facing windows" or "golden hour glow through floor-to-ceiling windows" for atmospheric depth.

**Material rendering** is the second pillar of convincing interiors. Modern luxury interiors rely on material contrast: matte wood against polished marble, brushed brass against textured fabrics. Be specific: "Calacatta marble countertop, European oak flooring, linen upholstery, matte black hardware." Generic terms like "nice materials" produce generic results. The more specific your material palette, the more design-literate and premium the output appears.

**Design style anchoring** prevents the model from defaulting to a generic "nice room." Name specific interior design movements: "Japandi minimalism" (Japanese-Scandinavian fusion), "California coastal modern," "mid-century modern with Eames furniture," "Parisian apartment with herringbone parquet." These tokens activate specific latent knowledge that produces coherent, recognizable design aesthetics.

**Room staging** follows professional photography principles. For real estate listings, rooms should look lived-in but impeccable: "lifestyle staging, fresh flowers on table, open book, morning coffee setup." Avoid cluttered or empty extremes. For design concepts, a more editorial approach works: "minimal styling, one accent object, negative space."

**Camera height and angle** are specialized for interiors. Professional interior photographers shoot from approximately standing eye height (5-5.5 feet) or slightly below to emphasize room volume. Prompt: "eye-level camera height, 24mm wide-angle, room overview composition" for standard listing shots. For detail shots: "45-degree angle, close-up of kitchen island, shallow depth of field, material texture focus."`,
    proTips: [
      'Always specify "wide-angle 24mm, corrected verticals, architectural perspective" for geometrically accurate interiors.',
      'Name specific design styles — "Japandi minimalism" or "mid-century modern" — instead of generic "modern interior."',
      'Include specific materials: "Calacatta marble, European oak, brushed brass" prevents generic material rendering.',
      'For real estate listings, add "lifestyle staging, tasteful accessories, lived-in but immaculate" for convincing scenes.',
    ],
    bestModels: [
      { name: 'Flux Pro', reason: 'Superior photorealism with accurate material rendering and natural lighting for convincing architectural interiors.' },
      { name: 'Midjourney v7', reason: 'Excellent aesthetic composition and atmospheric quality for editorial and aspirational interior visuals.' },
      { name: 'DALL-E 3', reason: 'Strong spatial understanding for complex room descriptions and multi-element interior compositions.' },
    ],
  },
  {
    slug: 'fashion-editorial',
    title: 'Fashion Editorial',
    intent: 'Create fashion campaign prompts with art direction, color grading, and styling control.',
    intro: 'Generate editorial-style fashion prompts for campaigns, lookbooks, and visual concepts.',
    samplePrompts: [
      'high-fashion editorial, dramatic studio lighting, monochrome palette, 85mm lens',
      'streetwear campaign shot, urban backdrop, dynamic pose, bold color accent',
      'luxury fashion portrait, minimal set design, soft shadows, magazine cover style',
      'avant-garde fashion editorial, surreal set design, bold geometric shapes, high contrast',
      'resort collection lookbook, golden hour beach, flowing fabric movement, 135mm compression',
    ],
    negatives: ['awkward anatomy', 'low detail fabric', 'flat light', 'busy background'],
    keywords: ['fashion ai prompt generator', 'editorial photo prompt', 'lookbook prompt builder'],
    expertGuide: `Fashion editorial photography exists at the intersection of art direction, styling, and technical photography — and translating this multi-layered discipline into AI prompts requires understanding what makes editorial imagery look editorial rather than commercial.

**Art direction is the invisible framework** that separates editorial from catalog photography. Editorial images tell stories, provoke emotions, and push creative boundaries. When prompting, describe the narrative and mood, not just the clothes: "defiant model against brutalist architecture, power dynamics, angular shadows" rather than "woman wearing black dress." The model's pose, the set design, and the lighting should all serve a unified creative concept.

**Fabric rendering** is the technical challenge of fashion AI. Different fabrics behave differently under light and gravity: silk catches specular highlights, wool absorbs light and shows texture, leather creates sharp reflections, and chiffon appears translucent with backlight. Prompt specifically: "flowing silk gown with visible light transmission," "heavily textured knit sweater with natural drape," or "structured leather jacket with sharp highlight edges."

**Color grading** in fashion follows seasonal and trend-driven palettes. Current editorial trends lean toward: **desaturated earth tones** (quiet luxury aesthetic), **high-contrast monochrome** (graphic impact), **pastel dreamscapes** (Gen-Z editorial), and **rich jewel tones** (luxury editorial). Specify: "muted earth tone palette, desaturated skin, warm shadows" or "high-contrast black and white, silver gelatin print quality."

**Posing vocabulary** is critical and highly specific. Fashion poses differ from portrait poses: "contrapposto stance, elongated silhouette, angular limbs" (high fashion), "candid mid-stride, captured movement" (street style), or "static frontal pose, hands at sides, editorial restraint" (minimalist editorial). Vague terms like "good pose" produce generic results.

**Set design and location** establish the editorial context. Studio shoots need specific descriptions: "infinite white cyclorama, dramatic shadow play" or "color-blocked studio set, geometric props." Location shoots need environmental storytelling: "abandoned industrial warehouse, shaft of dusty light" or "Mediterranean cliff villa, late afternoon sun." The setting is not a background — it is a co-star.

**Magazine reference** is a powerful shortcut. Naming specific publications activates associated visual standards: "Vogue Italia editorial quality," "i-D magazine cover aesthetic," "Dazed editorial." Each publication has a distinct visual identity that the model can approximate.`,
    proTips: [
      'Describe the narrative and mood, not just the clothing — editorial imagery tells a story through environment, pose, and lighting.',
      'Specify fabric behavior under light: "translucent chiffon with backlight" or "structured leather with sharp reflections."',
      'Reference specific magazine aesthetics: "Vogue Italia editorial" or "i-D magazine cover style" as quality benchmarks.',
      'Include posing vocabulary: "contrapposto, elongated silhouette, angular limbs" for authentic fashion poses.',
      'Use "editorial restraint, negative space, intentional composition" to prevent over-busy AI-generated fashion images.',
    ],
    bestModels: [
      { name: 'Midjourney v7', reason: 'Unmatched artistic quality for editorial fashion with beautiful color grading and composition instincts.' },
      { name: 'Flux Pro', reason: 'Top-tier photorealism for fabric rendering, skin detail, and studio lighting accuracy.' },
      { name: 'Stable Diffusion XL', reason: 'Deep customization with fashion-specific LoRA models for consistent brand aesthetics.' },
    ],
  },
  {
    slug: 'food-photography',
    title: 'Food Photography',
    intent: 'Generate menu-ready and ad-ready food visuals with realistic texture and lighting.',
    intro: 'Build prompts for restaurant, delivery, and product food imagery with high appetite appeal.',
    samplePrompts: [
      'gourmet burger ad shot, dramatic side light, steam detail, dark moody background',
      'fresh pasta close-up, natural light, rustic table setup, shallow depth of field',
      'dessert product hero image, clean composition, vibrant garnish detail',
      'sushi platter overhead flat lay, minimalist plating, negative space, editorial food style',
      'pour shot of espresso into ceramic cup, motion freeze, rich crema detail, coffee shop atmosphere',
    ],
    negatives: ['plastic texture', 'muted colors', 'blurry garnish', 'overprocessed look'],
    keywords: ['food photography ai prompt', 'restaurant prompt generator', 'menu image prompt'],
    expertGuide: `Food photography is a specialized discipline where the goal is to create **appetite appeal** — making the viewer hungry through visual stimulation. This requires understanding how lighting, color, texture, and composition work together to make food look irresistible.

**Lighting strategy** determines whether food looks fresh or flat. The two dominant approaches are: **natural light** (soft, directional window light that reveals texture and creates gentle shadows) and **dramatic artificial** (hard side light with deep shadows for moody, restaurant-menu aesthetics). Prompt specifically: "soft natural window light from left, gentle fill, food photography lighting" or "dramatic single-source side light, deep shadows, dark background, moody food photography."

**Texture is the hero** of food photography. Food must look like you can reach in and touch it. Prompt for specific texture rendering: "glistening sauce with visible sheen," "crispy golden crust with breadcrumb detail," "steam rising from hot dish, condensation on glass." Without texture-specific tokens, AI defaults to smooth, plastic-looking food that fails the appetite test.

**Color vibrance** serves a different purpose in food than in other photography genres. Food images benefit from **slightly enhanced saturation** — deep reds in tomatoes, rich greens in herbs, golden browns in roasted items. Prompt for "vibrant food colors, rich saturation, appetite appeal" but avoid "oversaturated" which creates an artificial look. Fresh garnishes (microgreens, herb sprigs, citrus zest) add color accents that make the composition pop.

**Composition rules** are genre-specific for food. The three dominant compositions are: **overhead/flat lay** (top-down, ideal for plated dishes and spreads — "overhead flat lay, food arrangement, negative space"), **45-degree angle** (most natural viewing angle, shows dimension — "three-quarter angle, eye-level plate view"), and **macro close-up** (texture-focused detail shots — "extreme close-up, shallow DOF, filling texture detail").

**Surface and prop styling** sets the mood. The surface under the food is as important as the food itself: "weathered wood table" (rustic, artisan), "marble countertop" (luxury, clean), "dark slate surface" (moody, restaurant), "linen tablecloth" (home cooking, editorial). Props should support but not distract: "scattering of fresh ingredients, vintage silverware, linen napkin."

**Motion capture** adds life to food images. Steam, pouring liquids, drizzling sauces — these moments of motion create urgency and freshness. Prompt: "honey drizzle mid-pour, golden stream, motion freeze" or "steam rising from fresh bread, atmospheric effect." These dynamic elements separate professional food photography from static product shots.`,
    proTips: [
      'Always specify the light direction — "side light from left" or "backlight with fill" creates depth that "good lighting" cannot.',
      'Add texture tokens for every food element: "glistening sauce, crispy crust, fresh herb detail, condensation droplets."',
      'Include a surface description: "dark slate" for moody, "rustic wood" for artisan, "white marble" for clean and modern.',
      'Use motion elements: "steam rising, sauce drizzle mid-pour, cheese pull" to create appetite appeal and energy.',
      'Prompt for "45-degree angle" as your default — it is the most natural food-viewing angle and shows dimension.',
    ],
    bestModels: [
      { name: 'Flux Pro', reason: 'Best photorealism for food textures, liquid rendering, and realistic material surfaces.' },
      { name: 'Midjourney v7', reason: 'Excellent aesthetic composition with beautiful color palette and mood control for editorial food imagery.' },
      { name: 'DALL-E 3', reason: 'Strong understanding of complex food scene descriptions with multiple elements and props.' },
    ],
  },
  {
    slug: 'game-concepts',
    title: 'Game Concepts',
    intent: 'Create concept art prompts for environments, props, and character ideation.',
    intro: 'Use game art prompt structures for stronger silhouettes, mood lighting, and clear art direction.',
    samplePrompts: [
      'fantasy game environment concept, ancient ruins, volumetric light shafts, epic scale',
      'sci-fi character concept sheet, front and side view, armor details, neutral backdrop',
      'stylized weapon concept, clean orthographic presentation, high detail materials',
      'underwater alien biome concept, bioluminescent flora, deep blue palette, exploration mood',
      'post-apocalyptic marketplace, bustling NPCs, narrative detail, painterly concept art style',
    ],
    negatives: ['inconsistent style', 'low readability', 'messy silhouette', 'bad perspective'],
    keywords: ['game concept prompt generator', 'character concept ai prompt', 'environment concept prompt'],
    expertGuide: `Game concept art serves a specific production purpose: it is **a communication tool for development teams**, not a final artwork. Understanding this functional context is essential for prompting concept art that is actually useful in a game development pipeline.

**Silhouette readability** is the first principle of game character design. A well-designed character should be recognizable from its silhouette alone at game-camera distance. Prompt for "strong, readable silhouette, distinctive shape language, high contrast against neutral background." For character concepts, always include "neutral gray background, clean composition" so the design details are unambiguous.

**Character concept sheets** are the most requested game art asset. These show a character from multiple angles on a single image: "character turnaround sheet, front view, three-quarter view, side view, back view, consistent design, white background, full body." Include spec details: "with callout annotations, material notes, color palette swatch." This directly mirrors the asset sheets that 3D modelers use for reference.

**Environment concepts** need to communicate **scale, mood, and gameplay implications**. Include human figures or known-size objects for scale reference: "massive cathedral interior, tiny explorer figure for scale, volumetric god rays." Describe the gameplay mood: "ominous dungeon, low visibility, threatening atmosphere" or "peaceful hub area, warm lighting, welcoming color palette." The concept art should make a level designer understand what the space feels like to move through.

**Art style anchoring** prevents the model from mixing incompatible aesthetics. Name specific style references: "in the style of Dishonored concept art" (painterly, steampunk), "Breath of the Wild art direction" (cel-shaded, pastoral), "Dark Souls aesthetic" (dark fantasy, gothic grandeur). Without style anchoring, AI tends to produce generic fantasy art that lacks a cohesive visual identity.

**Weapon and prop concepts** need orthographic presentation — flat, straight-on views without perspective distortion. Prompt: "weapon concept art, orthographic view, clean presentation on white background, material callouts, scale reference." Include material specifications: "rusted iron blade with leather grip wrapping, glowing enchantment runes."

**Color palette discipline** is often overlooked. Professional concept artists work within strict color budgets. Prompt for palette-limited outputs: "limited palette, 5-color maximum, cohesive color harmony" or reference specific color moods: "warm desert palette, ochre and burnt sienna dominance, cool shadow accents."

**Painterly technique** is the hallmark of professional concept art. Prompt for "digital painting, visible brushstrokes, painterly rendering, concept art quality" rather than photorealism. The goal is to convey ideas quickly and with artistic energy, not to produce final renders.`,
    proTips: [
      'For character sheets, specify "turnaround: front, side, three-quarter, back views, consistent design, neutral background."',
      'Include human figures in environment concepts for scale reference — "tiny explorer for scale" immediately communicates size.',
      'Anchor your art style: "Dishonored concept art style" or "Breath of the Wild art direction" prevents generic output.',
      'Prompt for "painterly, visible brushstrokes, concept art rendering" — concept art should look like concept art, not renders.',
      'Use "limited color palette, 5-color maximum" to enforce the disciplined color harmony that professional concept artists use.',
    ],
    bestModels: [
      { name: 'Midjourney v7', reason: 'Superior artistic quality with painterly rendering that matches professional concept art aesthetics.' },
      { name: 'Stable Diffusion XL', reason: 'Best for character sheets and turnarounds with ControlNet pose control and custom concept art LoRAs.' },
      { name: 'Leonardo.ai', reason: 'Strong character consistency features and fine-tuned models specifically for game asset generation.' },
    ],
  },
  {
    slug: 'pixel-art',
    title: 'Pixel Art',
    intent: 'Generate controlled pixel-art prompts with coherent style and color palette limits.',
    intro: 'Build pixel prompts for retro assets, sprites, and scene compositions with cleaner output.',
    samplePrompts: [
      'retro pixel art city street, 16-bit palette, side view composition',
      'pixel art character sprite, idle pose, transparent background, game-ready',
      'isometric pixel tavern interior, cozy lighting, handcrafted detail',
      'pixel art forest tileset, modular design, consistent palette, RPG Maker compatible',
      'pixel art boss character, attack animation keyframe, 64x64 sprite, dark fantasy theme',
    ],
    negatives: ['smooth gradients', 'photorealism', 'anti-aliased blur', 'inconsistent pixel size'],
    keywords: ['pixel art ai prompt generator', 'retro prompt builder', 'sprite prompt generator'],
    expertGuide: `Pixel art generation with AI is uniquely challenging because pixel art is defined by **deliberate, hand-placed constraints** — limited resolution, restricted color palettes, and visible individual pixels. These constraints are what give pixel art its charm, but AI models naturally want to add detail and smoothness, working against the medium's aesthetic.

**Resolution specification** is the most important technical parameter. Pixel art operates at specific resolution tiers: **8-bit** (very low res, ~16×16 to 32×32 pixels, NES-era), **16-bit** (moderate detail, ~32×32 to 64×64, SNES-era), and **32-bit** (higher detail, ~128×128+, PS1-era). Always specify the target resolution tier: "16-bit pixel art, SNES-era detail level" or "low-res 8-bit sprite, NES palette." Without this, AI models produce high-res art with pixel-art textures — a common and unsatisfying hybrid.

**Palette constraint** is the second pillar. Authentic pixel art uses limited color palettes — the NES supported 54 colors, the Game Boy had 4 shades of green. Prompt for palette limits: "4-color palette," "16-color SNES palette," or reference specific famous palettes: "Pico-8 palette constraints," "Endesga 32 palette." The restriction forces creative use of dithering and color contrast that defines the pixel art aesthetic.

**Anti-aliasing is the enemy.** AI models naturally want to smooth edges, creating blurred, soft transitions between colors. Authentic pixel art has **hard pixel edges** with no sub-pixel smoothing. Always include in your prompt: "no anti-aliasing, hard pixel edges, crisp pixel boundaries" and in negatives: "smooth gradients, blurred edges, anti-aliased, soft transitions."

**Dithering patterns** are the pixel artist's equivalent of shading. Instead of smooth gradients, pixel art uses checkerboard and stripe patterns to simulate intermediate tones. Prompt for "dithering shading, checkerboard pattern gradients, pixel-accurate shadows" to get authentic shading.

**Sprite sheet formatting** is essential for game-ready output. For characters, prompt: "sprite sheet, idle animation frames, 4 directional views, consistent pixel size, transparent background, game-ready format." For tilesets: "modular tile design, seamless edges, 16×16 tile grid, orthographic view." These formatting tokens produce outputs that can be directly imported into game engines.

**Isometric pixel art** has specific rules: "isometric perspective, 2:1 pixel ratio angle, consistent light source from top-left, dimetric projection." The 2:1 ratio is the standard isometric angle in pixel art and produces the cleanest results.

**Color hierarchy** determines readability. Use lighter, warmer colors for important gameplay elements (items, characters) and darker, cooler colors for backgrounds and terrain. This ensures visual hierarchy at the tiny resolutions pixel art operates at.`,
    proTips: [
      'Always specify the resolution tier — "16-bit SNES style" or "8-bit NES era" — to prevent hybrid high-res pixel art.',
      'Include "no anti-aliasing, hard pixel edges" in every prompt and "smooth gradients, anti-aliased" in negatives.',
      'Reference specific palettes: "Pico-8 palette" or "4-color Game Boy palette" for authentic color restrictions.',
      'For game assets, prompt for "sprite sheet, consistent pixel size, transparent background, game-ready format."',
      'Add "dithering shading, checkerboard patterns" to get authentic pixel art shading instead of smooth gradients.',
    ],
    bestModels: [
      { name: 'Stable Diffusion XL', reason: 'Best with custom pixel art LoRA models and precise control over resolution and palette constraints.' },
      { name: 'Midjourney v7', reason: 'Strong aesthetic instincts produce visually appealing pixel art compositions with good color harmony.' },
      { name: 'DALL-E 3', reason: 'Reliable understanding of pixel art style descriptions and consistent execution of resolution constraints.' },
    ],
  },
  {
    slug: 'fantasy-scenes',
    title: 'Fantasy Scenes',
    intent: 'Create fantasy worldbuilding prompts with strong scale, atmosphere, and narrative focus.',
    intro: 'Use this page to craft fantasy prompts with layered composition and rich environmental storytelling.',
    samplePrompts: [
      'ancient dragon temple in misty mountains, cinematic scale, glowing runes',
      'fantasy village at dusk, warm lantern light, detailed worldbuilding',
      'mage duel in stormy ruins, dynamic energy effects, dramatic composition',
      'floating sky islands connected by ancient bridges, aerial perspective, volumetric clouds',
      'enchanted forest with bioluminescent flora, mystical atmosphere, soft particle effects',
    ],
    negatives: ['flat composition', 'muddy lighting', 'low detail faces', 'artifacting'],
    keywords: ['fantasy ai prompt generator', 'worldbuilding prompt', 'epic scene prompt'],
    expertGuide: `Fantasy scene generation is where AI image tools truly shine — creating impossible landscapes, epic architecture, and atmospheric worlds that would take traditional artists weeks to paint. The key to great fantasy scenes is understanding **scale, atmosphere, and narrative depth**.

**Scale communication** is the defining characteristic of epic fantasy imagery. Without scale reference, even the grandest castle looks like a toy. Always include scale indicators: "tiny figures on the pathway for scale," "birds circling distant towers," or "massive gate dwarfing approaching travelers." Size juxtaposition creates the "awe factor" that makes fantasy scenes feel genuinely epic.

**Atmospheric perspective** is a fundamental painting technique that AI responds to well. Objects farther from the camera should appear lighter, bluer, and less detailed — this creates depth. Prompt for "atmospheric perspective, distant mountains fading to blue, layered depth, visible haze between foreground and background." Without this, fantasy scenes feel flat like stage backdrops rather than deep, inhabitable worlds.

**Lighting as narrative** transforms a pretty landscape into a story. Different lighting setups convey different narrative moments: "golden hour light through ancient windows" (discovery, warmth), "stormy dramatic sky with lightning" (conflict, danger), "moonlit scene with fog" (mystery, intrigue), "volcanic red glow from below" (underworld, threat). Name the narrative intent alongside the lighting setup.

**Layered composition** uses foreground, midground, and background elements to create visual depth. Prompt explicitly: "foreground: overgrown stone archway frame; midground: ruined city streets with scattered detail; background: towering citadel against dramatic sky." This three-layer approach mimics how matte painters and concept artists construct fantasy environments.

**Material and surface storytelling** adds history to fantasy structures. Instead of "old building," describe the aging: "moss-covered walls, cracked stone revealing inner brick, ivy reclaiming ancient architecture, weathered copper patina on domes." These tokens communicate thousands of years of history without exposition.

**Magic and energy effects** need specific visual language. "Magic effects" is too vague. Instead: "arcane runes glowing with cyan light, particle dispersion effect, energy tendrils, luminous mist, crystalline light refraction." Specify the color and behavior of magical elements to get controlled, visually coherent effects rather than random light blobs.

**Weather and atmosphere** complete the world. "Volumetric fog rolling through valleys," "dust motes in shaft of light through collapsed ceiling," "aurora borealis reflecting on still lake surface." These environmental effects add the final layer of believability that makes fantasy worlds feel real enough to visit.`,
    proTips: [
      'Always include scale reference — "tiny figures for scale" or "birds circling towers" turns a landscape into an epic vista.',
      'Use three-layer composition: describe foreground, midground, and background separately for maximum depth.',
      'Add surface aging: "moss-covered, cracked stone, ivy reclamation, weathered copper" tells centuries of history.',
      'Specify magic effects precisely: "cyan arcane runes, particle dispersion, luminous tendrils" beats generic "magic effects."',
      'Include atmospheric perspective: "distant mountains fading to blue, visible haze" prevents flat-looking fantasy scenes.',
    ],
    bestModels: [
      { name: 'Midjourney v7', reason: 'Unmatched for epic fantasy compositions with incredible atmosphere, lighting, and artistic drama.' },
      { name: 'Stable Diffusion XL', reason: 'Excellent with fantasy-specific LoRA models and maximum creative control over style and detail.' },
      { name: 'Flux Pro', reason: 'Strong environmental realism for grounded fantasy scenes that feel physically plausible.' },
    ],
  },
  {
    slug: 'architecture',
    title: 'Architecture',
    intent: 'Generate architectural prompts for concept boards, rendering drafts, and client visuals.',
    intro: 'Craft architecture prompts with structural clarity, lens control, and realistic material behavior.',
    samplePrompts: [
      'futuristic museum architecture, golden hour exterior, ultra clean lines',
      'modern villa facade, tropical landscaping, editorial architecture style',
      'brutalist civic building concept, cloudy dramatic sky, wide-angle framing',
      'parametric facade design, biomimetic structure, sunset glass reflections, 24mm tilt-shift',
      'sustainable campus building, green roof, cross-section diagram view, presentation rendering',
    ],
    negatives: ['warped geometry', 'inconsistent perspective', 'plastic materials', 'low detail'],
    keywords: ['architecture ai prompt generator', 'building render prompt', 'architectural concept prompt'],
    expertGuide: `Architectural visualization with AI is evolving from experimental to production-useful, but achieving results that satisfy architects and designers requires understanding both the technical vocabulary of architecture and the visual standards of architectural rendering.

**Geometric accuracy** is non-negotiable for architecture. Buildings have parallel walls, right angles, and consistent structural logic. AI models frequently distort these fundamentals. Counter this by prompting explicitly: "architecturally accurate, correct structural proportions, parallel vertical lines, consistent window grid, geometrically valid structure." Use tilt-shift lens references to correct perspective: "24mm tilt-shift lens, corrected perspective, professional architectural photography."

**Architectural style specificity** prevents generic "futuristic building" outputs. Reference specific movements: "Zaha Hadid parametric design" (flowing, organic curves), "Tadao Ando minimalism" (raw concrete, light and water), "Mies van der Rohe modernism" (glass and steel, less-is-more), "Gothic Revival" (pointed arches, ribbed vaults, flying buttresses). Each style has distinct structural vocabulary, material palettes, and proportional rules.

**Material rendering** determines the professional quality of architectural visuals. Specify exact materials: "exposed off-form concrete with board-mark texture," "curtain wall glazing with sky reflections," "Corten steel cladding with natural rust patina," "travertine cladding with visible vein pattern." Architecture is fundamentally about materials meeting light, and precision here separates amateur from professional output.

**Environmental context** transforms a building render into an architectural vision. Describe the setting: "set within dense urban fabric, surrounding city context," "on a clifftop overlooking the sea," or "in a manicured Japanese garden landscape." Include vegetation: "mature olive trees, ornamental grasses, green roof with sedum planting." The landscape design is as important as the building in architectural visualization.

**Presentation rendering types** have distinct visual standards. **Exterior hero shots** use dramatic lighting: "golden hour, long shadows, warm sky gradient." **Section cuts** show internal organization: "building cross-section, interior spaces visible, labeled floor levels." **Diagram views** communicate design intent: "axonometric diagram, exploded view, program color-coding." **Night renders** showcase lighting design: "interior glow through glazing, exterior landscape lighting, blue-hour sky."

**Lighting for architecture** follows specific rules. Buildings are photographed during "golden hour" (sunset/sunrise) or "blue hour" (just after sunset) for maximum drama. Interior renders need balanced natural and artificial light: "natural daylight through skylights, warm artificial accent lighting, balanced interior exposure." Avoid midday harsh light which flattens architectural detail.

**Scale indicators** help viewers understand building size: "people walking on ground level for scale," "adjacent street with parked cars," "mature trees showing building height." Without human-scale reference, even a skyscraper can look like a model.`,
    proTips: [
      'Include "24mm tilt-shift lens, corrected perspective" to prevent the vertical line convergence that ruins architectural renders.',
      'Reference specific architects or movements: "Zaha Hadid parametric" or "Tadao Ando concrete minimalism" for coherent styles.',
      'Specify exact materials: "exposed board-formed concrete" or "Corten steel with rust patina" — not generic "concrete" or "metal."',
      'Add "people at ground level for scale, mature trees" to communicate building proportions accurately.',
      'Use "golden hour exterior rendering" or "blue hour night render" — these are the standard lighting conditions for professional arch viz.',
    ],
    bestModels: [
      { name: 'Flux Pro', reason: 'Highest photorealism for architectural materials, lighting, and structural detail fidelity.' },
      { name: 'Midjourney v7', reason: 'Exceptional composition and atmospheric quality for presentation renders and concept visuals.' },
      { name: 'DALL-E 3', reason: 'Strong understanding of architectural descriptions and spatial relationships for complex building concepts.' },
    ],
  },
];

export const modelDisplayNames: Record<AIModel, string> = {
  flux: 'Flux',
  'flux-pro': 'Flux Pro',
  'midjourney-v7': 'Midjourney v7',
  midjourney: 'Midjourney v6',
  'stable-diffusion': 'Stable Diffusion XL',
  'dall-e': 'DALL-E 3',
  'nano-banana': 'Nano Banana Pro',
  firefly: 'Adobe Firefly 3',
  ideogram: 'Ideogram 2.0',
  leonardo: 'Leonardo.ai',
  recraft: 'Recraft V3',
  gpt4o: 'GPT-4o',
};

export const modelUseCaseHints: Record<AIModel, string> = {
  flux: 'Strong for realistic texture and human anatomy.',
  'flux-pro': 'Best for high detail and commercial prompt workflows.',
  'midjourney-v7': 'Excellent for stylized quality and artistic direction.',
  midjourney: 'Reliable legacy Midjourney syntax and broad community defaults.',
  'stable-diffusion': 'Great for custom models, ControlNet, and advanced control.',
  'dall-e': 'Natural language prompts with solid interpretation.',
  'nano-banana': 'Useful for text-heavy imagery and editing-driven tasks.',
  firefly: 'Business-safe pipeline integrated with Adobe tools.',
  ideogram: 'Top choice for text rendering and logo-style compositions.',
  leonardo: 'Strong for character and game asset prompt patterns.',
  recraft: 'Vector and icon-oriented output with cleaner shape control.',
  gpt4o: 'Conversational refinement loops and multi-step iteration.',
};

export function getPromptUseCase(slug: string) {
  return promptUseCases.find((item) => item.slug === slug);
}

export function getAllPromptUseCaseSlugs() {
  return promptUseCases.map((item) => item.slug);
}

export function getAllModelSlugs() {
  return Object.keys(modelDisplayNames) as AIModel[];
}

export function getRelatedPromptUseCases(slug: string, limit = 4) {
  return promptUseCases
    .filter((item) => item.slug !== slug)
    .slice(0, Math.max(1, limit));
}
