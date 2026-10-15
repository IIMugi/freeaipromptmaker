import type { BuilderGroup, BuilderOption, UseCaseBuilderConfig } from '@/lib/use-case-prompt';

export interface ExampleGroup {
  heading: string;
  prompts: readonly string[];
}

export interface PromptUseCase {
  slug: string;
  /** Short name for cards and related links. */
  name: string;
  h1: string;
  /** `{count}` is replaced with the number of example prompts. */
  metaTitle: string;
  description: string;
  lead: string;
  builder: UseCaseBuilderConfig;
  examples: readonly ExampleGroup[];
  tips: readonly string[];
  /** Verified blog post slugs to link as further reading. */
  guides: readonly string[];
}

const opt = (id: string, label: string, value: string): BuilderOption => ({ id, label, value });
const single = (id: string, label: string, options: BuilderOption[]): BuilderGroup => ({ id, label, multiple: false, options });
const multi = (id: string, label: string, options: BuilderOption[]): BuilderGroup => ({ id, label, multiple: true, options });

export const promptUseCases: PromptUseCase[] = [
  {
    slug: 'youtube-thumbnails',
    name: 'YouTube Thumbnails',
    h1: 'YouTube Thumbnail Prompt Generator',
    metaTitle: 'YouTube Thumbnail Prompt Generator + {count} Free AI Prompts',
    description:
      'Free YouTube thumbnail prompt generator. Pick a layout, style and light, then copy a prompt for Midjourney, SDXL, Flux or ChatGPT. Plus copy-paste examples.',
    lead:
      'Describe your video in a few words, pick a layout and a look, and copy a thumbnail prompt formatted for your image model. The default layout leaves empty space for a title you add later in an editor.',
    builder: {
      subjectLabel: 'What is the video about?',
      defaultSubject: 'a surprised creator holding a glowing smartphone',
      tag: 'youtube thumbnail',
      sentence: 'A YouTube thumbnail of',
      groups: [
        single('layout', 'Layout', [
          opt('space-right', 'Subject left, space right', 'subject on the left third, empty space on the right for a title'),
          opt('close-up', 'Face close-up', 'extreme close-up of the face, exaggerated expression'),
          opt('split', 'Before / after split', 'split-screen before and after comparison, clear dividing line'),
          opt('hero-object', 'Single object', 'single object as the hero, centered, large in frame'),
          opt('wide', 'Wide scene', 'wide shot with one clear focal point'),
        ]),
        single('style', 'Style', [
          opt('bold', 'Bold & saturated', 'bold saturated colors, high contrast'),
          opt('clean-tech', 'Clean tech', 'clean minimal tech style, soft gradient background'),
          opt('cinematic', 'Cinematic', 'cinematic color grade, teal and orange'),
          opt('3d', '3D render', '3D render, glossy materials'),
          opt('flat', 'Flat illustration', 'flat vector illustration, thick outlines'),
          opt('moody', 'Dark & moody', 'dark moody background, single spotlight'),
        ]),
        single('light', 'Lighting', [
          opt('rim', 'Rim light', 'strong rim light separating the subject from the background'),
          opt('studio', 'Bright studio', 'bright even studio lighting'),
          opt('neon', 'Neon', 'neon glow accents'),
          opt('golden', 'Golden hour', 'warm golden hour light'),
        ]),
        multi('extras', 'Extras', [
          opt('arrow', 'Arrow', 'a bold red arrow pointing at the key detail'),
          opt('outline', 'Glow outline', 'white glow outline around the subject'),
          opt('bokeh', 'Blurred background', 'blurred background, shallow depth of field'),
          opt('motion', 'Motion streaks', 'motion streaks for energy'),
        ]),
      ],
      defaults: { layout: ['space-right'], style: ['bold'], light: ['rim'] },
      aspectRatios: ['16:9', '9:16', '1:1'],
      negatives: ['text', 'letters', 'watermark', 'logo', 'blurry', 'lowres', 'cluttered background', 'extra fingers'],
      midjourneyNo: ['text', 'letters', 'watermark', 'logo'],
    },
    examples: [
      {
        heading: 'Gaming',
        prompts: [
          'youtube thumbnail, gamer screaming at the camera, controller in hand, explosion of colorful light behind, bold saturated colors, empty space on the right',
          'youtube thumbnail, giant boss monster looming over a tiny player character, dramatic low angle, red and black palette, high contrast',
          'youtube thumbnail, blocky voxel world split in half, left side green and peaceful, right side burning, before and after comparison',
          'youtube thumbnail, treasure chest overflowing with glowing loot, centered, golden light rays, dark cave background',
          'youtube thumbnail, two esports players face to face, blue versus red lighting, intense expressions, lightning between them',
          'youtube thumbnail, speedrunner character mid-jump with motion streaks, timer-style glowing frame, neon purple background',
        ],
      },
      {
        heading: 'Tech and reviews',
        prompts: [
          'youtube thumbnail, new smartphone floating at an angle, glossy reflections, clean gradient background, subject on the left, empty space on the right',
          'youtube thumbnail, close-up of a man raising one eyebrow while holding a laptop, studio lighting, minimal tech style',
          'youtube thumbnail, two headphones side by side with a glowing VS divider, clean white background, product photography style',
          'youtube thumbnail, desk setup with RGB lighting, wide shot, purple and cyan glow, one keyboard in sharp focus',
          'youtube thumbnail, broken phone screen with dramatic cracks, extreme close-up, harsh side light, dark background',
          'youtube thumbnail, robot hand and human hand reaching toward each other, soft blue glow, cinematic color grade',
        ],
      },
      {
        heading: 'Tutorials and how-to',
        prompts: [
          'youtube thumbnail, hands typing on a keyboard with a glowing code window behind, clean tech style, empty space on the right',
          'youtube thumbnail, messy garage on the left and organized garage on the right, before and after split, bright daylight',
          'youtube thumbnail, paint brush and fresh paint stroke across a white wall, bold color, single object as the hero',
          'youtube thumbnail, woman pointing at a giant floating checklist, friendly smile, bright studio lighting, flat pastel background',
          'youtube thumbnail, close-up of a guitar fretboard with one finger pressing a string, warm light, shallow depth of field',
          'youtube thumbnail, kitchen knife slicing a tomato in slow motion, droplets frozen in the air, dark background, rim light',
        ],
      },
      {
        heading: 'Vlogs and travel',
        prompts: [
          'youtube thumbnail, traveler with a backpack standing at a cliff edge above turquoise sea, wide shot, golden hour, cinematic color grade',
          'youtube thumbnail, excited couple taking a selfie in a crowded night market, neon signs, warm and cool contrast',
          'youtube thumbnail, tiny cabin in a snowy forest at blue hour, warm window light, cozy mood, empty sky for a title',
          'youtube thumbnail, person sitting on a suitcase in an empty airport at night, cinematic, moody blue light',
          'youtube thumbnail, morning routine flat lay, coffee, journal and phone on a bright table, overhead view, soft daylight',
          'youtube thumbnail, van parked by a mountain lake, wide shot, sunrise mist, subject on the left third',
        ],
      },
      {
        heading: 'Money and business',
        prompts: [
          'youtube thumbnail, man holding a stack of cash with a shocked face, green glow behind, bold saturated colors',
          'youtube thumbnail, stock chart arrow crashing down through the floor, dramatic red lighting, 3D render',
          'youtube thumbnail, empty wallet on the left and full piggy bank on the right, before and after split, clean background',
          'youtube thumbnail, young entrepreneur at a laptop in a dark room lit only by the screen, cinematic, empty space on the right',
          'youtube thumbnail, giant golden key unlocking a padlock shaped like a house, 3D render, soft studio light',
          'youtube thumbnail, woman pointing at a rising graph, confident smile, clean minimal office background, bright light',
        ],
      },
      {
        heading: 'Reactions and challenges',
        prompts: [
          'youtube thumbnail, two friends reacting with wide eyes and open mouths, bright yellow background, glow outline around both',
          'youtube thumbnail, person standing in front of 100 identical boxes, one box glowing, wide shot, playful mood',
          'youtube thumbnail, close-up of a face covered in ice, frosty breath, blue light, extreme expression',
          'youtube thumbnail, giant burger next to a small person for scale, studio lighting, bold red background',
          'youtube thumbnail, hand hovering over a big red button, dramatic spotlight, dark background, tension',
          'youtube thumbnail, kid laughing in a ball pit full of colorful balls, high angle, bright saturated colors',
        ],
      },
    ],
    tips: [
      'YouTube recommends 3840 × 2160 thumbnails for videos (16:9) and 2160 × 3840 for Shorts (9:16), with a minimum width of 640 pixels; podcast playlists use 1:1. Most image models output less, so upscale before you upload.',
      'Check the result at the size people will see it. On a phone a thumbnail is a small card, so one face or one object reads better than a busy scene.',
      'Add the title in an editor such as Canva, Photoshop or Figma. You control the font and spelling there; image models can still garble longer text.',
      'Do not use another creator’s face, a celebrity or a brand logo without permission.',
    ],
    guides: ['2026-02-23-master-ai-art-emotion-prompts', '2026-02-16-master-ai-art-lenses-prompts-guide', '2025-11-29-stable-diffusion-negative-prompts-guide'],
  },
  {
    slug: 'anime',
    name: 'Anime',
    h1: 'Anime Prompt Generator',
    metaTitle: 'Anime Prompt Generator: {count} AI Anime Art Prompts to Copy',
    description:
      'Free AI anime prompt generator for characters and scenes. Choose a style, shot and lighting, then copy a prompt for Midjourney, SDXL, Flux or ChatGPT.',
    lead:
      'Describe your character or scene, choose an anime style, a shot and the light, and copy a prompt formatted for your image model. Below the generator are copy-paste prompts for characters, action scenes and backgrounds.',
    builder: {
      subjectLabel: 'Character or scene',
      defaultSubject: 'a girl with short silver hair in a school uniform, holding a transparent umbrella',
      tag: 'anime style illustration',
      sentence: 'An anime-style illustration of',
      groups: [
        single('style', 'Style', [
          opt('modern', 'Modern TV anime', 'modern anime key visual, clean line art, cel shading'),
          opt('retro', '90s retro', '1990s retro anime style, film grain, muted colors'),
          opt('watercolor', 'Soft watercolor', 'soft watercolor anime style, pastel colors'),
          opt('chibi', 'Chibi', 'chibi style, big head, small body, cute'),
          opt('dark', 'Dark fantasy', 'dark fantasy anime style, dramatic shadows'),
          opt('mecha', 'Mecha', 'mecha anime style, detailed mechanical design'),
        ]),
        single('shot', 'Shot', [
          opt('portrait', 'Portrait', 'upper body portrait, looking at viewer'),
          opt('full', 'Full body', 'full body shot, dynamic pose'),
          opt('sheet', 'Character sheet', 'character reference sheet, front, side and back views, plain background'),
          opt('wide', 'Wide scene', 'wide shot, detailed background'),
          opt('low', 'Low angle', 'low angle shot, dramatic perspective'),
        ]),
        single('light', 'Lighting', [
          opt('sunset', 'Sunset', 'sunset backlight, warm glow'),
          opt('neon', 'Night neon', 'night city lights, neon reflections'),
          opt('day', 'Soft daylight', 'soft daylight'),
          opt('moon', 'Moonlight', 'cool moonlight, glowing particles'),
          opt('rain', 'Rain', 'rainy atmosphere, wet reflections'),
        ]),
        multi('extras', 'Extras', [
          opt('sakura', 'Cherry blossoms', 'falling cherry blossom petals'),
          opt('wind', 'Wind', 'hair and clothes blowing in the wind'),
          opt('bokeh', 'Bokeh', 'bokeh background'),
          opt('eyes', 'Detailed eyes', 'detailed expressive eyes'),
        ]),
      ],
      defaults: { style: ['modern'], shot: ['portrait'], light: ['rain'] },
      aspectRatios: ['2:3', '1:1', '16:9', '9:16'],
      negatives: ['lowres', 'blurry', 'bad anatomy', 'bad hands', 'extra fingers', 'jpeg artifacts', 'watermark', 'signature', 'text'],
      midjourneyNo: ['text', 'watermark', 'signature'],
    },
    examples: [
      {
        heading: 'Characters',
        prompts: [
          'anime style illustration, girl with long black hair and red eyes, black sailor uniform, standing on a rooftop at sunset, wind blowing her hair, upper body portrait',
          'anime style illustration, cheerful boy with messy orange hair and a bandage on his cheek, holding a skateboard, bright daylight, full body',
          'anime style illustration, elegant elf mage with silver braids and a glowing staff, forest background, soft moonlight, detailed expressive eyes',
          'anime style illustration, stoic swordsman in a dark kimono, katana on his shoulder, falling cherry blossom petals, low angle',
          'anime style illustration, shy girl with round glasses reading in a library, warm afternoon light through tall windows',
          'anime style illustration, cyberpunk hacker girl with neon pink hair and headphones, holographic screens around her, night city lights',
          'anime style illustration, old kind wizard with a long white beard and a tiny dragon on his shoulder, cozy study, candlelight',
          'anime style illustration, character reference sheet of a young knight, front, side and back views, plain white background, clean line art',
        ],
      },
      {
        heading: 'Action and fantasy',
        prompts: [
          'anime style illustration, magical girl transformation, ribbons of light spiraling around her, sparkles, pastel gradient sky, dynamic pose',
          'anime style illustration, two swordsmen clashing on a bridge in the rain, sparks flying, dramatic low angle, wet reflections',
          'anime style illustration, giant mecha kneeling in a ruined city, pilot climbing out, dusty sunset light, wide shot',
          'anime style illustration, fire mage casting a huge flame spell, glowing runes, dark fantasy style, dramatic shadows',
          'anime style illustration, girl riding a white wolf through a snowy forest, motion blur, cold blue light',
          'anime style illustration, samurai standoff at dawn on a grass field, wind-blown petals, wide-angle composition',
          'anime style illustration, sky pirate ship flying above clouds, crew on deck, golden hour, detailed background',
          'anime style illustration, hero falling through the sky with a glowing sword, city far below, dramatic perspective',
        ],
      },
      {
        heading: 'Slice of life',
        prompts: [
          'anime style illustration, two friends sharing an umbrella on a rainy street, warm shop lights, soft colors',
          'anime style illustration, girl eating ramen at a tiny counter restaurant at night, steam rising, cozy warm light',
          'anime style illustration, high school classroom after school, empty desks, orange sunset light through windows',
          'anime style illustration, boy riding a bicycle down a hill by the sea in summer, blue sky, big clouds',
          'anime style illustration, cat sleeping on a windowsill next to potted plants, soft morning light, watercolor style',
          'anime style illustration, summer festival at night, girl in a yukata holding a goldfish bag, paper lanterns, fireworks',
          'anime style illustration, quiet train ride at sunset, girl looking out the window, warm light on her face',
          'anime style illustration, small cafe interior with a barista making latte art, warm wooden tones, soft bokeh',
        ],
      },
      {
        heading: 'Backgrounds and scenery',
        prompts: [
          'anime background art, countryside train station in summer, cicada season, tall grass, big cumulus clouds, no people',
          'anime background art, futuristic Tokyo street at night in the rain, neon signs, wet asphalt reflections',
          'anime background art, floating islands with waterfalls, bright blue sky, fantasy landscape, wide shot',
          'anime background art, old shrine stairs in a forest, red torii gates, dappled sunlight',
          'anime background art, cozy bedroom with posters and fairy lights, evening, warm light, detailed interior',
          'anime background art, starry night over a quiet lake, meteor shower, reflections on the water',
        ],
      },
      {
        heading: 'Chibi and cute',
        prompts: [
          'chibi style, tiny witch with an oversized hat stirring a cauldron, pastel colors, simple background, cute',
          'chibi style, three animal mascots having a picnic, sticker style, white outline, plain background',
          'chibi style, sleepy knight hugging a pillow, big head, small body, soft lighting',
          'chibi style, girl in a frog raincoat jumping in a puddle, splash, bright colors',
          'chibi style, little chef holding a giant cupcake, kitchen background, warm light, sticker style',
          'chibi style, sticker sheet of one character with six expressions, happy, angry, sad, surprised, sleepy, love',
        ],
      },
    ],
    tips: [
      'Anime SDXL checkpoints such as Illustrious XL were trained on Danbooru images, so short Danbooru-style tags (1girl, silver hair, school uniform) suit them better than long sentences. Pony Diffusion V6 XL also expects its score_9, score_8_up, … string at the start of the prompt.',
      'For the same character in several images, write one fixed description (hair, eyes, outfit) and reuse it word for word. Change only the pose and the scene.',
      'Hands are the most common error. Hide them (hands in pockets, holding an object) or fix them with inpainting instead of adding more negative terms.',
    ],
    guides: ['2026-07-01-master-studio-ghibli-ai-art-prompts', '2026-01-06-master-consistent-characters-leonardo-ai', '2025-11-29-stable-diffusion-negative-prompts-guide'],
  },
  {
    slug: 'pixel-art',
    name: 'Pixel Art',
    h1: 'Pixel Art Prompt Generator',
    metaTitle: 'Pixel Art Prompt Generator: {count} AI Pixel Art Prompts',
    description:
      'Free pixel art prompt generator for sprites, tiles and scenes. Choose an era, view and palette, then copy a prompt for Midjourney, SDXL, Flux or ChatGPT.',
    lead:
      'Describe a character, item or scene, pick the console era, the view and the palette, and copy a pixel art prompt for your image model. The examples below cover sprites, environments, items and isometric rooms.',
    builder: {
      subjectLabel: 'Character, item or scene',
      defaultSubject: 'a knight with a blue cape standing in a forest clearing',
      tag: 'pixel art',
      sentence: 'Pixel art of',
      groups: [
        single('era', 'Era', [
          opt('8bit', '8-bit', '8-bit, limited NES-style palette, chunky pixels'),
          opt('16bit', '16-bit', '16-bit, SNES-era style'),
          opt('hd', 'Modern HD', 'detailed modern pixel art, rich palette'),
          opt('gameboy', 'Game Boy', 'Game Boy style, four shades of green'),
          opt('1bit', '1-bit', '1-bit, black and white only'),
        ]),
        single('view', 'View', [
          opt('side', 'Side view', 'side view'),
          opt('iso', 'Isometric', 'isometric view'),
          opt('top', 'Top-down', 'top-down view'),
          opt('sprite', 'Sprite', 'single game sprite, centered, plain solid background'),
          opt('scene', 'Full scene', 'full scene, detailed background'),
        ]),
        single('palette', 'Palette', [
          opt('bright', 'Bright', 'bright cheerful colors'),
          opt('dusk', 'Dusk', 'purple and orange dusk palette'),
          opt('night', 'Night', 'dark blue night palette'),
          opt('pastel', 'Pastel', 'soft pastel palette'),
          opt('earthy', 'Earthy', 'earthy browns and greens'),
        ]),
        multi('extras', 'Extras', [
          opt('outline', 'Dark outlines', 'clean dark outlines'),
          opt('dither', 'Dithering', 'dithering shading'),
          opt('tile', 'Tileable', 'seamless tileable'),
          opt('sheet', 'Sprite sheet', 'sprite sheet with several animation frames'),
        ]),
      ],
      defaults: { era: ['16bit'], view: ['side'], palette: ['bright'], extras: ['outline'] },
      aspectRatios: ['1:1', '16:9', '3:2', '9:16'],
      negatives: ['blurry', 'smooth gradients', 'anti-aliasing', 'photorealistic', '3d render', 'jpeg artifacts', 'watermark', 'text'],
      midjourneyNo: ['blur', 'gradient', 'photo', 'text', 'watermark'],
    },
    examples: [
      {
        heading: 'Characters and sprites',
        prompts: [
          'pixel art, single game sprite of a red-hooded rogue holding two daggers, idle pose, 16-bit, plain solid background',
          'pixel art, sprite sheet of a slime monster with four bounce animation frames, bright green, plain background',
          'pixel art, wizard with a pointy purple hat casting a fireball, side view, 16-bit, clean dark outlines',
          'pixel art, cute fox adventurer with a tiny backpack, 8-bit, chunky pixels, plain background',
          'pixel art, armored boss knight with a giant axe, dark fantasy, detailed modern pixel art, side view',
          'pixel art, astronaut character in a white suit, front view, 16-bit, plain solid background',
          'pixel art, shopkeeper behind a wooden counter full of potions, cozy, warm palette',
          'pixel art, character portrait of an old pirate captain with an eye patch, 64x64 style, detailed shading',
        ],
      },
      {
        heading: 'Environments',
        prompts: [
          'pixel art, retro city street at night, rain, neon shop signs, side view, 16-bit, dark blue palette',
          'pixel art, forest with tall pine trees and a river, side-scrolling game background, parallax layers',
          'pixel art, cozy farm with crops and a red barn, top-down view, bright cheerful colors',
          'pixel art, underwater cave with glowing jellyfish, detailed modern pixel art, blue and teal palette',
          'pixel art, desert canyon at sunset, purple and orange dusk palette, wide scene',
          'pixel art, snowy mountain village with lit windows, night, falling snow, 16-bit',
          'pixel art, dungeon corridor with torches on stone walls, top-down view, earthy palette',
          'pixel art, space station interior with blinking control panels, side view, cool colors',
        ],
      },
      {
        heading: 'Items and icons',
        prompts: [
          'pixel art, game item icon of a red health potion in a round bottle, plain background, clean dark outlines',
          'pixel art, set of RPG weapon icons, sword, bow, axe, staff and dagger, plain background',
          'pixel art, treasure chest open with gold coins spilling out, centered, 16-bit',
          'pixel art, set of food icons, bread, apple, cheese, fish and pie, cozy palette, plain background',
          'pixel art, glowing magic crystal on a stone pedestal, centered, dark background',
          'pixel art, set of gemstone icons in six colors, shiny highlights, plain background',
          'pixel art, old map scroll with a red X, item icon, earthy colors',
          'pixel art, Game Boy style key item icon, four shades of green, plain background',
        ],
      },
      {
        heading: 'Isometric rooms and buildings',
        prompts: [
          'pixel art, isometric tavern interior with wooden tables and a fireplace, cozy warm lighting',
          'pixel art, isometric gamer bedroom with a glowing computer and posters, night, purple light',
          'pixel art, isometric small island with a lighthouse, surrounded by water, bright palette',
          'pixel art, isometric blacksmith workshop with an anvil and glowing forge',
          'pixel art, isometric japanese house with a cherry tree in the garden, spring',
          'pixel art, isometric coffee shop with plants and a counter, soft pastel palette',
          'pixel art, isometric wizard tower with floating books, magical glow, night',
          'pixel art, isometric tiny greenhouse full of plants, sunny day, bright colors',
        ],
      },
    ],
    tips: [
      'Image models paint pixel art at full resolution, so the “pixels” come out uneven and colors drift. For a clean grid, downscale with nearest-neighbor, reduce the palette, then scale up the same way. The Pixel Art XL LoRA card suggests downscaling its output 8 times.',
      'On SDXL, a pixel art LoRA such as Pixel Art XL (trigger word “pixel art”) is the most direct way to get the style.',
      'For sprites, ask for a plain solid background and remove it in Aseprite, Photoshop or Krita. Expect to clean up by hand before using a sprite in a game.',
      'Naming an era (8-bit, 16-bit, Game Boy) steers the palette, but models do not count colors exactly.',
    ],
    guides: ['2025-11-30-ai-art-styles-guide', '2026-05-17-master-sdxl-prompting-guide', '2025-11-29-stable-diffusion-negative-prompts-guide'],
  },
  {
    slug: 'game-concepts',
    name: 'Game Concepts',
    h1: 'Game Concept Art Prompt Generator',
    metaTitle: 'Game Concept Art Prompt Generator: {count} Free AI Prompts',
    description:
      'Free game concept art prompt generator for environments, characters, creatures and props. Pick a style and genre, then copy a prompt for any image model.',
    lead:
      'Describe a place, character, creature or prop, choose the type of sheet, the art style and the genre, and copy a concept art prompt for your image model. Use the results to explore ideas before you build the real asset.',
    builder: {
      subjectLabel: 'What are you designing?',
      defaultSubject: 'an abandoned space station overgrown with alien plants',
      tag: 'game concept art',
      sentence: 'Game concept art of',
      groups: [
        single('type', 'Type', [
          opt('environment', 'Environment', 'environment concept art, establishing shot, sense of scale'),
          opt('character', 'Character', 'character concept art, full body, neutral pose'),
          opt('turnaround', 'Turnaround', 'character turnaround sheet, front, side and back views, plain background'),
          opt('prop', 'Prop sheet', 'prop concept sheet, several angles, plain background'),
          opt('creature', 'Creature', 'creature design, full body, side view'),
          opt('key-art', 'Key art', 'key art, dramatic composition, hero in the foreground'),
        ]),
        single('style', 'Style', [
          opt('painterly', 'Painterly', 'digital painting, painterly brushwork'),
          opt('stylized', 'Stylized', 'stylized hand-painted style, bold shapes'),
          opt('realistic', 'Realistic', 'realistic, high detail materials'),
          opt('lowpoly', 'Low poly', 'low poly 3D style'),
          opt('cel', 'Cel-shaded', 'cel-shaded, clean outlines'),
        ]),
        single('genre', 'Genre', [
          opt('fantasy', 'Fantasy', 'high fantasy setting'),
          opt('scifi', 'Sci-fi', 'sci-fi setting'),
          opt('post', 'Post-apocalyptic', 'post-apocalyptic setting'),
          opt('cozy', 'Cozy', 'cozy, warm and inviting mood'),
          opt('horror', 'Horror', 'dark horror atmosphere'),
        ]),
        single('light', 'Lighting', [
          opt('volumetric', 'Volumetric', 'volumetric light shafts'),
          opt('overcast', 'Overcast', 'soft overcast light'),
          opt('sunset', 'Sunset', 'warm sunset light'),
          opt('bio', 'Bioluminescent', 'bioluminescent glow'),
        ]),
      ],
      defaults: { type: ['environment'], style: ['painterly'], genre: ['scifi'], light: ['volumetric'] },
      aspectRatios: ['16:9', '1:1', '3:2', '2:3'],
      negatives: ['lowres', 'blurry', 'text', 'watermark', 'signature', 'cropped', 'deformed', 'jpeg artifacts'],
      midjourneyNo: ['text', 'watermark', 'signature'],
    },
    examples: [
      {
        heading: 'Environments',
        prompts: [
          'game concept art, ancient ruins in a jungle, giant stone heads covered in moss, volumetric light shafts, establishing shot, digital painting',
          'game concept art, floating market city built on stacked boats, lanterns, dusk, sense of scale',
          'game concept art, frozen research base on an alien planet, twin moons, blue and orange palette, wide shot',
          'game concept art, cozy village bakery street, cobblestones, flower boxes, morning light, stylized hand-painted style',
          'game concept art, post-apocalyptic highway overgrown with plants, rusted cars, soft overcast light',
          'game concept art, underground dwarven forge hall, rivers of lava, huge pillars, warm glow',
          'game concept art, haunted manor hallway, flickering candles, long shadows, dark horror atmosphere',
          'game concept art, cyberpunk rooftop arena, neon billboards, rain, aerial view',
          'game concept art, desert oasis trading post, colorful tents, camels, midday heat haze',
          'game concept art, alien coral forest under a purple sky, bioluminescent glow, explorer for scale',
        ],
      },
      {
        heading: 'Characters',
        prompts: [
          'game concept art, character concept of a scavenger with a patched gas mask and a homemade rifle, full body, neutral pose, plain background',
          'game concept art, elven ranger in leaf-pattern armor, longbow, full body, painterly brushwork',
          'game concept art, character turnaround sheet of a space marine, front, side and back views, plain background',
          'game concept art, cozy farming game hero with a straw hat and a watering can, cel-shaded, clean outlines',
          'game concept art, necromancer queen with a bone crown, dark robes, purple glow, dramatic lighting',
          'game concept art, robot companion the size of a dog, rounded friendly shapes, three-quarter view',
          'game concept art, desert nomad warrior with layered cloth and a curved blade, wind-blown fabric',
          'game concept art, lineup of five party members side by side, varied silhouettes, plain background',
        ],
      },
      {
        heading: 'Creatures',
        prompts: [
          'game concept art, creature design of a giant armored beetle used as a mount, side view, plain background',
          'game concept art, deep sea leviathan with glowing lures, dark water, sense of scale',
          'game concept art, forest spirit made of moss and antlers, gentle expression, soft light',
          'game concept art, small fire salamander pet, cute proportions, stylized hand-painted style',
          'game concept art, mechanical dragon with exposed gears and steam vents, full body, side view',
          'game concept art, swamp troll with a lantern hanging from its belt, painterly, murky green palette',
        ],
      },
      {
        heading: 'Props and weapons',
        prompts: [
          'game concept art, prop concept sheet of a fantasy sword set, five variations, plain background',
          'game concept art, sci-fi pistol, several angles, orthographic views, clean presentation',
          'game concept art, alchemist table with bottles, scales and an open book, three-quarter view',
          'game concept art, set of magic staffs with different crystals, plain background',
          'game concept art, post-apocalyptic backpack made from scrap, front and back views',
          'game concept art, treasure chest variations, wood, iron and gold, plain background',
          'game concept art, futuristic hover bike, side view and top view, clean presentation',
          'game concept art, set of potion bottles with unique shapes, stylized, plain background',
        ],
      },
    ],
    tips: [
      'Concept art is for ideas, not final assets. Use the image to agree on shapes, colors and mood, then model or paint the real thing.',
      'For turnarounds, ask for a plain background and list the views you need. Details often change between views, so check them before handing the sheet to a 3D artist.',
      'Test the silhouette first: run the prompt with “solid black silhouette on white background”. If the shape is not readable, more detail will not fix it.',
      'Two characters in one image tend to blend. Regional prompting keeps their descriptions apart.',
    ],
    guides: ['2026-01-04-stable-diffusion-regional-prompting-guide', '2026-01-06-master-consistent-characters-leonardo-ai', '2026-01-25-stable-diffusion-wildcards-guide'],
  },
  {
    slug: 'food-photography',
    name: 'Food Photography',
    h1: 'Food Photography Prompt Generator',
    metaTitle: 'Food Photography Prompt Generator: {count} AI Food Prompts',
    description:
      'Free food photography prompt generator. Choose the angle, light and setting, then copy a food photo prompt for Midjourney, SDXL, Flux or ChatGPT.',
    lead:
      'Name the dish, pick the camera angle, the light and the setting, and copy a food photography prompt for your image model. Below are copy-paste prompts for restaurant dishes, desserts, drinks and flat lays.',
    builder: {
      subjectLabel: 'Dish or drink',
      defaultSubject: 'a stack of fluffy pancakes with blueberries and maple syrup',
      tag: 'food photography',
      sentence: 'A food photograph of',
      groups: [
        single('angle', 'Angle', [
          opt('45', '45° angle', 'shot from a 45 degree angle'),
          opt('overhead', 'Overhead flat lay', 'overhead flat lay'),
          opt('side', 'Side-on', 'side-on eye-level shot'),
          opt('macro', 'Macro', 'macro close-up, shallow depth of field'),
        ]),
        single('light', 'Light', [
          opt('window', 'Window light', 'soft natural window light'),
          opt('moody', 'Dark & moody', 'dark moody side light, deep shadows'),
          opt('bright', 'Bright & airy', 'bright and airy, high key'),
          opt('backlight', 'Backlight', 'backlit with glowing edges'),
        ]),
        single('setting', 'Setting', [
          opt('rustic', 'Rustic wood', 'rustic wooden table'),
          opt('marble', 'Marble', 'white marble surface'),
          opt('slate', 'Dark slate', 'dark slate background'),
          opt('cafe', 'Cafe', 'cafe table, blurred interior behind'),
          opt('color', 'Color backdrop', 'solid color backdrop'),
        ]),
        multi('extras', 'Extras', [
          opt('steam', 'Steam', 'rising steam'),
          opt('drip', 'Drips', 'sauce dripping'),
          opt('crumbs', 'Crumbs', 'scattered crumbs and ingredients'),
          opt('hand', 'Hand in frame', 'a hand reaching into frame'),
        ]),
      ],
      defaults: { angle: ['45'], light: ['window'], setting: ['rustic'], extras: ['drip'] },
      aspectRatios: ['4:5', '1:1', '3:2', '16:9'],
      negatives: ['plastic texture', 'oversaturated', 'blurry', 'lowres', 'deformed', 'text', 'watermark', 'cartoon'],
      midjourneyNo: ['text', 'watermark', 'cartoon', 'plastic'],
    },
    examples: [
      {
        heading: 'Restaurant dishes',
        prompts: [
          'food photography, gourmet burger with melted cheese, shot from a 45 degree angle, dark moody side light, steam, dark slate background',
          'food photography, fresh pasta with basil and parmesan, natural window light, rustic wooden table, shallow depth of field',
          'food photography, sushi platter, overhead flat lay, minimalist plating, white marble surface, negative space',
          'food photography, bowl of ramen with a soft egg and chashu, steam rising, side light, dark background',
          'food photography, wood-fired margherita pizza, overhead, flour on the table, warm light',
          'food photography, grilled steak sliced on a board, rosemary and salt, dark moody light, 45 degree angle',
          'food photography, colorful poke bowl, overhead flat lay, bright and airy, light wood surface',
          'food photography, tacos on a plate with lime and cilantro, side-on shot, vibrant colors, daylight',
        ],
      },
      {
        heading: 'Desserts and bakery',
        prompts: [
          'food photography, chocolate lava cake with molten center flowing out, macro close-up, dark background, rim light',
          'food photography, stack of pancakes with blueberries and syrup dripping, 45 degree angle, window light',
          'food photography, croissants in a basket, crumbs scattered, rustic table, morning light',
          'food photography, slice of strawberry cheesecake, side-on shot, pastel pink backdrop, bright and airy',
          'food photography, macarons in pastel colors arranged in rows, overhead, white marble',
          'food photography, ice cream cone melting in the sun, bright blue backdrop, high key',
          'food photography, sourdough loaf torn open, steam, dark slate background, moody',
          'food photography, cinnamon rolls with icing drip, close-up, warm light, baking tray',
        ],
      },
      {
        heading: 'Drinks',
        prompts: [
          'food photography, espresso pouring into a ceramic cup, motion freeze, rich crema, dark cafe background',
          'food photography, iced coffee with condensation drops, backlit, glowing edges, summer mood',
          'food photography, cocktail with orange peel on a bar counter, moody bar lighting, bokeh',
          'food photography, matcha latte from above with latte art, light wood table, soft daylight',
          'food photography, glass of red wine and cheese board, candlelight, dark moody',
          'food photography, smoothie bowl and fresh fruit, overhead, bright and airy, colorful',
          'food photography, hot chocolate with marshmallows by a window in winter, steam, cozy',
          'food photography, lemonade pitcher on a picnic table, sunlight, ice cubes, fresh mint',
        ],
      },
    ],
    tips: [
      'Angle follows the dish: overhead for flat food like pizza and bowls, 45 degrees for burgers and drinks, side-on for layered desserts and stacks.',
      'Steam, drips, crumbs and a hand reaching in make food look fresh. Ask for them by name.',
      'If you sell the food, the photo must match what the customer gets. Use AI images for mood boards and menus only when they show the real dish.',
    ],
    guides: ['2026-02-16-master-ai-art-lenses-prompts-guide', '2026-07-01-master-studio-ghibli-ai-art-prompts', '2025-11-29-stable-diffusion-negative-prompts-guide'],
  },
  {
    slug: 'fantasy-scenes',
    name: 'Fantasy Scenes',
    h1: 'Fantasy Art Prompt Generator',
    metaTitle: 'Fantasy Art Prompt Generator: {count} AI Fantasy Scene Prompts',
    description:
      'Free fantasy art prompt generator for epic landscapes, castles and magic scenes. Pick a style, mood and light, then copy a prompt for any image model.',
    lead:
      'Describe your fantasy scene, pick a style, a mood and the light, and copy a prompt for your image model. The examples cover landscapes, cities and castles, and magic and creatures.',
    builder: {
      subjectLabel: 'Scene',
      defaultSubject: 'an ancient dragon temple on a misty mountain',
      tag: 'fantasy art',
      sentence: 'Fantasy art of',
      groups: [
        single('style', 'Style', [
          opt('painting', 'Oil painting', 'epic oil painting, rich brushwork'),
          opt('digital', 'Digital painting', 'detailed digital painting'),
          opt('cinematic', 'Cinematic', 'cinematic film still, realistic'),
          opt('storybook', 'Storybook', 'storybook illustration, soft colors'),
          opt('ink', 'Ink & wash', 'ink and watercolor wash'),
        ]),
        single('mood', 'Mood', [
          opt('epic', 'Epic', 'epic scale, tiny figures for scale'),
          opt('serene', 'Serene', 'calm and serene'),
          opt('dark', 'Dark', 'dark and ominous'),
          opt('whimsical', 'Whimsical', 'whimsical and magical'),
        ]),
        single('light', 'Light', [
          opt('golden', 'Golden hour', 'golden hour light'),
          opt('mist', 'Morning mist', 'morning mist, soft diffused light'),
          opt('storm', 'Storm', 'stormy sky, lightning'),
          opt('moon', 'Moonlight', 'blue moonlight, glowing magic'),
          opt('aurora', 'Aurora', 'aurora in the night sky'),
        ]),
        multi('extras', 'Extras', [
          opt('runes', 'Glowing runes', 'glowing runes'),
          opt('particles', 'Magic particles', 'floating magic particles'),
          opt('birds', 'Birds', 'flock of birds in the distance'),
          opt('waterfall', 'Waterfalls', 'waterfalls'),
        ]),
      ],
      defaults: { style: ['digital'], mood: ['epic'], light: ['mist'], extras: ['runes'] },
      aspectRatios: ['16:9', '3:2', '2:3', '1:1'],
      negatives: ['lowres', 'blurry', 'text', 'watermark', 'signature', 'deformed', 'jpeg artifacts', 'flat lighting'],
      midjourneyNo: ['text', 'watermark', 'signature'],
    },
    examples: [
      {
        heading: 'Landscapes',
        prompts: [
          'fantasy art, floating sky islands connected by ancient bridges, aerial view, volumetric clouds, golden hour',
          'fantasy art, enchanted forest with bioluminescent mushrooms, glowing particles, blue moonlight',
          'fantasy art, giant tree with a city in its branches, morning mist, epic scale',
          'fantasy art, crystal desert under two suns, long shadows, tiny caravan for scale',
          'fantasy art, frozen waterfall in a mountain pass, aurora in the night sky, calm and serene',
          'fantasy art, volcanic wasteland with rivers of lava, dark and ominous, stormy sky',
          'fantasy art, mossy stone circle on a hill at dawn, mist in the valley, storybook illustration',
          'fantasy art, sea of clouds with mountain peaks, a lone traveler on a cliff, epic oil painting',
        ],
      },
      {
        heading: 'Cities and castles',
        prompts: [
          'fantasy art, white castle on a cliff above the sea, banners in the wind, golden hour, epic scale',
          'fantasy art, fantasy village at dusk, warm lantern light, cobblestone streets, cozy',
          'fantasy art, dwarven city carved into a mountain, giant statues at the gate, torch light',
          'fantasy art, elven city of glass towers in a forest, soft morning light, whimsical',
          'fantasy art, ruined castle overgrown with vines, moonlight, ghostly mist',
          'fantasy art, floating wizard academy, flying books, magic particles, twilight sky',
          'fantasy art, harbor town with tall ships, sunset, seagulls, detailed digital painting',
          'fantasy art, dark lord fortress on a black mountain, red sky, lightning, ominous',
        ],
      },
      {
        heading: 'Magic and creatures',
        prompts: [
          'fantasy art, ancient dragon sleeping on a mountain of gold, cave, warm glow, sense of scale',
          'fantasy art, mage duel in stormy ruins, dynamic energy effects, dramatic composition',
          'fantasy art, giant sea serpent rising beside a small ship, stormy waves, cinematic',
          'fantasy art, phoenix rising from flames above a temple, glowing embers, night sky',
          'fantasy art, witch’s cottage in a swamp, glowing windows, fireflies, storybook illustration',
          'fantasy art, griffin rider flying above clouds, golden hour, wind in feathers',
          'fantasy art, unicorn drinking from a glowing pool in a dark forest, magic particles',
          'fantasy art, giant golem made of moss and stone walking through a valley, morning mist',
        ],
      },
    ],
    tips: [
      'Scale needs a reference: add “tiny figure in the foreground” or “small ship for scale” to make a castle or dragon feel huge.',
      'Light and weather set the mood more than adjectives. Swap “golden hour” for “stormy sky” and the same scene changes completely.',
      'Pick one style. Mixing “oil painting” with “photorealistic” usually gives a muddy result.',
    ],
    guides: ['2026-02-24-master-ai-art-weather-time-prompts', '2026-02-03-master-surreal-ai-art-prompts', '2025-11-30-ai-art-styles-guide'],
  },
  {
    slug: 'product-photography',
    name: 'Product Photography',
    h1: 'Product Photography Prompt Generator',
    metaTitle: 'Product Photography Prompt Generator: {count} AI Prompts',
    description:
      'Free product photography prompt generator. Pick a backdrop, light and angle, then copy a product shot prompt for Midjourney, SDXL, Flux or ChatGPT.',
    lead:
      'Name the product, choose the backdrop, the light and the angle, and copy a product photography prompt for your image model. Use the results for concepts, mood boards and backgrounds.',
    builder: {
      subjectLabel: 'Product',
      defaultSubject: 'a matte black wireless speaker',
      tag: 'product photography',
      sentence: 'A product photograph of',
      groups: [
        single('backdrop', 'Backdrop', [
          opt('white', 'Pure white', 'pure white seamless background'),
          opt('gradient', 'Soft gradient', 'soft gradient background'),
          opt('podium', 'Podium', 'standing on a stone podium'),
          opt('lifestyle', 'Lifestyle', 'lifestyle scene on a real table'),
          opt('nature', 'Nature', 'on a mossy rock with leaves'),
          opt('water', 'Water splash', 'water splash around it'),
        ]),
        single('light', 'Light', [
          opt('softbox', 'Softbox', 'large softbox lighting, soft shadows'),
          opt('rim', 'Rim light', 'dark background, rim light outlining the edges'),
          opt('hard', 'Hard sun', 'hard sunlight, crisp shadows'),
          opt('neon', 'Colored gels', 'colored gel lighting, pink and blue'),
        ]),
        single('angle', 'Angle', [
          opt('hero', 'Hero 3/4', 'three-quarter hero angle'),
          opt('front', 'Straight on', 'straight-on front view'),
          opt('top', 'Top-down', 'top-down view'),
          opt('macro', 'Macro detail', 'macro detail of the material'),
        ]),
        multi('extras', 'Extras', [
          opt('reflection', 'Reflection', 'reflection on a glossy floor'),
          opt('float', 'Floating', 'floating in the air'),
          opt('shadow', 'Long shadow', 'long dramatic shadow'),
          opt('props', 'Props', 'simple props that match the product'),
        ]),
      ],
      defaults: { backdrop: ['gradient'], light: ['softbox'], angle: ['hero'], extras: ['reflection'] },
      aspectRatios: ['1:1', '4:5', '16:9', '9:16'],
      negatives: ['text', 'logo', 'watermark', 'blurry', 'lowres', 'deformed', 'cluttered background', 'dust'],
      midjourneyNo: ['text', 'logo', 'watermark', 'clutter'],
    },
    examples: [
      {
        heading: 'Tech and gadgets',
        prompts: [
          'product photography, wireless earbuds in an open case, soft gradient background, reflection on a glossy floor, softbox lighting',
          'product photography, smartwatch floating in the air, dark background, rim light, minimal composition',
          'product photography, mechanical keyboard, top-down view, colored gel lighting, pink and blue',
          'product photography, matte black speaker on a concrete podium, hard sunlight, crisp shadows',
          'product photography, game controller with water splash, frozen droplets, dark background',
          'product photography, laptop on a clean desk with a plant, lifestyle scene, soft daylight',
          'product photography, phone case in three colors lined up, pure white background, front view',
          'product photography, camera lens macro detail, glass reflections, dark moody light',
        ],
      },
      {
        heading: 'Beauty and fashion',
        prompts: [
          'product photography, perfume bottle on a stone podium, soft gradient background, rim light, glass reflections',
          'product photography, skincare serum bottle surrounded by water drops, fresh, high key, white background',
          'product photography, lipstick set fanned out, macro detail, satin fabric, soft light',
          'product photography, leather handbag on a marble table, lifestyle scene, morning light',
          'product photography, white sneaker floating in the air, long shadow, pastel blue background',
          'product photography, gold watch on a black velvet cushion, dramatic rim light',
          'product photography, sunglasses on warm sand, hard sunlight, crisp shadows, summer',
          'product photography, candle in an amber jar with dried flowers, cozy warm light',
        ],
      },
      {
        heading: 'Food, drink and home',
        prompts: [
          'product photography, coffee bag on a rustic wood surface with beans scattered, natural window light',
          'product photography, soda can with ice and condensation, splash, bright color background',
          'product photography, ceramic mug on a linen cloth, soft shadows, minimal, top-down',
          'product photography, olive oil bottle with olives and rosemary, mediterranean light',
          'product photography, chocolate bar broken in half, macro detail, dark background',
          'product photography, plant pot on a wooden shelf, lifestyle scene, soft daylight',
          'product photography, water bottle on a mossy rock in a forest stream, nature backdrop',
          'product photography, kitchen knife on a slate board, side light, dramatic shadow',
        ],
      },
    ],
    tips: [
      'Image models cannot reproduce your exact product: logos, labels and shapes drift. Use the prompt for backgrounds and concepts, then composite a real photo of the product, or use an image editing tool with your photo as input.',
      'Material and light words do most of the work: brushed aluminium, frosted glass, matte plastic; softbox, rim light, hard sun.',
      'Keep text and logos out of the generated image and add them in an editor.',
    ],
    guides: ['2026-02-16-master-ai-art-lenses-prompts-guide', '2025-11-28-dall-e-3-photorealism-prompt-guide', '2025-11-29-stable-diffusion-negative-prompts-guide'],
  },
  {
    slug: 'architecture',
    name: 'Architecture',
    h1: 'Architecture Prompt Generator',
    metaTitle: 'Architecture Prompt Generator: {count} AI Rendering Prompts',
    description:
      'Free architecture prompt generator for exterior and interior renders. Choose the building type, view and light, then copy a prompt for any image model.',
    lead:
      'Describe the building, pick the view, the style and the light, and copy an architectural rendering prompt for your image model. Useful for concept boards, massing ideas and presentation moods.',
    builder: {
      subjectLabel: 'Building',
      defaultSubject: 'a modern timber house on a hillside',
      tag: 'architectural rendering',
      sentence: 'An architectural rendering of',
      groups: [
        single('view', 'View', [
          opt('eye', 'Eye-level', 'eye-level street view, straight verticals'),
          opt('aerial', 'Aerial', 'aerial view'),
          opt('worm', 'Low angle', 'low angle view looking up'),
          opt('interior', 'Interior', 'interior view, wide angle'),
          opt('section', 'Section', 'cross-section diagram'),
        ]),
        single('style', 'Style', [
          opt('modern', 'Modern minimal', 'modern minimalist architecture'),
          opt('brutalist', 'Brutalist', 'brutalist concrete architecture'),
          opt('parametric', 'Parametric', 'parametric curved facade'),
          opt('scandi', 'Scandinavian', 'Scandinavian timber architecture'),
          opt('tropical', 'Tropical', 'tropical modern architecture'),
        ]),
        single('light', 'Light', [
          opt('golden', 'Golden hour', 'golden hour light'),
          opt('blue', 'Blue hour', 'blue hour, warm interior lights'),
          opt('overcast', 'Overcast', 'soft overcast sky'),
          opt('night', 'Night', 'night, glowing windows'),
        ]),
        single('render', 'Render look', [
          opt('photo', 'Photoreal', 'photorealistic render'),
          opt('sketch', 'Sketch', 'architectural pencil sketch'),
          opt('model', 'Physical model', 'white physical model, studio light'),
          opt('watercolor', 'Watercolor', 'watercolor architectural illustration'),
        ]),
      ],
      defaults: { view: ['eye'], style: ['scandi'], light: ['golden'], render: ['photo'] },
      aspectRatios: ['16:9', '3:2', '2:3', '1:1'],
      negatives: ['warped geometry', 'bent lines', 'distorted perspective', 'blurry', 'lowres', 'text', 'watermark', 'people'],
      midjourneyNo: ['text', 'watermark', 'people'],
    },
    examples: [
      {
        heading: 'Houses and villas',
        prompts: [
          'architectural rendering, modern timber house on a hillside, large glass windows, eye-level view, golden hour, photorealistic',
          'architectural rendering, concrete villa with an infinity pool, tropical garden, aerial view, midday',
          'architectural rendering, small A-frame cabin in a snowy pine forest, blue hour, warm interior lights',
          'architectural rendering, Japanese courtyard house with a maple tree, soft overcast light',
          'architectural rendering, Mediterranean white house with blue shutters, sea view, sunset',
          'architectural rendering, earth-sheltered house with a green roof, low angle, morning light',
          'architectural rendering, row of colorful townhouses, eye-level street view, straight verticals',
          'architectural rendering, glass pavilion in a lake, reflections, night, glowing interior',
        ],
      },
      {
        heading: 'Public and commercial',
        prompts: [
          'architectural rendering, futuristic museum with curved white facade, golden hour, wide plaza',
          'architectural rendering, brutalist library, cloudy dramatic sky, wide-angle, eye-level',
          'architectural rendering, timber school building with courtyards, aerial view, summer',
          'architectural rendering, parametric facade office tower, sunset glass reflections',
          'architectural rendering, railway station with a vaulted steel roof, interior view, morning light',
          'architectural rendering, sustainable campus building with green roof, cross-section diagram',
          'architectural rendering, small coffee kiosk made from shipping containers, street view',
          'architectural rendering, concert hall at night, glowing facade, people arriving, blue hour',
        ],
      },
      {
        heading: 'Concept and presentation',
        prompts: [
          'architectural pencil sketch of a cliffside hotel, loose lines, white paper',
          'white physical architecture model of a stadium, studio light, top-down',
          'watercolor architectural illustration of a riverside market hall, soft colors',
          'massing study of three towers, simple white volumes, aerial view, soft shadows',
          'exploded axonometric diagram of a small house, labeled layers, clean white background',
          'architectural rendering, mountain observation tower, minimal steel structure, fog',
          'architectural rendering, floating housing on a canal, eye-level view, morning mist',
          'architectural rendering, rooftop garden with seating, city skyline behind, golden hour',
        ],
      },
    ],
    tips: [
      'Generated images are not drawings. Structure, proportions and code compliance must be checked by a qualified person.',
      'Ask for “straight verticals” or “two-point perspective” to keep walls upright; wide lenses tend to make buildings lean.',
      'Label the lens and the time of day: a 24mm eye-level view at blue hour reads very differently from an aerial noon shot.',
    ],
    guides: ['2026-02-16-master-ai-art-lenses-prompts-guide', '2026-02-24-master-ai-art-weather-time-prompts', '2026-05-01-master-ink-sketch-ai-art-prompts-pen-ink'],
  },
  {
    slug: 'cinematic-portraits',
    name: 'Cinematic Portraits',
    h1: 'Cinematic Portrait Prompt Generator',
    metaTitle: 'Cinematic Portrait Prompt Generator: {count} AI Photo Prompts',
    description:
      'Free cinematic portrait prompt generator. Choose the lens, lighting and color grade, then copy a portrait prompt for Midjourney, SDXL, Flux or ChatGPT.',
    lead:
      'Describe the person and the setting, pick the lens, the lighting and the color grade, and copy a cinematic portrait prompt for your image model.',
    builder: {
      subjectLabel: 'Person and setting',
      defaultSubject: 'a woman in a raincoat standing under a streetlight',
      tag: 'cinematic portrait photo',
      sentence: 'A cinematic portrait photo of',
      groups: [
        single('lens', 'Lens', [
          opt('85', '85mm', '85mm lens, shallow depth of field'),
          opt('50', '50mm', '50mm lens, natural perspective'),
          opt('35', '35mm', '35mm lens, environmental portrait'),
          opt('135', '135mm', '135mm lens, compressed background'),
        ]),
        single('light', 'Lighting', [
          opt('rembrandt', 'Rembrandt', 'Rembrandt lighting'),
          opt('split', 'Split', 'split lighting, half the face in shadow'),
          opt('neon', 'Neon', 'neon light, pink and cyan'),
          opt('window', 'Window', 'soft window light'),
          opt('golden', 'Golden hour', 'golden hour backlight'),
        ]),
        single('grade', 'Color grade', [
          opt('teal', 'Teal & orange', 'teal and orange color grade'),
          opt('film', 'Film', 'Kodak Portra film look, fine grain'),
          opt('bw', 'Black & white', 'black and white, high contrast'),
          opt('muted', 'Muted', 'muted desaturated colors'),
        ]),
        multi('extras', 'Extras', [
          opt('rain', 'Rain', 'rain drops'),
          opt('smoke', 'Haze', 'atmospheric haze'),
          opt('bokeh', 'City bokeh', 'city lights bokeh'),
          opt('closeup', 'Tight close-up', 'tight close-up on the eyes'),
        ]),
      ],
      defaults: { lens: ['85'], light: ['neon'], grade: ['teal'], extras: ['rain'] },
      aspectRatios: ['2:3', '4:5', '16:9', '1:1'],
      negatives: ['plastic skin', 'airbrushed', 'cartoon', 'bad anatomy', 'extra fingers', 'blurry', 'lowres', 'watermark', 'text'],
      midjourneyNo: ['cartoon', 'text', 'watermark', 'airbrushed'],
    },
    examples: [
      {
        heading: 'Moody and noir',
        prompts: [
          'cinematic portrait photo, man in a trench coat under a streetlight, rain, 85mm lens, black and white, high contrast',
          'cinematic portrait photo, woman in a red coat on a dark street, neon light, pink and cyan, rain drops, shallow depth of field',
          'cinematic portrait photo, detective in a smoky office, split lighting, atmospheric haze, muted colors',
          'cinematic portrait photo, boxer resting in a dim gym, single overhead light, sweat, 50mm lens',
          'cinematic portrait photo, old fisherman with a weathered face, Rembrandt lighting, dark background',
          'cinematic portrait photo, young man in a car at night, dashboard light on his face, city lights bokeh',
          'cinematic portrait photo, singer on a small stage, spotlight, haze, teal and orange grade',
          'cinematic portrait photo, woman looking through rainy window glass, reflections, soft light',
        ],
      },
      {
        heading: 'Natural light',
        prompts: [
          'cinematic portrait photo, girl in a wheat field, golden hour backlight, Kodak Portra film look',
          'cinematic portrait photo, chef in a busy kitchen, 35mm environmental portrait, warm light',
          'cinematic portrait photo, grandmother by a window knitting, soft window light, muted colors',
          'cinematic portrait photo, surfer on the beach at sunrise, 135mm lens, compressed background',
          'cinematic portrait photo, mountain climber with frost on the beard, overcast light, close-up',
          'cinematic portrait photo, painter in a sunlit studio, paint on hands, 35mm lens',
          'cinematic portrait photo, teenager on a rooftop at sunset, wind in hair, film grain',
          'cinematic portrait photo, farmer leaning on a fence, morning mist, 85mm lens',
        ],
      },
      {
        heading: 'Genre and editorial',
        prompts: [
          'cinematic portrait photo, astronaut with helmet off inside a space station, cool blue light',
          'cinematic portrait photo, medieval knight with a dirty face after battle, overcast, muted colors',
          'cinematic portrait photo, cyberpunk street vendor with LED tattoos, neon light, rain',
          'cinematic portrait photo, 1970s style portrait of a musician, warm film look, grain',
          'cinematic portrait photo, desert wanderer with a scarf, harsh sun, long shadows',
          'cinematic portrait photo, ballet dancer backstage, mirror lights, soft focus',
          'cinematic portrait photo, scientist in a dark lab lit by a screen, 50mm lens',
          'cinematic portrait photo, twin sisters back to back, split lighting, black and white',
        ],
      },
    ],
    tips: [
      'Lens and light words do most of the work: 85mm with shallow depth of field for classic portraits, 35mm when the setting matters, Rembrandt or split lighting for drama.',
      'If skin looks waxy, remove words like “perfect skin” and “ultra detailed”, and add “natural skin texture” or a film stock.',
      'Do not create realistic images of real people without their consent.',
    ],
    guides: ['2026-02-16-master-ai-art-lenses-prompts-guide', '2026-02-23-master-ai-art-emotion-prompts', '2025-11-28-dall-e-3-photorealism-prompt-guide'],
  },
  {
    slug: 'logos',
    name: 'Logos',
    h1: 'AI Logo Prompt Generator',
    metaTitle: 'AI Logo Prompt Generator: {count} Logo Prompts to Copy',
    description:
      'Free AI logo prompt generator for symbols, mascots and wordmarks. Pick a style and color, then copy a logo prompt for Midjourney, SDXL, Flux or ChatGPT.',
    lead:
      'Describe the brand and its symbol, pick a logo style and colors, and copy a prompt for your image model. Use the results as sketches, then redraw the chosen idea as a vector.',
    builder: {
      subjectLabel: 'Brand and symbol',
      defaultSubject: 'a coffee shop called Northbean, symbol of a coffee bean and a compass',
      tag: 'logo design',
      sentence: 'A logo design for',
      groups: [
        single('type', 'Type', [
          opt('symbol', 'Symbol', 'simple symbol, no text'),
          opt('combo', 'Symbol + name', 'symbol with the brand name below'),
          opt('mascot', 'Mascot', 'mascot logo, friendly character'),
          opt('emblem', 'Emblem / badge', 'emblem badge logo, circular'),
          opt('monogram', 'Monogram', 'monogram of the initials'),
        ]),
        single('style', 'Style', [
          opt('flat', 'Flat minimal', 'flat minimal vector, clean lines'),
          opt('geometric', 'Geometric', 'geometric shapes, grid-based'),
          opt('line', 'Line art', 'single line art, thin strokes'),
          opt('vintage', 'Vintage', 'vintage hand-drawn style'),
          opt('playful', 'Playful', 'playful rounded shapes'),
        ]),
        single('color', 'Colors', [
          opt('mono', 'Black on white', 'black on white'),
          opt('two', 'Two colors', 'two-color palette'),
          opt('earthy', 'Earthy', 'earthy brown and green palette'),
          opt('bright', 'Bright', 'bright vibrant colors'),
        ]),
      ],
      defaults: { type: ['symbol'], style: ['flat'], color: ['mono'] },
      aspectRatios: ['1:1', '3:2'],
      negatives: ['photorealistic', '3d render', 'gradient', 'shadow', 'texture', 'noise', 'cluttered', 'misspelled text', 'watermark'],
      midjourneyNo: ['photo', 'gradient', 'shadow', 'texture', 'watermark'],
    },
    examples: [
      {
        heading: 'Symbols and icons',
        prompts: [
          'logo design, minimal geometric fox head made of triangles, flat vector, black on white, simple symbol, no text',
          'logo design, abstract wave inside a circle for an ocean nonprofit, two-color palette, flat vector',
          'logo design, leaf and drop of water combined, eco brand, single line art, white background',
          'logo design, mountain peak and sun rising, outdoor brand, flat minimal vector',
          'logo design, rocket shaped like a pencil for an education app, playful rounded shapes, bright colors',
          'logo design, coffee bean with a compass needle, flat minimal vector, earthy palette',
          'logo design, house outline with a key hole, real estate brand, clean lines, black on white',
          'logo design, owl made of simple circles, geometric, two colors, white background',
        ],
      },
      {
        heading: 'Mascots and badges',
        prompts: [
          'logo design, friendly bear mascot holding a honey jar, playful, thick outlines, flat colors',
          'logo design, vintage emblem badge for a barber shop, scissors and razor, hand-drawn style',
          'logo design, esports mascot of a fierce wolf head, bold outlines, two colors',
          'logo design, circular badge for a craft brewery, hops and barley, vintage style',
          'logo design, cute robot mascot for a tech startup, rounded shapes, bright colors',
          'logo design, camping club patch with a tent and stars, embroidered badge look',
          'logo design, chef cat mascot for a bakery, simple line art, warm colors',
          'logo design, shield emblem for a football club, lion and star, flat vector',
        ],
      },
      {
        heading: 'Monograms and wordmarks',
        prompts: [
          'logo design, monogram of the letters A and M intertwined, elegant serif, black on white',
          'logo design, minimal monogram of the letter K made from two lines, geometric',
          'logo design, wordmark for a fashion brand, thin modern serif, black on white, lots of space',
          'logo design, letter S shaped like a snake, flat vector, two colors',
          'logo design, monogram inside a circle for a wedding studio, line art, gold on white',
          'logo design, bold letter N with a cut corner, tech startup, flat minimal',
          'logo design, initials JR in a vintage hand-lettered style, badge shape',
          'logo design, wordmark with the dot of the i as a sun, playful, bright colors',
        ],
      },
    ],
    tips: [
      'AI logos are sketches. Redraw the chosen idea as a vector in Illustrator, Figma or Inkscape, and check for existing trademarks before using it.',
      'Text in logos is still error-prone. Generate the symbol, then set the brand name in a real font.',
      'Ask for flat colors on a plain white background. Shading, textures and 3D effects make a logo hard to trace and print.',
    ],
    guides: ['2025-11-30-ai-art-styles-guide', '2026-05-01-master-ink-sketch-ai-art-prompts-pen-ink', '2025-11-29-stable-diffusion-negative-prompts-guide'],
  },
  {
    slug: 'fashion-editorial',
    name: 'Fashion Editorial',
    h1: 'Fashion Photography Prompt Generator',
    metaTitle: 'Fashion Photography Prompt Generator: {count} AI Prompts',
    description:
      'Free fashion photography prompt generator for editorials, lookbooks and campaigns. Pick a setting, light and pose, then copy a prompt for any image model.',
    lead:
      'Describe the outfit and the model, choose the setting, the light and the pose, and copy a fashion photography prompt for your image model.',
    builder: {
      subjectLabel: 'Outfit and model',
      defaultSubject: 'a model in an oversized camel wool coat and white sneakers',
      tag: 'fashion editorial photo',
      sentence: 'A fashion editorial photo of',
      groups: [
        single('setting', 'Setting', [
          opt('studio', 'Studio', 'seamless studio backdrop'),
          opt('street', 'Street', 'city street, urban backdrop'),
          opt('beach', 'Beach', 'beach at golden hour'),
          opt('desert', 'Desert', 'desert dunes'),
          opt('set', 'Surreal set', 'surreal set with bold geometric shapes'),
        ]),
        single('light', 'Light', [
          opt('flash', 'Direct flash', 'direct on-camera flash, hard shadow'),
          opt('soft', 'Soft studio', 'soft studio light'),
          opt('sun', 'Hard sun', 'hard midday sun'),
          opt('golden', 'Golden hour', 'golden hour light'),
        ]),
        single('pose', 'Pose', [
          opt('walk', 'Walking', 'mid-stride walking pose'),
          opt('still', 'Still', 'still standing pose, looking at the camera'),
          opt('sit', 'Seated', 'seated pose'),
          opt('motion', 'Fabric motion', 'fabric flowing in motion'),
        ]),
        single('look', 'Look', [
          opt('magazine', 'Magazine cover', 'magazine cover composition'),
          opt('film', 'Film', '35mm film look, grain'),
          opt('bw', 'Black & white', 'black and white'),
          opt('clean', 'Clean lookbook', 'clean lookbook style, full body'),
        ]),
      ],
      defaults: { setting: ['street'], light: ['golden'], pose: ['walk'], look: ['film'] },
      aspectRatios: ['2:3', '4:5', '9:16', '16:9'],
      negatives: ['bad anatomy', 'extra fingers', 'deformed hands', 'plastic skin', 'blurry', 'lowres', 'watermark', 'text', 'logo'],
      midjourneyNo: ['text', 'watermark', 'logo'],
    },
    examples: [
      {
        heading: 'Editorial',
        prompts: [
          'fashion editorial photo, model in a sculptural white dress, surreal set with bold geometric shapes, soft studio light',
          'fashion editorial photo, high-fashion portrait, monochrome outfit, dramatic studio lighting, 85mm lens',
          'fashion editorial photo, model in a red silk gown on desert dunes, fabric flowing in the wind, golden hour',
          'fashion editorial photo, avant-garde outfit with oversized collars, black and white, high contrast',
          'fashion editorial photo, model lying on a pool deck, direct flash, hard shadow, summer colors',
          'fashion editorial photo, magazine cover composition, tailored suit, pastel backdrop',
          'fashion editorial photo, model in a vintage car, 35mm film look, warm tones',
          'fashion editorial photo, layered knitwear in a misty forest, muted colors',
        ],
      },
      {
        heading: 'Streetwear and campaigns',
        prompts: [
          'fashion editorial photo, streetwear campaign, oversized hoodie and cargo pants, urban backdrop, direct flash',
          'fashion editorial photo, group of friends in matching tracksuits on a basketball court, wide shot',
          'fashion editorial photo, sneaker campaign, model mid-jump, concrete wall, hard sun',
          'fashion editorial photo, puffer jacket in a snowy city at night, neon reflections',
          'fashion editorial photo, denim jacket, subway platform, motion blur of a passing train',
          'fashion editorial photo, skate fashion on a rooftop at sunset, low angle',
          'fashion editorial photo, bold color-blocked outfit against a yellow wall, hard shadows',
          'fashion editorial photo, rain jacket campaign, rain, glossy wet streets, cinematic',
        ],
      },
      {
        heading: 'Lookbook',
        prompts: [
          'fashion editorial photo, resort collection lookbook, linen set on a beach, golden hour, full body',
          'fashion editorial photo, clean lookbook style, minimalist outfit, white studio backdrop, full body',
          'fashion editorial photo, autumn coat lookbook, park path with fallen leaves, soft light',
          'fashion editorial photo, wedding guest dress, garden setting, soft daylight',
          'fashion editorial photo, workwear capsule, office lobby, clean lines, natural light',
          'fashion editorial photo, kids fashion lookbook, playground, bright colors, candid',
          'fashion editorial photo, accessories close-up, hands with rings and a leather bag, soft light',
          'fashion editorial photo, knitwear lookbook, cozy cabin interior, warm tones',
        ],
      },
    ],
    tips: [
      'Name the fabric and how it moves: flowing silk, stiff denim, chunky knit. It changes the drape more than adjectives like “elegant”.',
      'Check garments, hands and any logos closely. These are where generated fashion images go wrong.',
      'If you sell the clothes, product photos must show the real item. Use generated images for mood boards and campaign ideas.',
    ],
    guides: ['2026-02-16-master-ai-art-lenses-prompts-guide', '2026-02-23-master-ai-art-emotion-prompts', '2025-11-30-ai-art-styles-guide'],
  },
  {
    slug: 'real-estate-interiors',
    name: 'Interiors',
    h1: 'Interior Design Prompt Generator',
    metaTitle: 'Interior Design Prompt Generator: {count} AI Room Prompts',
    description:
      'Free interior design prompt generator. Choose the room style, light and camera, then copy a prompt for Midjourney, SDXL, Flux or ChatGPT. For mood boards.',
    lead:
      'Pick a room, an interior style and the light, add details, and copy an interior design prompt for your image model. Use the results for mood boards and staging ideas.',
    builder: {
      subjectLabel: 'Room and details',
      defaultSubject: 'a living room with a large sofa and floor-to-ceiling windows',
      tag: 'interior design photo',
      sentence: 'An interior design photo of',
      groups: [
        single('style', 'Style', [
          opt('scandi', 'Scandinavian', 'Scandinavian style, light wood, white walls'),
          opt('japandi', 'Japandi', 'Japandi style, natural materials, calm'),
          opt('industrial', 'Industrial', 'industrial loft style, exposed brick'),
          opt('midcentury', 'Mid-century', 'mid-century modern furniture'),
          opt('luxury', 'Modern luxury', 'modern luxury, marble and brass'),
          opt('boho', 'Boho', 'bohemian style, plants and textiles'),
        ]),
        single('light', 'Light', [
          opt('daylight', 'Daylight', 'soft natural daylight'),
          opt('golden', 'Golden hour', 'golden hour sunlight'),
          opt('evening', 'Evening lamps', 'evening, warm lamp light'),
        ]),
        single('camera', 'Camera', [
          opt('wide', 'Wide 24mm', 'wide angle 24mm, straight verticals'),
          opt('corner', 'Corner view', 'corner view showing two walls'),
          opt('detail', 'Detail shot', 'detail shot of furniture and decor'),
        ]),
        multi('extras', 'Extras', [
          opt('plants', 'Plants', 'indoor plants'),
          opt('view', 'Window view', 'view of the garden through the windows'),
          opt('art', 'Wall art', 'framed art on the walls'),
          opt('fireplace', 'Fireplace', 'fireplace'),
        ]),
      ],
      defaults: { style: ['scandi'], light: ['daylight'], camera: ['wide'], extras: ['plants'] },
      aspectRatios: ['3:2', '16:9', '4:5', '1:1'],
      negatives: ['warped perspective', 'bent lines', 'distorted furniture', 'clutter', 'blurry', 'lowres', 'text', 'watermark', 'people'],
      midjourneyNo: ['people', 'text', 'watermark', 'clutter'],
    },
    examples: [
      {
        heading: 'Living spaces',
        prompts: [
          'interior design photo, luxury modern living room, wide angle 24mm, natural window light, marble and brass',
          'interior design photo, Scandinavian living room, light oak floor, white walls, indoor plants, soft daylight',
          'interior design photo, industrial loft with exposed brick and steel windows, leather sofa, golden hour',
          'interior design photo, Japandi living room, low wooden furniture, linen, calm neutral tones',
          'interior design photo, mid-century modern lounge with a walnut sideboard, evening lamp light',
          'interior design photo, boho reading nook with rattan chair, plants and textiles, warm light',
          'interior design photo, open-plan loft apartment, floor-to-ceiling windows, city view, golden hour',
          'interior design photo, cozy cabin living room with a stone fireplace, evening, warm lamps',
        ],
      },
      {
        heading: 'Kitchens, baths and bedrooms',
        prompts: [
          'interior design photo, minimal Scandinavian kitchen, soft daylight, clean surfaces, wide angle',
          'interior design photo, spa-like bathroom, marble surfaces, brass fixtures, diffused natural light',
          'interior design photo, cozy bedroom with linen bedding, warm ambient lighting, morning',
          'interior design photo, dark green kitchen cabinets with brass handles, modern luxury',
          'interior design photo, small bathroom with terrazzo tiles, round mirror, bright daylight',
          'interior design photo, kids bedroom with a reading tent and soft toys, pastel colors',
          'interior design photo, master bedroom with a view of the sea, golden hour, Japandi style',
          'interior design photo, farmhouse kitchen with an island and pendant lights, warm wood',
        ],
      },
      {
        heading: 'Work, dining and outdoor',
        prompts: [
          'interior design photo, home office with a walnut desk facing a window, plants, soft daylight',
          'interior design photo, dining room with a round oak table and paper pendant lamp, evening, warm light',
          'interior design photo, small balcony garden with string lights and a bistro set, blue hour',
          'interior design photo, entryway with a bench, coat hooks and a round mirror, Scandinavian style',
          'interior design photo, boutique hotel lobby, velvet chairs, brass details, modern luxury',
          'interior design photo, covered patio with outdoor sofa and a fire pit, golden hour',
          'interior design photo, small studio apartment with a loft bed, clever storage, bright daylight',
          'interior design photo, cafe interior with plants and wooden tables, morning light, corner view',
        ],
      },
    ],
    tips: [
      'If you use the image to market a property, label it as virtually staged and never change walls, windows, views or room sizes.',
      'Ask for a wide lens with straight verticals; generated rooms often lean or bend at the edges. Check doors, windows and furniture scale.',
      'Name two or three materials (oak, linen, travertine) rather than a long list of adjectives.',
    ],
    guides: ['2026-02-16-master-ai-art-lenses-prompts-guide', '2026-02-24-master-ai-art-weather-time-prompts', '2025-11-30-ai-art-styles-guide'],
  },
];

export function countExamples(useCase: PromptUseCase) {
  return useCase.examples.reduce((total, group) => total + group.prompts.length, 0);
}

/** "Pixel Art" from "Pixel Art Prompt Generator". */
export function getUseCaseTopic(useCase: PromptUseCase) {
  return useCase.h1.replace(/ Prompt Generator$/, '');
}

export function getUseCaseTitle(useCase: PromptUseCase) {
  return useCase.metaTitle.replace('{count}', String(countExamples(useCase)));
}

export function getPromptUseCase(slug: string) {
  return promptUseCases.find((item) => item.slug === slug);
}

export function getAllPromptUseCaseSlugs() {
  return promptUseCases.map((item) => item.slug);
}

/** The next `limit` use cases after `slug`, wrapping around, so every page links onward. */
export function getRelatedPromptUseCases(slug: string, limit = 4) {
  const start = promptUseCases.findIndex((item) => item.slug === slug);
  const count = Math.min(Math.max(1, limit), promptUseCases.length - 1);
  return Array.from({ length: count }, (_, offset) => promptUseCases[(start + 1 + offset) % promptUseCases.length]!);
}
