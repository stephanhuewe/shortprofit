import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import Settings from './pages/Settings'
import AddBooking from './pages/AddBooking'
import EditBooking from './pages/EditBooking'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/add" element={<AddBooking />} />
        <Route path="bookings/:id/edit" element={<EditBooking />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
