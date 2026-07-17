import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

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
  });

  it('writes only the explicitly selected draft artifact', () => {
    const manager = fs.readFileSync(path.join(root, 'scripts', 'content-manager.js'), 'utf8');
    const generator = fs.readFileSync(path.join(root, 'scripts', 'generate-post.js'), 'utf8');

    expect(manager).not.toMatch(/writeFile\(CONTENT_HISTORY_PATH/);
    expect(generator).not.toMatch(/writeFile\(CONFIG\.contentPlannerPath/);
  });
});
