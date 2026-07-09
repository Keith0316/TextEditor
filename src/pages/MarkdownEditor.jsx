import { useState, useEffect, useMemo, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useLayout } from '../components/DarkContext'

const STORAGE_KEY = 'markdown-editor-content'

const SAMPLE = `# Markdown 编辑器

一个支持实时预览的 Markdown 编辑工具，专为写作而生。

## 功能亮点

- **实时预览** — 左侧书写，右侧即时渲染
- **语法高亮** — 代码块自动着色
- **快捷操作** — 工具栏一键插入格式
- **多种导出** — 支持 .md / HTML / PDF

## 快速语法示例

### 文本格式

这是 **加粗文本**，这是 *斜体文本*，这是 ~~删除线~~。

行内代码用反引号包裹：\`const x = 1\`

### 链接与图片

[访问 GitHub](https://github.com) · [MDN 文档](https://developer.mozilla.org)

### 代码块

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

### 引用

> 简单是终极的复杂。
>
> — Leonardo da Vinci

### 表格

| 语法 | 说明 | 示例 |
|------|------|------|
| \`#\` | 标题 | \`# H1\` |
| \`**\` | 加粗 | \`**text**\` |
| \`-\` | 列表 | \`- item\` |
| \`>\` | 引用 | \`> quote\` |

### 任务列表

- [x] 完成文档框架
- [x] 添加代码高亮
- [ ] 支持数学公式
- [ ] 添加目录导航

---

*使用上方工具栏快速插入格式，或直接编写 Markdown 语法。*
`

export default function MarkdownEditor() {
  const { dark } = useLayout()
  const [text, setText] = useState(SAMPLE)
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) setText(s)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, text)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 500)
    return () => clearTimeout(timer)
  }, [text])

  const stats = useMemo(() => {
    const chars = text.length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const readTime = Math.max(1, Math.ceil(words / 200))
    return { chars, words, readTime }
  }, [text])

  const insertText = (before, after = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = text.substring(start, end)
    const newText = text.substring(0, start) + before + selected + after + text.substring(end)
    setText(newText)
    setTimeout(() => { ta.focus(); ta.selectionStart = start + before.length; ta.selectionEnd = end + before.length }, 0)
  }
  const insertLineStart = (prefix) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const lineStart = text.lastIndexOf('\n', start - 1) + 1
    setText(text.substring(0, lineStart) + prefix + text.substring(lineStart))
    setTimeout(() => ta.focus(), 0)
  }

  const clearAll = () => { if (confirm('确定清空？')) setText('') }
  const downloadMD = () => {
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'document.md'; a.click(); URL.revokeObjectURL(url)
  }
  const downloadHTML = () => {
    const previewEl = document.querySelector('.markdown-preview')
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{max-width:720px;margin:40px auto;padding:20px;font-family:-apple-system,system-ui,sans-serif;line-height:1.8;color:#1d1d1f}h1{font-size:2em}h2{font-size:1.5em}code{background:#f5f5f7;padding:2px 6px;border-radius:4px}pre{background:#1d1d1f;color:#f5f5f7;padding:1em;border-radius:12px;overflow-x:auto}blockquote{border-left:3px solid #007aff;padding-left:1em;color:#666}table{border-collapse:collapse;width:100%}th,td{border:1px solid #e5e5ea;padding:8px 12px}th{background:#f5f5f7}</style></head><body>${previewEl?.innerHTML || ''}</body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'document.html'; a.click(); URL.revokeObjectURL(url)
  }

  const btnCls = `w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Markdown 编辑器</h1>
          <p className={`text-sm mt-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>实时预览的双栏写作工具</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearAll} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>清空</button>
          <button onClick={() => setText(SAMPLE)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>重置示例</button>
          <button onClick={downloadMD} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>下载 .md</button>
          <button onClick={downloadHTML} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors">导出 HTML</button>
        </div>
      </div>

      {/* Editor Container */}
      <div className={`rounded-2xl border overflow-hidden ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        
        {/* Toolbar */}
        <div className={`flex items-center gap-0.5 px-3 py-2 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <button onClick={() => insertLineStart('# ')} className={btnCls} title="H1"><span className="text-xs font-bold">H1</span></button>
          <button onClick={() => insertLineStart('## ')} className={btnCls} title="H2"><span className="text-xs font-bold">H2</span></button>
          <button onClick={() => insertLineStart('### ')} className={btnCls} title="H3"><span className="text-xs font-bold">H3</span></button>
          <div className={`w-px h-5 mx-1 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />
          <button onClick={() => insertText('**', '**')} className={btnCls} title="加粗"><strong>B</strong></button>
          <button onClick={() => insertText('*', '*')} className={btnCls} title="斜体"><em>I</em></button>
          <button onClick={() => insertText('~~', '~~')} className={btnCls} title="删除线"><s>S</s></button>
          <button onClick={() => insertText('`', '`')} className={btnCls} title="代码"><span className="font-mono text-xs">{`<>`}</span></button>
          <div className={`w-px h-5 mx-1 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />
          <button onClick={() => insertLineStart('- ')} className={btnCls} title="列表">•</button>
          <button onClick={() => insertLineStart('1. ')} className={btnCls} title="有序列表">1.</button>
          <button onClick={() => insertLineStart('- [ ] ')} className={btnCls} title="任务">☐</button>
          <button onClick={() => insertLineStart('> ')} className={btnCls} title="引用">"</button>
          <div className={`w-px h-5 mx-1 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />
          <button onClick={() => insertText('[', '](url)')} className={btnCls} title="链接">🔗</button>
          <button onClick={() => insertText('![', '](url)')} className={btnCls} title="图片">🖼</button>
          <button onClick={() => insertText('\n```\n', '\n```\n')} className={btnCls} title="代码块">{'{ }'}</button>
          <button onClick={() => insertLineStart('---\n')} className={btnCls} title="分割线">—</button>
          
          <div className="flex-1" />
          {saved && <span className="text-[11px] text-green-500 mr-2">✓ 已保存</span>}
          <span className={`text-[11px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            {stats.words} 词 · {stats.chars} 字符 · ~{stats.readTime}min
          </span>
        </div>

        {/* Dual Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Editor */}
          <div className={`relative ${dark ? '' : 'border-r border-gray-100'} lg:border-r ${dark ? 'lg:border-gray-800' : ''}`}>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入 Markdown..."
              className={`w-full h-[560px] px-6 py-5 font-mono text-[13px] leading-relaxed resize-none outline-none ${
                dark ? 'bg-gray-900 text-gray-300 placeholder-gray-700' : 'bg-white text-gray-700 placeholder-gray-300'
              }`}
              spellCheck={false}
            />
          </div>
          {/* Preview */}
          <div className={`h-[560px] overflow-y-auto markdown-preview ${dark ? 'bg-gray-950/50 text-gray-200' : 'bg-gray-50/50 text-gray-800'}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {text}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className={`mt-10 p-6 rounded-2xl ${dark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <h3 className={`text-sm font-semibold mb-4 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>语法速查</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { syntax: '# 标题', desc: '一级标题' },
            { syntax: '**粗体**', desc: '加粗文字' },
            { syntax: '*斜体*', desc: '倾斜文字' },
            { syntax: '`code`', desc: '行内代码' },
            { syntax: '- item', desc: '无序列表' },
            { syntax: '1. item', desc: '有序列表' },
            { syntax: '> text', desc: '引用' },
            { syntax: '[text](url)', desc: '链接' },
            { syntax: '```lang', desc: '代码块' },
            { syntax: '---', desc: '分割线' },
            { syntax: '| a | b |', desc: '表格' },
            { syntax: '- [ ] todo', desc: '任务列表' },
          ].map((item) => (
            <div key={item.syntax} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${dark ? 'bg-gray-800/50' : 'bg-white'}`}>
              <code className={`text-[11px] font-mono ${dark ? 'text-brand-400' : 'text-brand-600'}`}>{item.syntax}</code>
              <span className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
