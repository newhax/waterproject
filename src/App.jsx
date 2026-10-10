import { lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Layout from './components/layout/Layout.jsx';
import EmptyState from './components/ui/EmptyState.jsx';
import Home from './pages/Home.jsx';

// Map/chart-heavy pages are split out so the landing page loads fast on mobile data.
const Rainwater = lazy(() => import('./pages/Rainwater.jsx'));
const Reporter = lazy(() => import('./pages/Reporter.jsx'));
const Footprint = lazy(() => import('./pages/Footprint.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

function NotFound() {
  return (
    <div className="page">
      <EmptyState
        icon={Compass}
        title="This page went down the drain"
        message="We couldn't find what you were looking for."
        action={<Link to="/" className="btn-primary">Back to home</Link>}
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="rainwater" element={<Rainwater />} />
        <Route path="report" element={<Reporter />} />
        <Route path="footprint" element={<Footprint />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
