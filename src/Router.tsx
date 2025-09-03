import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/app-layout';
import Sample from './pages/Sample';
import DataCenters from './pages/DataCenters';

export default function Router() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="" element={<DataCenters />} />
        <Route path="data-centers" element={<DataCenters />} />
        <Route path="sample" element={<Sample />} />
      </Route>
    </Routes>
  );
}
