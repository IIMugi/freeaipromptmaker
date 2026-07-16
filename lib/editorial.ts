import editorialStatus from '@/data/editorial-status.json';

export type EditorialState = 'verified' | 'needs-review' | 'archived';

export type EditorialRecord = {
  state: EditorialState;
  lastVerified?: string;
  testedVersion?: string;
  sources?: string[];
};

const records = editorialStatus as Record<string, EditorialRecord>;

export function getEditorialPolicy(state: EditorialState) {
  const visible = state === 'verified';
  return { index: visible, inSitemap: visible, inHub: visible } as const;
}

export function getEditorialRecord(slug: string): EditorialRecord {
  return records[slug] ?? { state: 'needs-review' };
}

export function getEditorialRecords() {
  return records;
}
