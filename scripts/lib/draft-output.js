import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleUrl = new URL(import.meta.url);
const repositoryRoot = moduleUrl.protocol === 'file:'
  ? path.resolve(fileURLToPath(new URL('../..', moduleUrl)))
  : process.cwd();
const draftRoot = path.join(repositoryRoot, 'work', 'content-drafts');

export function resolveDraftOutput(output = process.env.CONTENT_DRAFT_OUTPUT) {
  if (!output) throw new Error('CONTENT_DRAFT_OUTPUT is required; publishing is disabled.');
  if (path.isAbsolute(output) || path.win32.isAbsolute(output)) {
    throw new Error('Draft output must stay within work/content-drafts and name one new .mdx file.');
  }

  const target = path.resolve(repositoryRoot, output);
  const relative = path.relative(draftRoot, target);
  if (
    !relative ||
    relative.startsWith(`..${path.sep}`) ||
    relative === '..' ||
    path.isAbsolute(relative) ||
    path.dirname(relative) !== '.' ||
    path.extname(relative).toLowerCase() !== '.mdx'
  ) {
    throw new Error('Draft output must stay within work/content-drafts and name one new .mdx file.');
  }

  return target;
}

export async function writeDraftArtifact(output, content) {
  const target = resolveDraftOutput(output);
  await fs.mkdir(draftRoot, { recursive: true });
  const realRoot = await fs.realpath(draftRoot);
  const normalizedRealRoot = path.resolve(realRoot);
  const normalizedDraftRoot = path.resolve(draftRoot);
  const rootsMatch = process.platform === 'win32'
    ? normalizedRealRoot.toLowerCase() === normalizedDraftRoot.toLowerCase()
    : normalizedRealRoot === normalizedDraftRoot;
  if (!rootsMatch) {
    throw new Error('Draft output root must not be a symbolic link.');
  }
  await fs.writeFile(target, content, { flag: 'wx' });
  return target;
}
