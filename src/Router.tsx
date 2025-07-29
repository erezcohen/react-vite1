import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/app-layout';
import Dashboard from './pages/Dashboard';
import Sample from './pages/Sample';

export default function Router() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="" element={<Dashboard />} />
        <Route path="sample" element={<Sample />} />
      </Route>
    </Routes>
  );
}
