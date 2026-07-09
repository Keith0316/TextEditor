import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { useLayout } from '../components/DarkContext'

const INITIAL_CONTENT = `
<h1>富文本编辑器使用指南</h1>
<p>欢迎使用在线富文本编辑器，这是一款专为高效文档创作设计的工具。所有内容在浏览器本地处理，您的数据安全且私密。</p>

<h2>快速上手</h2>
<p>您可以通过以下方式快速开始创作：</p>
<ul>
  <li><strong>工具栏</strong> — 点击上方按钮即可对选中文本应用格式</li>
  <li><strong>Markdown 快捷键</strong> — 输入 <code>#</code> + 空格创建标题，<code>-</code> + 空格创建列表</li>
  <li><strong>键盘快捷键</strong> — <code>Ctrl+B</code> 加粗、<code>Ctrl+I</code> 斜体、<code>Ctrl+Z</code> 撤销</li>
</ul>

<h2>丰富的格式支持</h2>
<p>编辑器支持以下内容格式：</p>
<ol>
  <li>标题（H1 - H3）与段落排版</li>
  <li><strong>加粗</strong>、<em>斜体</em>、<s>删除线</s>、<mark>高亮标记</mark></li>
  <li>有序列表、无序列表、任务清单</li>
  <li>引用块、代码块、分割线</li>
  <li>超链接、图片插入、数据表格</li>
</ol>

<blockquote><p>提示：完成编辑后，点击右上角「导出文档」即可生成带有精美排版的 HTML 文件，方便分享与打印。</p></blockquote>

<h2>开始创作</h2>
<p>选中这段文字，尝试使用工具栏中的按钮来改变格式，或者直接清空内容开始您的创作。</p>
`

const HIGHLIGHT_COLORS = [
  { color: '#fef08a', label: '黄色' },
  { color: '#bbf7d0', label: '绿色' },
  { color: '#bfdbfe', label: '蓝色' },
  { color: '#fecaca', label: '红色' },
  { color: '#e9d5ff', label: '紫色' },
  { color: '#fed7aa', label: '橙色' },
  { color: '#99f6e4', label: '青色' },
  { color: '#fce7f3', label: '粉色' },
]

export default function RichEditor() {
  const { dark } = useLayout()
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: '输入 / 开始创作，或使用工具栏格式化文本...' }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: INITIAL_CONTENT,
  })

  if (!editor) return null

  const addImage = () => {
    const url = window.prompt('输入图片 URL：')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }
  const addLink = () => {
    const url = window.prompt('输入链接 URL：')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }
  const exportHTML = () => {
    const html = editor.getHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'document.html'; a.click(); URL.revokeObjectURL(url)
  }
  const exportStyledHTML = () => {
    const html = editor.getHTML()
    const styled = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Document</title><style>body{max-width:720px;margin:40px auto;padding:20px;font-family:-apple-system,system-ui,sans-serif;line-height:1.8;color:#1d1d1f}h1{font-size:1.8em;font-weight:700}h2{font-size:1.4em;font-weight:600}h3{font-size:1.2em;font-weight:600}blockquote{border-left:3px solid #6366f1;padding-left:1em;color:#666;margin:1em 0}code{background:#f5f5f7;padding:2px 6px;border-radius:4px;font-size:.9em}pre{background:#1d1d1f;color:#f5f5f7;padding:1em;border-radius:12px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #e5e5ea;padding:8px 12px}th{background:#f5f5f7;font-weight:600}img{max-width:100%;border-radius:12px}mark{padding:1px 4px;border-radius:2px}ul,ol{padding-left:1.5em}li{margin:0.3em 0}</style></head><body>${html}</body></html>`
    const blob = new Blob([styled], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'document_styled.html'; a.click(); URL.revokeObjectURL(url)
  }

  // 使用 onMouseDown + preventDefault 防止编辑器失焦，保证单击即生效
  const Btn = ({ active, onAction, children, title }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault()
        onAction()
      }}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors select-none ${
        active
          ? 'bg-brand-500 text-white'
          : dark
          ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  )

  const Sep = () => <div className={`w-px h-5 mx-1 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>富文本编辑器</h1>
          <p className={`text-sm mt-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>所见即所得的文档编辑体验</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.commands.clearContent() }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            清空
          </button>
          <button onClick={exportHTML} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            导出 HTML
          </button>
          <button onClick={exportStyledHTML} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors">
            导出文档
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className={`rounded-2xl border overflow-hidden ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        
        {/* Toolbar */}
        <div className={`flex flex-wrap items-center gap-0.5 px-3 py-2 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          {/* Undo/Redo */}
          <Btn onAction={() => editor.chain().focus().undo().run()} title="撤销">↩</Btn>
          <Btn onAction={() => editor.chain().focus().redo().run()} title="重做">↪</Btn>
          <Sep />
          
          {/* Text Format */}
          <Btn active={editor.isActive('bold')} onAction={() => editor.chain().focus().toggleBold().run()} title="加粗 (Ctrl+B)">
            <span className="font-bold">B</span>
          </Btn>
          <Btn active={editor.isActive('italic')} onAction={() => editor.chain().focus().toggleItalic().run()} title="斜体 (Ctrl+I)">
            <span className="italic">I</span>
          </Btn>
          <Btn active={editor.isActive('strike')} onAction={() => editor.chain().focus().toggleStrike().run()} title="删除线">
            <span className="line-through">S</span>
          </Btn>
          <Btn active={editor.isActive('code')} onAction={() => editor.chain().focus().toggleCode().run()} title="行内代码">
            <span className="font-mono text-xs">{`<>`}</span>
          </Btn>

          {/* Highlight with color picker */}
          <div className="relative">
            <button
              onMouseDown={(e) => {
                e.preventDefault()
                setShowHighlightPicker(!showHighlightPicker)
              }}
              title="高亮标记（点击选颜色）"
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors select-none ${
                editor.isActive('highlight')
                  ? 'bg-brand-500 text-white'
                  : dark
                  ? 'text-gray-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="relative">
                H
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400"></span>
              </span>
            </button>
            {showHighlightPicker && (
              <div className={`absolute top-full left-0 mt-1 p-2 rounded-xl border shadow-lg z-50 grid grid-cols-4 gap-1.5 ${dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.color}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      editor.chain().focus().toggleHighlight({ color: c.color }).run()
                      setShowHighlightPicker(false)
                    }}
                    title={c.label}
                    className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.color }}
                  />
                ))}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault()
                    editor.chain().focus().unsetHighlight().run()
                    setShowHighlightPicker(false)
                  }}
                  title="清除高亮"
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs ${dark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'} hover:scale-110 transition-transform`}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <Sep />

          {/* Headings */}
          <Btn active={editor.isActive('heading', { level: 1 })} onAction={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="标题1">
            <span className="text-xs font-bold">H1</span>
          </Btn>
          <Btn active={editor.isActive('heading', { level: 2 })} onAction={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="标题2">
            <span className="text-xs font-bold">H2</span>
          </Btn>
          <Btn active={editor.isActive('heading', { level: 3 })} onAction={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="标题3">
            <span className="text-xs font-bold">H3</span>
          </Btn>
          <Sep />

          {/* Lists & Structure */}
          <Btn active={editor.isActive('bulletList')} onAction={() => editor.chain().focus().toggleBulletList().run()} title="无序列表">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="4" cy="7" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="17" r="1.5"/><path d="M9 7h11M9 12h11M9 17h11"/></svg>
          </Btn>
          <Btn active={editor.isActive('orderedList')} onAction={() => editor.chain().focus().toggleOrderedList().run()} title="有序列表">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 7h10M10 12h10M10 17h10"/><text x="3" y="9" fontSize="7" fill="currentColor">1</text><text x="3" y="14" fontSize="7" fill="currentColor">2</text><text x="3" y="19" fontSize="7" fill="currentColor">3</text></svg>
          </Btn>
          <Btn active={editor.isActive('taskList')} onAction={() => editor.chain().focus().toggleTaskList().run()} title="任务列表">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="5" height="5" rx="1"/><path d="M12 7h8M3 15l1.5 1.5L7 14M12 16h8"/></svg>
          </Btn>
          <Btn active={editor.isActive('blockquote')} onAction={() => editor.chain().focus().toggleBlockquote().run()} title="引用">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2"/><path d="M15 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2"/></svg>
          </Btn>
          <Btn active={editor.isActive('codeBlock')} onAction={() => editor.chain().focus().toggleCodeBlock().run()} title="代码块">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </Btn>
          <Sep />

          {/* Insert */}
          <Btn onAction={addLink} active={editor.isActive('link')} title="插入链接">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </Btn>
          <Btn onAction={addImage} title="插入图片">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </Btn>
          <Btn onAction={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="插入表格">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
          </Btn>
          <Btn onAction={() => editor.chain().focus().setHorizontalRule().run()} title="分割线">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18"/></svg>
          </Btn>
          <Sep />

          {/* Text Color */}
          <div className="relative">
            <input
              type="color"
              onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer"
              title="文字颜色"
            />
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <span className="text-sm relative">
                A
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded bg-red-500"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div onClick={() => showHighlightPicker && setShowHighlightPicker(false)}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
