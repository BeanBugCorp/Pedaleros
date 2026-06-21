import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GuestPage from './components/guest/GuestPage'
import AdminPage from './pages/admin/AdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
