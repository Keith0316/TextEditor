import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PlainEditor from './pages/PlainEditor'
import RichEditor from './pages/RichEditor'
import MarkdownEditor from './pages/MarkdownEditor'
import CodeEditor from './pages/CodeEditor'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plain" element={<PlainEditor />} />
        <Route path="/rich" element={<RichEditor />} />
        <Route path="/markdown" element={<MarkdownEditor />} />
        <Route path="/code" element={<CodeEditor />} />
      </Routes>
    </Layout>
  )
}
