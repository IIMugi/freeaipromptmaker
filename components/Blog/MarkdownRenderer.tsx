'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';

interface MarkdownRendererProps {
  content: string;
}

const allowedElements = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'strong',
  'em',
  'blockquote',
  'ul',
  'ol',
  'li',
  'hr',
  'a',
  'code',
  'pre',
];

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        allowedElements={allowedElements}
        skipHtml
        components={{
          h1: ({ children, ...props }) => (
            <h2 className="heading-2" {...props}>
              {children}
            </h2>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="heading-2" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="heading-3" {...props}>
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="paragraph">{children}</p>,
          a: ({ children, href }) => {
            const isExternal = href ? /^https?:\/\//.test(href) : false;
            return (
              <a
                href={href}
                className="link"
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            );
          },
          ul: ({ children }) => <ul className="unordered-list">{children}</ul>,
          ol: ({ children }) => <ol className="ordered-list">{children}</ol>,
          li: ({ children }) => <li className="list-item">{children}</li>,
          blockquote: ({ children }) => <blockquote className="blockquote">{children}</blockquote>,
          hr: () => <hr className="divider" />,
          strong: ({ children }) => <strong>{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
          pre: ({ children }) => <pre className="code-block">{children}</pre>,
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              return <code className="inline-code">{children}</code>;
            }
            return <code className={className}>{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
