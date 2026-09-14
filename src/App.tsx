import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HuntsPage } from '@/pages/HuntsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HuntsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
