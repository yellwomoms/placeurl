import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import NaverTracker from './components/NaverTracker';
import Home from './pages/Home';
import Shorts from './pages/Shorts';
import Reference from './pages/Reference';
import ShortsReference from './pages/portfolio/ShortsReference';
import Price from './pages/Price';
import Consult from './pages/Consult';
import Admin from './pages/Admin';
import FreelancerRegister from './pages/FreelancerRegister';
import SNSPromotion from './pages/SNSPromotion';
import OnlineAds from './pages/OnlineAds';
import OutdoorAds from './pages/OutdoorAds';
import Production from './pages/Production';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <NaverTracker />
      <Toaster position="top-center" richColors />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/ads/online" element={<OnlineAds />} />
          <Route path="/ads/outdoor" element={<OutdoorAds />} />
          <Route path="/sns" element={<SNSPromotion />} />
          <Route path="/production/website" element={<Production />} />
          <Route path="/production/print" element={<Production />} />
          <Route path="/reference" element={<Reference />} />
          <Route path="/reference/shorts" element={<ShortsReference />} />
          <Route path="/price" element={<Price />} />
          <Route path="/consult" element={<Consult />} />
          <Route path="/freelancer/register" element={<FreelancerRegister />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
