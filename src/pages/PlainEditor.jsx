import { useState, useEffect, useRef, useMemo } from 'react'
import { useLayout } from '../components/DarkContext'

const STORAGE_KEY = 'plain-editor-content'

export default function PlainEditor() {
  const { dark } = useLayout()
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(15)
  const [showTools, setShowTools] = useState(false)
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setText(saved)
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
    const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim()).length : 0
    const bytes = new Blob([text]).size
    const readTime = Math.max(1, Math.ceil(words / 200))
    const lines = text ? text.split('\n').length : 0
    return { chars, words, paragraphs, bytes, readTime, lines }
  }, [text])

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Tool actions
  const removeEmptyLines = () => setText(text.split('\n').filter(line => line.trim()).join('\n'))
  const trimLines = () => setText(text.split('\n').map(line => line.trim()).join('\n'))
  const sortLines = () => setText(text.split('\n').sort((a, b) => a.localeCompare(b)).join('\n'))
  const formatJSON = () => { try { setText(JSON.stringify(JSON.parse(text), null, 2)) } catch { alert('无效的 JSON') } }
  const deduplicate = () => setText([...new Set(text.split('\n'))].join('\n'))
  const toUpperCase = () => setText(text.toUpperCase())
  const toLowerCase = () => setText(text.toLowerCase())
  const clearAll = () => { if (confirm('确定清空？')) setText('') }
  const copyText = () => navigator.clipboard.writeText(text)
  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const toolGroups = [
    { label: '移除空行', action: removeEmptyLines },
    { label: '去首尾空格', action: trimLines },
    { label: '排序 A-Z', action: sortLines },
    { label: '格式化 JSON', action: formatJSON },
    { label: '去重', action: deduplicate },
  ]

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>纯文本编辑器</h1>
        <p className={`text-sm mt-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
          专注于内容本身的极简编辑空间
        </p>
      </div>

      {/* Editor Card */}
      <div className={`rounded-2xl border overflow-hidden ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        
        {/* Status Bar - Font & Quick Actions */}
        <div className={`flex items-center justify-between px-4 py-2.5 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-1">
            {/* Font Size Controls */}
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
              title="缩小字体"
            >
              A<span className="text-[10px]">-</span>
            </button>
            <span className={`text-xs font-mono px-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
              title="放大字体"
            >
              A<span className="text-[10px]">+</span>
            </button>

            <div className={`w-px h-4 mx-2 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />

            {/* Case toggle */}
            <button onClick={toUpperCase} className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`} title="全部大写">
              AA
            </button>
            <button onClick={toLowerCase} className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`} title="全部小写">
              aa
            </button>
            <button onClick={() => setText(text.replace(/\b\w/g, c => c.toUpperCase()))} className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`} title="首字母大写">
              Aa
            </button>

            <div className={`w-px h-4 mx-2 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />

            {/* Advanced tools toggle */}
            <button
              onClick={() => setShowTools(!showTools)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                showTools
                  ? 'bg-brand-500 text-white'
                  : dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              高级工具
            </button>
          </div>

          <div className="flex items-center gap-2">
            {saved && <span className="text-[11px] text-green-500">✓ 已保存</span>}
            <button onClick={copyText} className={`px-2 py-1 rounded-md text-xs transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>复制</button>
            <button onClick={downloadText} className={`px-2 py-1 rounded-md text-xs transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>下载</button>
            <button onClick={clearAll} className="px-2 py-1 rounded-md text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">清空</button>
          </div>
        </div>

        {/* Advanced Tools Panel */}
        {showTools && (
          <div className={`flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-b ${dark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
            {toolGroups.map((tool) => (
              <button
                key={tool.label}
                onClick={tool.action}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-600 border border-gray-200'
                }`}
              >
                {tool.label}
              </button>
            ))}
          </div>
        )}

        {/* File tab */}
        <div className={`flex items-center gap-2 px-4 py-1.5 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
          </div>
          <span className={`text-[11px] ml-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>document.txt</span>
          <div className="flex-1" />
          <span className={`text-[11px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>UTF-8</span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="开始输入..."
          style={{ fontSize: `${fontSize}px` }}
          className={`w-full h-[420px] px-6 py-5 font-mono leading-relaxed resize-none outline-none transition-colors ${
            dark ? 'bg-gray-900 text-gray-200 placeholder-gray-700' : 'bg-white text-gray-800 placeholder-gray-300'
          }`}
          spellCheck={false}
        />

        {/* Bottom Stats Bar */}
        <div className={`flex items-center justify-between px-4 py-2 border-t text-[11px] ${dark ? 'border-gray-800 text-gray-600' : 'border-gray-100 text-gray-400'}`}>
          <div className="flex items-center gap-4">
            <span>{stats.chars} 字符</span>
            <span>{stats.words} 词</span>
            <span>{stats.lines} 行</span>
            <span>{stats.paragraphs} 段落</span>
          </div>
          <div className="flex items-center gap-4">
            <span>~{stats.readTime} 分钟阅读</span>
            <span>{formatBytes(stats.bytes)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
