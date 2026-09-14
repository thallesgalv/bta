import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HuntsPage } from '@/pages/HuntsPage'
import { ProjectionPage } from '@/pages/ProjectionPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HuntsPage />} />
          <Route path="projection" element={<ProjectionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
