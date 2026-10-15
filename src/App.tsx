import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ComparePage } from '@/pages/ComparePage'
import { HuntsPage } from '@/pages/HuntsPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HuntsPage />} />
          <Route path="compare" element={<ComparePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
