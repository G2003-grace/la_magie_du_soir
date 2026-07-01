import { Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import APropos from './pages/APropos';
import Programme from './pages/Programme';
import Billetterie from './pages/Billetterie';
import BilletterieConfirmation from './pages/BilletterieConfirmation';
import Presse from './pages/Presse';
import Contact from './pages/Contact';
import Galerie from './pages/Galerie';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBilletterie from './pages/admin/Billetterie';
import AdminScan from './pages/admin/Scan';
import AdminCms from './pages/admin/Cms';
import AdminConfig from './pages/admin/Config';
import NotFound from './pages/NotFound';
import MentionsLegales from './pages/legal/MentionsLegales';
import Confidentialite from './pages/legal/Confidentialite';
import Cgu from './pages/legal/Cgu';
import Cgv from './pages/legal/Cgv';
import PresseKit from './pages/PresseKit';
import ProtectedAdminRoute from './components/routing/ProtectedAdminRoute';
import { CmsProvider } from './context/CmsContext';
import { CandidatsProvider } from './context/CandidatsContext';

const App = () => {
  return (
    <CmsProvider>
      <CandidatsProvider>
      <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/a-propos" element={<APropos />} />
      <Route path="/programme" element={<Programme />} />
      <Route path="/billetterie" element={<Billetterie />} />
      <Route path="/billetterie/confirmation" element={<BilletterieConfirmation />} />
      <Route path="/presse" element={<Presse />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/galerie" element={<Galerie />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/billetterie"
        element={
          <ProtectedAdminRoute>
            <AdminBilletterie />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/scan"
        element={
          <ProtectedAdminRoute>
            <AdminScan />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/cms"
        element={
          <ProtectedAdminRoute>
            <AdminCms />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/config"
        element={
          <ProtectedAdminRoute>
            <AdminConfig />
          </ProtectedAdminRoute>
        }
      />
      <Route path="/mentions-legales" element={<MentionsLegales />} />
      <Route path="/confidentialite" element={<Confidentialite />} />
      <Route path="/cgu" element={<Cgu />} />
      <Route path="/cgv" element={<Cgv />} />
      <Route path="/presse-kit" element={<PresseKit />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
      </CandidatsProvider>
    </CmsProvider>
  );
};

export default App;
