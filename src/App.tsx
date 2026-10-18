import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Pricing from './pages/Pricing';
import Team from './pages/Team';
import TeamMember from './pages/TeamMember';
import About from './pages/About';
import Contact from './pages/Contact';
import LegalPage from './pages/Legal';

// The playground carries the analytics engine; load it when someone asks for it.
const Analytics = lazy(() => import('./pages/Analytics'));

function Loading() {
  return (
    <section className="shell py-32">
      <p className="mono text-sm text-[var(--color-muted)]">loading analytics engine…</p>
    </section>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route
          path="analytics"
          element={
            <Suspense fallback={<Loading />}>
              <Analytics />
            </Suspense>
          }
        />
        <Route path="pricing" element={<Pricing />} />
        <Route path="team" element={<Team />} />
        <Route path="team/:slug" element={<TeamMember />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<LegalPage kind="privacy" />} />
        <Route path="terms" element={<LegalPage kind="terms" />} />
        <Route path="disclaimer" element={<LegalPage kind="disclaimer" />} />
      </Route>
    </Routes>
  );
}

export default App;