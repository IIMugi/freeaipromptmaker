'use client';

import { usePathname } from 'next/navigation';

export function BreadcrumbsJSON() {
    const pathname = usePathname();

    if (!pathname || pathname === '/') return null;

    const paths = pathname.split('/').filter(Boolean);
    const siteUrl = 'https://freeaipromptmaker.com';

    const itemListElement = [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
        },
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
        currentPath += `/${path}`;
        itemListElement.push({
            '@type': 'ListItem',
            position: index + 2,
            name: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
            item: `${siteUrl}${currentPath}`,
        });
    });

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement,
                }),
            }}
        />
    );
}
