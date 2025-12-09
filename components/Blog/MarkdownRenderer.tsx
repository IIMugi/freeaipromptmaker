'use client';

import { useMemo } from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Basit Markdown renderer
 * MDX yerine vanilla markdown kullanıyoruz - daha hafif ve hızlı
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const htmlContent = useMemo(() => {
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    // Basit markdown -> HTML dönüşümü
    let html = content
      // Code blocks (```code```)
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre class="code-block"><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
      })
      // Inline code (`code`)
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // Headers
      .replace(/^### (.*$)/gm, (_m, title) => {
        const id = slugify(title);
        return `<h3 id="${id}" class="heading-3">${title}</h3>`;
      })
      .replace(/^## (.*$)/gm, (_m, title) => {
        const id = slugify(title);
        return `<h2 id="${id}" class="heading-2">${title}</h2>`;
      })
      .replace(/^# (.*$)/gm, (_m, title) => {
        const id = slugify(title);
        return `<h1 id="${id}" class="heading-1">${title}</h1>`;
      })
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="link">$1</a>')
      // Unordered lists
      .replace(/^\* (.*$)/gm, '<li class="list-item">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="list-item">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gm, '<li class="list-item-ordered">$1</li>')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="blockquote">$1</blockquote>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="divider" />')
      // Paragraphs (her satırı p ile sar, boş satırları koru)
      .split('\n\n')
      .map((para) => {
        // Zaten HTML tag'i varsa dokunma
        if (para.trim().startsWith('<')) return para;
        // Boş değilse p ile sar
        if (para.trim()) {
          return `<p class="paragraph">${para.replace(/\n/g, '<br />')}</p>`;
        }
        return '';
      })
      .join('\n');

    // List items'ları ul/ol ile sar
    html = html
      .replace(/(<li class="list-item">.*?<\/li>\n?)+/g, '<ul class="unordered-list">$&</ul>')
      .replace(/(<li class="list-item-ordered">.*?<\/li>\n?)+/g, '<ol class="ordered-list">$&</ol>');

    return html;
  }, [content]);

  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

