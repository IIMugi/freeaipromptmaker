import { Children, isValidElement, type ReactNode } from 'react';
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
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
];

const getNodeText = (node: ReactNode): string => Children.toArray(node)
  .map((child) => {
    if (typeof child === 'string' || typeof child === 'number') return String(child);
    if (!isValidElement<{ children?: ReactNode }>(child)) return '';
    return getNodeText(child.props.children);
  })
  .join(' ')
  .replace(/\s+/g, ' ')
  .trim();

const getTableHeaders = (node: ReactNode): string[] => Children.toArray(node).flatMap((child) => {
  if (!isValidElement<{ children?: ReactNode }>(child)) return [];
  if (child.type === 'th') return [getNodeText(child.props.children)];
  return getTableHeaders(child.props.children);
});

const getTableCells = (node: ReactNode): string[] => Children.toArray(node).flatMap((child) => {
  if (!isValidElement<{ children?: ReactNode }>(child)) return [];
  if (child.type === 'td') return [getNodeText(child.props.children)];
  return getTableCells(child.props.children);
});

const MAX_TABLE_LABEL_PART_LENGTH = 48;

const boundTableLabelPart = (text: string) => text.length <= MAX_TABLE_LABEL_PART_LENGTH
  ? text
  : `${text.slice(0, MAX_TABLE_LABEL_PART_LENGTH - 1).trimEnd()}…`;

const getTableRegionLabel = (children: ReactNode) => {
  const headers = getTableHeaders(children).filter(Boolean).slice(0, 2).map(boundTableLabelPart);
  const cells = getTableCells(children).filter(Boolean).slice(0, 2).map(boundTableLabelPart);
  const fallback = boundTableLabelPart(
    getNodeText(children).split(' ').filter(Boolean).slice(0, 4).join(' '),
  );
  const descriptors = [
    headers.join(', '),
    cells.length ? `first row: ${cells.join(', ')}` : '',
  ].filter(Boolean).join('; ');

  // Identical table content intentionally yields the same semantic name.
  return `Scrollable data table: ${descriptors || fallback || 'Tabular data'}`;
};

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
          pre: ({ children }) => <pre className="code-block" tabIndex={0}>{children}</pre>,
          table: ({ children }) => {
            return (
              <div
                className="table-scroll overflow-x-auto"
                role="region"
                aria-label={getTableRegionLabel(children)}
                tabIndex={0}
              >
                <table className="data-table">{children}</table>
              </div>
            );
          },
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
