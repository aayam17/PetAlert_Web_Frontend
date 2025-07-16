import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CommunityBoardPage from "../pages/CommunityBoardPage";
import AboutUs from '../components/AboutUs';   
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import AdminDashboard from '../pages/AdminDashboard';

// Import service pages
import VetAppointments from '../pages/VetAppointmentsPage';
import VaccinationRecords from '../pages/VaccinationRecordsPage';
import LostAndFound from '../pages/LostAndFoundPage';
import Memorial from '../pages/MemorialPage';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/community-board" element={<CommunityBoardPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<AdminDashboard />} />
      
      {/* New service pages */}
      <Route path="/vet-appointments" element={<VetAppointments />} />
      <Route path="/vaccination-records" element={<VaccinationRecords />} />
      <Route path="/lost-and-found" element={<LostAndFound />} />
      <Route path="/memorial" element={<Memorial />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;