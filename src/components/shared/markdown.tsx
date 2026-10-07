import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { safeResourceUrl } from '@/shared/url'

/** Renders authored Markdown (GFM tables, lists). Raw HTML is never rendered. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('prose-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        urlTransform={(url) => safeResourceUrl(url) ?? ''}
        components={{
          a: ({ href, children: label }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
