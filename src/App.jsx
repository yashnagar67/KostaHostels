import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddHostel from './pages/AddHostel';
import { Toaster } from 'react-hot-toast';
import HostelDetails from './pages/HostelDetails';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddHostel />} />
        <Route path="/hostel/:id" element={<HostelDetails />} />
      </Routes>
    </div>
  );
}

export default App;