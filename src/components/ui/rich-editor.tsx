'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { useCallback } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Palette
} from 'lucide-react'

interface RichEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border-b border-gray-700 p-3 flex flex-wrap gap-2 bg-gray-800">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('bold') ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Bold"
      >
        <Bold size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('italic') ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Italic"
      >
        <Italic size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('strike') ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('code') ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Code"
      >
        <Code size={16} />
      </button>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </button>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('bulletList') ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Bullet List"
      >
        <List size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('orderedList') ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('blockquote') ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Quote"
      >
        <Quote size={16} />
      </button>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      <button
        onClick={setLink}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('link') ? 'bg-primary text-white' : 'text-gray-300'
        }`}
        title="Link"
      >
        <LinkIcon size={16} />
      </button>

      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
        title="Image"
      >
        <ImageIcon size={16} />
      </button>

      <div className="w-px h-6 bg-gray-600 mx-1" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Undo"
      >
        <Undo size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Redo"
      >
        <Redo size={16} />
      </button>
    </div>
  )
}

export default function RichEditor({ content, onChange, placeholder = "Start writing...", className = "" }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-4 min-h-[200px] focus:outline-none',
      },
    },
  })

  return (
    <div className={`border border-gray-700 rounded-lg overflow-hidden bg-gray-900 ${className}`}>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[200px]"
        placeholder={placeholder}
      />
    </div>
  )
}
