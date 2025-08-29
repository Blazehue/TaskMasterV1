
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import TaskManagementApp from './components/TaskManagementApp'
import Dashboard from './components/Dashboard'
import Calendar from './components/Calendar'
import KanbanBoard from './components/KanbanBoard'
import ProjectGrid from './components/ProjectGrid'
import ErrorReporter from './components/ErrorReporter'
import VisualEditsMessenger from './visual-edits/VisualEditsMessenger'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <ErrorReporter />
        <Navigation />
        <Routes>
          <Route path="/" element={<TaskManagementApp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/projects" element={<ProjectGrid />} />
        </Routes>
        <VisualEditsMessenger />
      </div>
    </Router>
  )
}

export default App
