import { Link } from 'react-router-dom'
import { useLayout } from '../components/DarkContext'

export default function Home() {
  const { dark } = useLayout()

  const editors = [
    {
      path: '/plain',
      title: '纯文本编辑器',
      desc: '无干扰的纯净写作空间，内置字数统计和文本处理工具。',
      gradient: 'from-blue-500 to-blue-600',
      icon: '📝',
    },
    {
      path: '/rich',
      title: '富文本编辑器',
      desc: '可视化文档排版，支持多媒体内容和一键导出。',
      gradient: 'from-violet-500 to-purple-600',
      icon: '📄',
    },
    {
      path: '/markdown',
      title: 'Markdown 编辑器',
      desc: '实时渲染的双栏编辑器，让技术写作更加高效。',
      gradient: 'from-emerald-500 to-teal-600',
      icon: '✍️',
    },
    {
      path: '/code',
      title: '代码编辑器',
      desc: '支持实时预览的代码工作台，所写即所见。',
      gradient: 'from-orange-500 to-red-500',
      icon: '💻',
    },
  ]

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Hero */}
      <section className="text-center py-16 md:py-24">
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
          在线文本编辑器
        </h1>
        <p className={`text-lg md:text-xl max-w-xl mx-auto leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          轻量、快速、注重隐私的文本处理工具集。<br />
          打开浏览器，即刻开始创作。
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <span className={`inline-flex items-center gap-1.5 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            数据不离开浏览器
          </span>
          <span className={`inline-flex items-center gap-1.5 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            免登录即用
          </span>
          <span className={`inline-flex items-center gap-1.5 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            自动保存
          </span>
        </div>
      </section>

      {/* Editor Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-24">
        {editors.map((editor, i) => (
          <Link
            key={editor.path}
            to={editor.path}
            className={`group relative p-6 rounded-2xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              dark
                ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="text-3xl mb-4">{editor.icon}</div>
            <h3 className={`text-lg font-semibold mb-1.5 ${dark ? 'text-white' : 'text-gray-900'}`}>
              {editor.title}
            </h3>
            <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {editor.desc}
            </p>
            <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity`}>
              打开
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </Link>
        ))}
      </section>

      {/* Features */}
      <section className="mb-20">
        <h2 className={`text-2xl font-bold text-center mb-10 ${dark ? 'text-white' : 'text-gray-900'}`}>
          简单好用的秘诀
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🔒', title: '隐私安全', desc: '所有计算在浏览器完成，文本不经过任何服务器，绝不泄露。' },
            { icon: '⚡', title: '开箱即用', desc: '无需注册和下载，打开网页直接使用，零学习成本。' },
            { icon: '🧰', title: '工具齐全', desc: '字数统计、格式转换、代码高亮，满足日常编辑的全部需求。' },
          ].map((f, i) => (
            <div key={i} className={`text-center p-6 rounded-2xl ${dark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className={`font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
              <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
