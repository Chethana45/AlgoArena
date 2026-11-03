import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import DashboardPage from './pages/DashboardPage';
import VisualizerPage from './pages/VisualizerPage';
import BattlePage from './pages/BattlePage';
import LearnPage from './pages/LearnPage';
import ComplexityPage from './pages/ComplexityPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { AuthProvider } from './context/AuthContext';
import { Swords, Heart } from 'lucide-react';

function AlgoArenaApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [visualizerAlgo, setVisualizerAlgo] = useState('bubbleSort');

  const handleNavigate = (tab, category, algoId) => {
    if (algoId) {
      setVisualizerAlgo(algoId);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col font-sans selection:bg-brand-purple/30 selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <DashboardPage onNavigate={handleNavigate} />
        )}
        {activeTab === 'visualizer' && (
          <VisualizerPage initialAlgo={visualizerAlgo} />
        )}
        {activeTab === 'battle' && (
          <BattlePage />
        )}
        {activeTab === 'learn' && (
          <LearnPage onNavigateToVisualizer={(id) => handleNavigate('visualizer', null, id)} />
        )}
        {activeTab === 'complexity' && (
          <ComplexityPage />
        )}
        {activeTab === 'leaderboard' && (
          <LeaderboardPage />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surfaceBorder/50 bg-[#070A12] py-8 text-xs text-gray-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-accent to-brand-purple flex items-center justify-center">
              <Swords className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">AlgoArena</span>
            <span className="text-gray-500">•</span>
            <span>Interactive Algorithm Battle & Visualization Platform</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span>React • Vite • Tailwind • Framer Motion • Recharts</span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AlgoArenaApp />
    </AuthProvider>
  );
}
