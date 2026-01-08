import type { Metadata } from 'next';
import Link from 'next/link';
import {
    ExternalLink,
    Star,
    Check,
    X,
    Sparkles,
    ArrowRight,
    Zap
} from 'lucide-react';
import { aiTools } from '@/data/ai-tools';

export const metadata: Metadata = {
    title: 'Best AI Art Generators 2025 - Compare Top AI Image Tools',
    description: 'Compare the best AI art generators of 2025. Detailed reviews of Midjourney, DALL-E 3, Leonardo.ai, Stable Diffusion, and more. Find the perfect AI tool for your needs.',
    keywords: ['AI art generator', 'best AI image generator 2025', 'Midjourney alternatives', 'AI art tools comparison', 'free AI art generator'],
    openGraph: {
        title: 'Best AI Art Generators 2025 - Complete Comparison',
        description: 'Find the perfect AI art tool. Compare features, pricing, and quality of top AI image generators.',
    },
};

export default function ToolsPage() {
    const imageGenerators = aiTools.filter(tool => tool.category === 'image-generator');
    const videoGenerators = aiTools.filter(tool => tool.category === 'video');

    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 text-violet-400 rounded-full text-sm mb-6">
                    <Sparkles className="w-4 h-4" />
                    Updated December 2025
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Best AI Art Generators 2025
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                    Compare the top AI image and video generators. Find the perfect tool for your creative needs.
                </p>

                {/* Quick CTA */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all"
                >
                    <Zap className="w-5 h-5" />
                    Create Prompts for Any Tool
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {/* Quick Comparison Table */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Comparison</h2>
                <div className="overflow-x-auto">
                    <table className="w-full bg-slate-800/50 rounded-xl border border-slate-700">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left p-4 text-slate-300 font-medium">Tool</th>
                                <th className="text-left p-4 text-slate-300 font-medium">Best For</th>
                                <th className="text-center p-4 text-slate-300 font-medium">Free Tier</th>
                                <th className="text-left p-4 text-slate-300 font-medium">Price</th>
                                <th className="text-center p-4 text-slate-300 font-medium">Rating</th>
                                <th className="text-center p-4 text-slate-300 font-medium">Try It</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aiTools.map((tool) => (
                                <tr key={tool.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-xl">
                                                {tool.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-white">{tool.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">{tool.bestFor}</td>
                                    <td className="p-4 text-center">
                                        {tool.pricing.free ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-400">
                                                <Check className="w-4 h-4" />
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-slate-500">
                                                <X className="w-4 h-4" />
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-300 text-sm">{tool.pricing.startingPrice}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span className="text-white">{tool.rating}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <a
                                            href={tool.affiliateLink || tool.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
                                        >
                                            Visit <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Image Generators Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-violet-400" />
                    Image Generators
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {imageGenerators.map((tool) => (
                        <article
                            key={tool.id}
                            className="bg-slate-800 rounded-xl border border-slate-700 hover:border-violet-500/50 transition-all overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-700">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl text-white font-bold">
                                            {tool.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-white">{tool.rating}</span>
                                                <span className="text-slate-500">/ 5</span>
                                            </div>
                                        </div>
                                    </div>
                                    {tool.pricing.free && (
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                                            Free Tier
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm">{tool.shortDescription}</p>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Pricing */}
                                <div className="mb-4">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Pricing</span>
                                    <p className="text-white font-medium">
                                        {tool.pricing.free && tool.pricing.freeTier && (
                                            <span className="text-emerald-400">Free: {tool.pricing.freeTier}</span>
                                        )}
                                        {tool.pricing.startingPrice}
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="mb-4">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Key Features</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {tool.features.slice(0, 4).map((feature) => (
                                            <span
                                                key={feature}
                                                className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Pros/Cons */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <span className="text-xs text-emerald-500 uppercase tracking-wider">Pros</span>
                                        <ul className="mt-2 space-y-1">
                                            {tool.pros.slice(0, 2).map((pro) => (
                                                <li key={pro} className="flex items-start gap-1 text-xs text-slate-400">
                                                    <Check className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="text-xs text-red-500 uppercase tracking-wider">Cons</span>
                                        <ul className="mt-2 space-y-1">
                                            {tool.cons.slice(0, 2).map((con) => (
                                                <li key={con} className="flex items-start gap-1 text-xs text-slate-400">
                                                    <X className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* CTA */}
                                <a
                                    href={tool.affiliateLink || tool.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg transition-all font-medium"
                                >
                                    Try {tool.name}
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Video Generators Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    Video Generators
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {videoGenerators.map((tool) => (
                        <article
                            key={tool.id}
                            className="bg-slate-800 rounded-xl border border-slate-700 hover:border-violet-500/50 transition-all overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center text-2xl text-white font-bold">
                                        {tool.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                                        <p className="text-slate-400 text-sm">{tool.shortDescription}</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">{tool.description}</p>
                                <a
                                    href={tool.affiliateLink || tool.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition-all font-medium"
                                >
                                    Try {tool.name}
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="text-center bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-8 border border-violet-500/30">
                <h2 className="text-2xl font-bold text-white mb-3">
                    Ready to Create Amazing AI Art?
                </h2>
                <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                    Use our free prompt generator to create perfect prompts for any AI art tool.
                    No signup required.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all font-medium text-lg"
                >
                    <Sparkles className="w-5 h-5" />
                    Start Creating Prompts - Free
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </section>
        </div>
    );
}
