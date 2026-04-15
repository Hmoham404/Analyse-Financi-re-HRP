import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, GraduationCap, BookOpen, Briefcase } from 'lucide-react';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import CoursPage from './pages/CoursPage';
import TravailPage from './pages/TravailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">IHEC</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">Analyse Financière</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  <Home className="h-4 w-4 mr-1" />
                  Accueil
                </Link>
                <Link to="/portfolio" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Portfolio
                </Link>
                <Link to="/cours" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Cours
                </Link>
                <Link to="/travail" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  <Briefcase className="h-4 w-4 mr-1" />
                  Travail
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/cours" element={<CoursPage />} />
            <Route path="/travail" element={<TravailPage />} />
          </Routes>
        </main>

        <footer className="bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-600">
              <p>Projet académique – IHEC Carthage</p>
              <p className="mt-2">Analyse Financière - 2ème année</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
