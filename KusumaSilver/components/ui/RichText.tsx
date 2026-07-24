import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { PortableTextBlock } from '@/types';

/**
 * Renders formatted text from the CMS — paragraphs, bullet points, numbered
 * lists, bold, italic and links.
 *
 * The styling lives here rather than in the CMS on purpose: the owner chooses
 * the words and the structure, the design chooses how they look. That is what
 * stops a product description drifting out of step with the rest of the site.
 */

/** Links written as a bare domain still need a scheme to leave the site. */
function isInternal(href: string): boolean {
  return href.startsWith('/');
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = (value?.href as string) ?? '';
      if (!href) return <>{children}</>;
      const className = 'underline underline-offset-2 transition-colors hover:text-accent';
      if (isInternal(href)) {
        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      );
    },
  },
};

interface RichTextProps {
  value?: PortableTextBlock[] | null;
  /** Rendered when the field is empty — usually the built-in fallback copy. */
  fallback?: React.ReactNode;
  className?: string;
}

export function RichText({ value, fallback, className }: RichTextProps) {
  const hasContent =
    Array.isArray(value) &&
    value.some((block) => {
      if (block?._type !== 'block') return true;
      // A block with only empty spans is "written but blank" — treat as empty.
      return (block.children ?? []).some((child) => (child?.text ?? '').trim().length > 0);
    });

  if (!hasContent) return <>{fallback ?? null}</>;

  return (
    <div className={cn('space-y-4', className)}>
      <PortableText value={value!} components={components} />
    </div>
  );
}
