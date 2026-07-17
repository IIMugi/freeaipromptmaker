import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { writeDraftArtifact } from '../../scripts/lib/draft-output.js';

const root = process.cwd();

describe('content publishing safety', () => {
  it('has no scheduled workflow that pushes generated content', () => {
    const workflows = ['daily-content.yml', 'auto-blogger.yml'].map((name) =>
      fs.readFileSync(path.join(root, '.github/workflows', name), 'utf8'),
    );
    for (const workflow of workflows) {
      expect(workflow).not.toMatch(/schedule:/);
      expect(workflow).not.toMatch(/git push/);
    }
  });

  it('does not instruct a model to invent human experience', () => {
    const scripts = ['content-manager.js', 'generate-post.js']
      .map((name) => fs.readFileSync(path.join(root, 'scripts', name), 'utf8'))
      .join('\n');
    expect(scripts).not.toMatch(/in my experience|i.ve found|what works for me/i);
    expect(scripts).not.toMatch(/indistinguishable from.*human/i);
    expect(scripts).not.toMatch(/\bexpert\b|sound (?:robotic|[^\n]*ai-generated)|high-volume/i);
    expect(scripts).toMatch(/unverified draft/i);
    expect(scripts).toMatch(/primary sources/i);
    expect(scripts).toMatch(/version/i);
    expect(scripts).toMatch(/limitations/i);
  });

  it.each(['content-manager.js', 'generate-post.js'])(
    '%s rejects absolute, traversal, and verified-post output targets before generation',
    (scriptName) => {
      const verifiedPost = path.join(root, 'posts', '2025-11-29-stable-diffusion-negative-prompts-guide.mdx');
      const original = fs.readFileSync(verifiedPost, 'utf8');
      const targets = [
        verifiedPost,
        'work/content-drafts/../../posts/2025-11-29-stable-diffusion-negative-prompts-guide.mdx',
        '../outside-draft.mdx',
      ];

      for (const target of targets) {
        const env: NodeJS.ProcessEnv = { ...process.env, CONTENT_DRAFT_OUTPUT: target, GEMINI_API_KEY: '' };
        for (let index = 1; index <= 10; index += 1) env[`GEMINI_API_KEY_${index}`] = '';
        const result = spawnSync(process.execPath, [path.join(root, 'scripts', scriptName)], {
          cwd: root,
          env,
          encoding: 'utf8',
          timeout: 10_000,
        });
        expect(result.status).not.toBe(0);
        expect(`${result.stdout}\n${result.stderr}`).toMatch(/draft output must stay within/i);
        expect(fs.readFileSync(verifiedPost, 'utf8')).toBe(original);
      }
    },
  );

  it('never overwrites an existing draft artifact', async () => {
    const relative = `work/content-drafts/collision-${process.pid}.mdx`;
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, 'editor-owned draft');
    try {
      await expect(writeDraftArtifact(relative, 'replacement')).rejects.toMatchObject({ code: 'EEXIST' });
      expect(fs.readFileSync(target, 'utf8')).toBe('editor-owned draft');
    } finally {
      fs.rmSync(target, { force: true });
    }
  });

  it('writes only the explicitly selected draft artifact', () => {
    const manager = fs.readFileSync(path.join(root, 'scripts', 'content-manager.js'), 'utf8');
    const generator = fs.readFileSync(path.join(root, 'scripts', 'generate-post.js'), 'utf8');

    expect(manager).not.toMatch(/writeFile\(CONTENT_HISTORY_PATH/);
    expect(generator).not.toMatch(/writeFile\(CONFIG\.contentPlannerPath/);
  });
});
