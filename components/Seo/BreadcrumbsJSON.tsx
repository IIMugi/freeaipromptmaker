'use client';

import { usePathname } from 'next/navigation';
import { breadcrumbJsonLd } from '@/lib/seo';

export function BreadcrumbsJSON() {
    const pathname = usePathname();

    if (!pathname || pathname === '/') return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbJsonLd(pathname)),
            }}
        />
    );
}
