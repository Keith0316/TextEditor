import { useState, useRef, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { useLayout } from '../components/DarkContext'

const LANGUAGES = [
  { id: 'html', label: 'HTML', ext: 'html' },
  { id: 'javascript', label: 'JavaScript', ext: 'js' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts' },
  { id: 'python', label: 'Python', ext: 'py' },
  { id: 'css', label: 'CSS', ext: 'css' },
  { id: 'json', label: 'JSON', ext: 'json' },
  { id: 'java', label: 'Java', ext: 'java' },
  { id: 'go', label: 'Go', ext: 'go' },
  { id: 'rust', label: 'Rust', ext: 'rs' },
  { id: 'sql', label: 'SQL', ext: 'sql' },
  { id: 'markdown', label: 'Markdown', ext: 'md' },
  { id: 'yaml', label: 'YAML', ext: 'yaml' },
]

const SAMPLES = {
  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #1d1d1f; margin: 0 0 12px; font-size: 24px; }
    p { color: #666; line-height: 1.6; margin: 0 0 20px; }
    .btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .btn:hover { transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, World! 👋</h1>
    <p>这是一个实时预览示例。<br>修改上方代码，下方即时更新。</p>
    <button class="btn" onclick="alert('Hello!')">点击我</button>
  </div>
</body>
</html>`,
  javascript: `// JavaScript 实时运行示例
// console.log 的输出会显示在下方预览区

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("📊 Fibonacci 数列 (前 10 项)");
console.log("─".repeat(30));

for (let i = 0; i < 10; i++) {
  console.log(\`  fib(\${i}) = \${fibonacci(i)}\`);
}

console.log("");
console.log("✅ 运行完成！");
console.log("💡 试试修改代码，点击运行查看结果");`,
  css: `/* CSS 样式预览 */
body {
  margin: 0;
  padding: 40px;
  font-family: -apple-system, sans-serif;
  background: #f5f5f7;
}

.demo-box {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  border-radius: 24px;
  margin: 20px auto;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

h3 {
  text-align: center;
  color: #1d1d1f;
}`,
  json: `{
  "name": "在线文本编辑器",
  "version": "1.0.0",
  "description": "轻量、快速、注重隐私的文本处理工具集",
  "features": [
    "纯文本编辑器",
    "富文本编辑器",
    "Markdown 编辑器",
    "代码编辑器"
  ],
  "tech": {
    "framework": "React 18",
    "bundler": "Vite 5",
    "editor": "Monaco Editor",
    "styling": "Tailwind CSS"
  }
}`,
}

export default function CodeEditor() {
  const { dark } = useLayout()
  const [language, setLanguage] = useState('html')
  const [code, setCode] = useState(SAMPLES.html)
  const [previewKey, setPreviewKey] = useState(0)
  const [splitRatio, setSplitRatio] = useState(50) // percentage for code area
  const editorRef = useRef(null)
  const iframeRef = useRef(null)

  const handleLanguageChange = (langId) => {
    setLanguage(langId)
    const sample = SAMPLES[langId] || `// ${langId} code here`
    setCode(sample)
  }

  const handleEditorMount = (editor) => {
    editorRef.current = editor
  }

  const runCode = useCallback(() => {
    setPreviewKey(k => k + 1)
  }, [])

  const getPreviewContent = () => {
    if (language === 'html') {
      return code
    } else if (language === 'javascript') {
      // 创建一个带有控制台模拟的环境
      return `<html><head><style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'SF Mono', 'JetBrains Mono', monospace; font-size: 13px; background: #1e1e2e; color: #cdd6f4; padding: 16px; line-height: 1.6; }
        .log-line { padding: 4px 8px; border-bottom: 1px solid #313244; display: flex; align-items: baseline; gap: 8px; }
        .log-line:hover { background: #313244; }
        .log-prefix { color: #89b4fa; font-size: 11px; opacity: 0.6; min-width: 20px; }
        .log-content { color: #cdd6f4; }
        .error-line { background: #45243e; border-bottom-color: #f38ba8; }
        .error-line .log-content { color: #f38ba8; }
        .header { padding: 8px 12px; margin-bottom: 8px; border-bottom: 1px solid #313244; color: #6c7086; font-size: 11px; display: flex; align-items: center; gap: 6px; }
        .header::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #a6e3a1; }
      </style></head><body>
      <div class="header">Console Output</div>
      <div id="output"></div>
      <script>
        const output = document.getElementById('output');
        let lineNum = 0;
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        function addLine(text, type) {
          lineNum++;
          const div = document.createElement('div');
          div.className = 'log-line' + (type === 'error' ? ' error-line' : '');
          div.innerHTML = '<span class="log-prefix">' + lineNum + '</span><span class="log-content">' + String(text).replace(/</g,'&lt;') + '</span>';
          output.appendChild(div);
        }
        console.log = (...args) => { addLine(args.join(' '), 'log'); };
        console.error = (...args) => { addLine(args.join(' '), 'error'); };
        console.warn = (...args) => { addLine('⚠️ ' + args.join(' '), 'warn'); };
        try {
          ${code}
        } catch(e) {
          addLine('❌ Error: ' + e.message, 'error');
        }
      <\/script></body></html>`
    } else if (language === 'css') {
      return `<html><head><style>body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,sans-serif}${code}</style></head><body><div class="demo-box"></div><h3 style="margin-top:20px;color:#1d1d1f;font-size:14px">CSS Live Preview</h3><p style="color:#999;font-size:12px;margin-top:4px">修改代码即时生效</p></body></html>`
    } else if (language === 'json') {
      try {
        const parsed = JSON.parse(code)
        const formatted = JSON.stringify(parsed, null, 2)
        // Syntax highlight JSON
        const highlighted = formatted
          .replace(/&/g, '&amp;').replace(/</g, '&lt;')
          .replace(/("[^"]+")\s*:/g, '<span style="color:#89b4fa">$1</span>:')
          .replace(/:\s*("[^"]*")/g, ': <span style="color:#a6e3a1">$1</span>')
          .replace(/:\s*(\d+)/g, ': <span style="color:#fab387">$1</span>')
          .replace(/:\s*(true|false|null)/g, ': <span style="color:#cba6f7">$1</span>')
        return `<html><head><style>body{font-family:'SF Mono','JetBrains Mono',monospace;padding:20px;margin:0;background:#1e1e2e;color:#cdd6f4}pre{white-space:pre-wrap;font-size:13px;line-height:1.7}.header{color:#6c7086;font-size:11px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #313244}</style></head><body><div class="header">JSON · ${Object.keys(parsed).length} keys · Valid ✓</div><pre>${highlighted}</pre></body></html>`
      } catch (e) {
        return `<html><head><style>body{font-family:-apple-system,sans-serif;padding:20px;margin:0;background:#1e1e2e;color:#f38ba8}.icon{font-size:32px;margin-bottom:12px}p{font-size:13px;opacity:0.8;margin-top:8px}</style></head><body><div class="icon">⚠️</div><strong>JSON 解析错误</strong><p>${e.message}</p></body></html>`
      }
    }
    // 非可预览语言：显示代码高亮
    return `<html><head><style>body{font-family:'SF Mono',monospace;padding:20px;margin:0;background:#1e1e2e;color:#cdd6f4;font-size:13px;line-height:1.6}.header{color:#6c7086;font-size:11px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #313244}pre{white-space:pre-wrap;tab-size:2}</style></head><body><div class="header">${language.toUpperCase()} · 预览不可用 · 仅显示源代码</div><pre>${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre></body></html>`
  }

  const saveCode = () => {
    const ext = LANGUAGES.find(l => l.id === language)?.ext || 'txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `code.${ext}`; a.click(); URL.revokeObjectURL(url)
  }

  const copyCode = () => navigator.clipboard.writeText(code)
  const canPreview = ['html', 'javascript', 'css', 'json'].includes(language)

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>代码编辑器</h1>
          <p className={`text-sm mt-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>编写代码，实时查看运行效果</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyCode} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            复制
          </button>
          <button onClick={saveCode} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            下载
          </button>
          {canPreview && (
            <button onClick={runCode} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>
              运行
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className={`rounded-2xl border overflow-hidden flex flex-col ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`} style={{ height: '680px' }}>
        
        {/* Language Tabs */}
        <div className={`flex items-center gap-1 px-3 py-2 border-b overflow-x-auto ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                language === lang.id
                  ? 'bg-brand-500 text-white'
                  : dark
                  ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {lang.label}
            </button>
          ))}
          <div className="flex-1" />
          <select
            onChange={(e) => {
              const val = e.target.value
              if (editorRef.current) {
                editorRef.current.updateOptions({ fontSize: Number(val) })
              }
            }}
            defaultValue="14"
            className={`text-[11px] px-2 py-1 rounded-lg border outline-none ${dark ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
          >
            {[12, 13, 14, 15, 16, 18].map(s => <option key={s} value={s}>{s}px</option>)}
          </select>
        </div>

        {/* Code Editor Area */}
        <div style={{ height: `${splitRatio}%` }} className="relative">
          <Editor
            language={language}
            theme={dark ? 'vs-dark' : 'light'}
            value={code}
            onMount={handleEditorMount}
            onChange={(value) => {
              setCode(value || '')
              // Auto-run for HTML and CSS
              if (language === 'html' || language === 'css' || language === 'json') {
                setPreviewKey(k => k + 1)
              }
            }}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              renderLineHighlight: 'line',
              bracketPairColorization: { enabled: true },
              lineNumbers: 'on',
              folding: true,
              contextmenu: false,
            }}
          />
        </div>

        {/* Resize Handle */}
        <div className={`flex items-center justify-center h-7 border-y cursor-row-resize select-none group ${dark ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-0.5 rounded-full ${dark ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-300 group-hover:bg-gray-400'} transition-colors`} />
            <span className={`text-[10px] font-medium ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              {canPreview ? '预览' : '输出'}
            </span>
            <div className={`w-8 h-0.5 rounded-full ${dark ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-300 group-hover:bg-gray-400'} transition-colors`} />
          </div>
        </div>

        {/* Preview Area */}
        <div style={{ height: `${100 - splitRatio}%` }} className="relative overflow-hidden">
          <iframe
            ref={iframeRef}
            key={previewKey}
            srcDoc={getPreviewContent()}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-modals"
            title="代码预览"
          />
        </div>
      </div>
    </div>
  )
}
