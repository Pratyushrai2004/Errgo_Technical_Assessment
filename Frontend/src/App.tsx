import { Outlet } from 'react-router-dom'
import TopNavbar from './components/TopNavbar'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Chat from './pages/Chat'

export default function App() {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true)
  const [chatVisible, setChatVisible] = useState<boolean>(false)

  const toggleSidebar = (): void => {
    setSidebarVisible(v => !v)
  }
  const toggleChat = (): void => {
    setChatVisible(v => !v)
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <TopNavbar toggleSidebar={toggleSidebar} toggleChat={toggleChat} />
      <div className="flex flex-1 overflow-hidden">
        <div className={`transition-all duration-300 ${sidebarVisible ? 'w-64' : 'w-0'} flex-shrink-0 overflow-hidden`}>
          <Sidebar visible={sidebarVisible} />
        </div>
        <Outlet />
        {chatVisible && (
          <div className="fixed inset-0 bg-white z-50 p-4">
            <Chat />
          </div>
        )}
      </div>
    </div>
  )
}
