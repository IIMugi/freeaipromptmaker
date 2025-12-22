import { PromptBuilder } from '@/components/Generator';
import { PromptGallery } from '@/components/Gallery';

export default function Home() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Impact.com Site Verification */}
      <span className="hidden">Impact-Site-Verification: 1fda626d-269f-49fc-8dc6-994ceda192c6</span>

      <PromptBuilder />

      {/* Divider */}
      <div className="max-w-6xl mx-auto my-16">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      </div>

      {/* Community Prompts Gallery */}
      <div className="max-w-6xl mx-auto">
        <PromptGallery />
      </div>
    </div>
  );
}
