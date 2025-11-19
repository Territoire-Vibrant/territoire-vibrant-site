'use client'

import clsx from 'clsx'
import ReactMarkdown, { type Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import 'highlight.js/styles/github.css'

type MarkdownPreviewProps = {
  markdown: string
  className?: string
  emptyPlaceholder?: string
}

const Code: Components['code'] = ({ className, children, ...props }) => {
  return (
    <pre className='mt-4 overflow-x-auto rounded-md bg-muted/70 p-3 text-sm leading-relaxed'>
      <code className={clsx('hljs', className)} {...props}>
        {children}
      </code>
    </pre>
  )
}

const components: Components = {
  h1: ({ node, ...props }) => <h1 className='mt-6 font-semibold text-2xl first:mt-0' {...props} />,
  h2: ({ node, ...props }) => <h2 className='mt-5 font-semibold text-xl first:mt-0' {...props} />,
  h3: ({ node, ...props }) => <h3 className='mt-4 font-semibold text-lg first:mt-0' {...props} />,
  h4: ({ node, ...props }) => <h4 className='mt-4 font-semibold text-base first:mt-0' {...props} />,
  h5: ({ node, ...props }) => <h5 className='mt-3 font-medium text-base tracking-wide first:mt-0' {...props} />,
  h6: ({ node, ...props }) => (
    <h6 className='mt-3 font-medium text-muted-foreground text-sm tracking-wide first:mt-0' {...props} />
  ),
  p: ({ node, ...props }) => <p className='mt-3 text-muted-foreground leading-relaxed first:mt-0' {...props} />,
  ul: ({ node, ...props }) => <ul className='mt-3 list-disc space-y-2 pl-6' {...props} />,
  ol: ({ node, ...props }) => <ol className='mt-3 list-decimal space-y-2 pl-6' {...props} />,
  li: ({ node, ...props }) => <li className='leading-relaxed' {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className='mt-4 border-primary/40 border-l-4 pl-4 text-muted-foreground italic' {...props} />
  ),
  a: ({ node, ...props }) => (
    <a
      className='text-primary underline decoration-primary/20 underline-offset-2 hover:decoration-primary'
      target='_blank'
      rel='noopener noreferrer'
      {...props}
    />
  ),
  table: ({ node, ...props }) => (
    <div className='mt-4 overflow-x-auto rounded-md border'>
      <table className='w-full border-collapse text-left text-sm' {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className='bg-muted/50 text-muted-foreground' {...props} />,
  tbody: ({ node, ...props }) => <tbody className='divide-y' {...props} />,
  th: ({ node, ...props }) => <th className='px-3 py-2 font-medium' {...props} />,
  td: ({ node, ...props }) => <td className='px-3 py-2 align-top' {...props} />,
  code: Code,
  hr: () => <hr className='my-6 border-border/70' />,
  img: ({ node, alt, ...props }) => (
    <figure className='mt-4 flex flex-col gap-2'>
      {/* biome-ignore lint/a11y/useAltText: <explanation> */}
      <img alt={alt ?? 'article image'} className='max-h-96 w-full rounded-md object-cover' {...props} />
      {alt ? <figcaption className='text-center text-muted-foreground text-xs'>{alt}</figcaption> : null}
    </figure>
  ),
  strong: ({ node, ...props }) => <strong className='font-semibold text-foreground' {...props} />,
  em: ({ node, ...props }) => <em className='text-muted-foreground' {...props} />,
  del: ({ node, ...props }) => <del className='text-muted-foreground' {...props} />,
  pre: ({ node, children, ...props }) => children,
}

export const MarkdownPreview = ({ markdown, className, emptyPlaceholder }: MarkdownPreviewProps) => {
  const content = markdown?.trim()

  if (!content) {
    return (
      <p className={clsx('text-center text-muted-foreground text-sm', className)}>
        {emptyPlaceholder ?? 'Nothing to preview yet.'}
      </p>
    )
  }

  return (
    <div className={clsx('prose prose-sm dark:prose-invert max-w-none', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
