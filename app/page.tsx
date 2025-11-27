import { PromptBuilder } from '@/components/Generator';
import { PromptGallery } from '@/components/Gallery';

export default function Home() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
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
