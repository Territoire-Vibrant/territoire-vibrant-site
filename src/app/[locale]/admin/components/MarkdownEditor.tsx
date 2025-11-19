'use client'

import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { type Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clsx from 'clsx'
import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { Markdown } from 'tiptap-markdown'

import {
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  CodeSimpleIcon,
  LinkSimpleIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  QuotesIcon,
  TextBIcon,
  TextHFiveIcon,
  TextHFourIcon,
  TextHOneIcon,
  TextHSixIcon,
  TextHThreeIcon,
  TextHTwoIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
} from '@phosphor-icons/react/dist/ssr'

type MarkdownEditorProps = {
  id?: string
  value: string
  onChangeAction: (markdown: string) => void
  onBlurAction?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
  height?: number
}

const toolbarButtonBase =
  'inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-sm transition-colors'

const toolbarButtonStyles = {
  default: 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  active: 'bg-primary/15 text-primary border-primary/40 hover:bg-primary/20',
  disabled: 'opacity-50 cursor-not-allowed hover:bg-muted hover:text-muted-foreground',
}

type ToolbarButtonProps = {
  icon: ReactElement
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
}

const ToolbarButton = ({ icon, onClick, active, disabled, label }: ToolbarButtonProps) => (
  <button
    type='button'
    className={clsx(
      toolbarButtonBase,
      disabled && toolbarButtonStyles.disabled,
      !disabled && active ? toolbarButtonStyles.active : toolbarButtonStyles.default
    )}
    onClick={onClick}
    aria-label={label}
    title={label}
    disabled={disabled}
  >
    {icon}
  </button>
)

type MarkdownStorage = {
  getMarkdown: () => string
  setMarkdown?: (markdown: string) => void
}

const getMarkdownStorage = (editor: Editor | null): MarkdownStorage | null => {
  if (!editor) {
    return null
  }
  const storage = (editor.storage as unknown as { markdown?: MarkdownStorage }).markdown
  if (!storage || typeof storage.getMarkdown !== 'function') {
    return null
  }
  return storage
}

export const MarkdownEditor = ({
  id,
  value,
  onChangeAction,
  onBlurAction,
  placeholder,
  disabled = false,
  className,
  height = 300,
}: MarkdownEditorProps) => {
  const lastMarkdown = useRef(value ?? '')
  const [selectionEmpty, setSelectionEmpty] = useState(true)

  const extensions = useMemo(
    () => [
      Markdown.configure({
        html: false,
        tightLists: true,
        bulletListMarker: '-',
        transformPastedText: true,
        transformCopiedText: true,
      }),
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Link.configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//i.test(href) || href.startsWith('mailto:'),
      }),
      Placeholder.configure({
        placeholder: placeholder ?? '',
      }),
    ],
    [placeholder]
  )

  const editor = useEditor({
    editable: !disabled,
    extensions,
    content: value ?? '',
    parseOptions: { preserveWhitespace: 'full' },
    immediatelyRender: false,
    onCreate: ({ editor: instance }) => {
      const storage = getMarkdownStorage(instance)
      lastMarkdown.current = storage?.getMarkdown() ?? ''
    },
    onUpdate: ({ editor: instance }) => {
      const storage = getMarkdownStorage(instance)
      const markdown = storage?.getMarkdown() ?? ''
      if (markdown === lastMarkdown.current) {
        return
      }
      lastMarkdown.current = markdown
      onChangeAction(markdown)
    },
    editorProps: {
      attributes: {
        class: clsx(
          'bg-background',
          'border',
          'border-t-0',
          'focus:outline-none',
          'h-full',
          'max-w-none',
          'min-h-[200px]',
          'prose',
          'prose-sm',
          'px-3',
          'py-2',
          'rounded-b-md',
          'selection:bg-primary/20',
          'selection:text-foreground',
          'text-justify',
          'w-full',
          disabled && ['pointer-events-none', 'opacity-75']
        ),
      },
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }
    const storage = getMarkdownStorage(editor)
    const current = storage?.getMarkdown() ?? ''
    if (value === current) {
      return
    }
    lastMarkdown.current = value ?? ''
    if (storage?.setMarkdown) {
      storage.setMarkdown(value ?? '')
      return
    }
    editor.commands.setContent(value ?? '')
  }, [editor, value])

  useEffect(() => {
    if (!editor) {
      return
    }
    editor.setEditable(!disabled)
  }, [editor, disabled])

  useEffect(() => {
    if (!editor) {
      return
    }

    const handleSelectionChange = () => {
      setSelectionEmpty(editor.state.selection.empty)
    }

    handleSelectionChange()
    editor.on('selectionUpdate', handleSelectionChange)
    editor.on('transaction', handleSelectionChange)

    return () => {
      editor.off('selectionUpdate', handleSelectionChange)
      editor.off('transaction', handleSelectionChange)
    }
  }, [editor])

  const setHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (!editor) {
      return
    }
    const chain = editor.chain().focus()
    if (editor.isActive('heading', { level })) {
      chain.setParagraph().run()
    } else {
      chain.toggleHeading({ level }).run()
    }
  }

  const promptForLink = () => {
    if (!editor || editor.state.selection.empty) {
      return
    }
    const previous = editor.getAttributes('link').href
    const url = window.prompt('Enter URL', previous ?? 'https://')
    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  if (!editor) {
    return (
      <div className={clsx('rounded-md border bg-muted/50 p-4 text-muted-foreground text-sm', className)}>
        Loading editor…
      </div>
    )
  }

  const hasSelection = !selectionEmpty
  const controlsDisabled = disabled || !editor.isEditable

  return (
    <div className={clsx('flex h-full flex-col rounded-md', className)}>
      <div className='flex flex-wrap items-center gap-1 border-b bg-muted/60 px-2 py-1.5'>
        <ToolbarButton
          icon={<TextBIcon className='size-4' />}
          label='Bold'
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<TextItalicIcon className='size-4' />}
          label='Italic'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<TextStrikethroughIcon className='size-4' />}
          label='Strikethrough'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          disabled={controlsDisabled}
        />

        <div className='mx-1 h-6 w-px bg-border' />

        <ToolbarButton
          icon={<TextHOneIcon className='size-4' />}
          label='Heading 1'
          onClick={() => setHeading(1)}
          active={editor.isActive('heading', { level: 1 })}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<TextHTwoIcon className='size-4' />}
          label='Heading 2'
          onClick={() => setHeading(2)}
          active={editor.isActive('heading', { level: 2 })}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<TextHThreeIcon className='size-4' />}
          label='Heading 3'
          onClick={() => setHeading(3)}
          active={editor.isActive('heading', { level: 3 })}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<TextHFourIcon className='size-4' />}
          label='Heading 4'
          onClick={() => setHeading(4)}
          active={editor.isActive('heading', { level: 4 })}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<TextHFiveIcon className='size-4' />}
          label='Heading 5'
          onClick={() => setHeading(5)}
          active={editor.isActive('heading', { level: 5 })}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<TextHSixIcon className='size-4' />}
          label='Heading 6'
          onClick={() => setHeading(6)}
          active={editor.isActive('heading', { level: 6 })}
          disabled={controlsDisabled}
        />

        <div className='mx-1 h-6 w-px bg-border' />

        <ToolbarButton
          icon={<ListBulletsIcon className='size-4' />}
          label='Bullet list'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<ListNumbersIcon className='size-4' />}
          label='Numbered list'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<QuotesIcon className='size-4' />}
          label='Blockquote'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<CodeSimpleIcon className='size-4' />}
          label='Code block'
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          disabled={controlsDisabled}
        />
        <ToolbarButton
          icon={<LinkSimpleIcon className='size-4' />}
          label='Insert link'
          onClick={promptForLink}
          active={editor.isActive('link')}
          disabled={controlsDisabled || !hasSelection}
        />

        <div className='mx-1 h-6 w-px bg-border' />

        <ToolbarButton
          icon={<ArrowUUpLeftIcon className='size-4' />}
          label='Undo'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run() || controlsDisabled}
        />
        <ToolbarButton
          icon={<ArrowUUpRightIcon className='size-4' />}
          label='Redo'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run() || controlsDisabled}
        />
      </div>

      <div style={{ minHeight: `${height}px` }}>
        <EditorContent id={id} editor={editor} onBlur={onBlurAction} className='h-full min-h-[inherit] text-justify' />
      </div>
    </div>
  )
}
