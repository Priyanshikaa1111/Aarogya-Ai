import Sidebar from './Sidebar.jsx'
import LanguageSelector from './LanguageSelector.jsx'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-5 md:p-10 max-w-5xl mx-auto w-full animate-fadeUp">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        {children}
      </main>
    </div>
  )
}
