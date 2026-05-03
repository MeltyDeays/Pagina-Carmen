import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogView from './views/CatalogView';
import AdminView from './views/AdminView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CatalogView />} />
        <Route path="/producto/:id" element={<CatalogView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </Router>
  );
}

export default App;
