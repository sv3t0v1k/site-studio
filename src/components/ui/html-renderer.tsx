import DOMPurify from 'isomorphic-dompurify'

interface HtmlRendererProps {
  html: string
  className?: string
}

export default function HtmlRenderer({ html, className = '' }: HtmlRendererProps) {
  // Sanitize HTML content for security
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 's',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'a', 'img',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'title',
      'class',
    ],
  })

  return (
    <div
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        // Custom styles for the rendered HTML to match Noir theme
        color: '#d5d5d5',
      }}
    />
  )
}
