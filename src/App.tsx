import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Pricing from './pages/Pricing';
import Team from './pages/Team';
import TeamMember from './pages/TeamMember';
import About from './pages/About';
import Contact from './pages/Contact';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="team" element={<Team />} />
        <Route path="team/:slug" element={<TeamMember />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
