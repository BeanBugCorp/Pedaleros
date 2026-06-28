import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GuestPage from './pages/guest/GuestPage'
import AdminPage from './pages/admin/AdminPage'
import AuctionPage from './features/auction/AuctionPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/auction" element={<AuctionPage />} />
      </Routes>
    </BrowserRouter>
  )
}
