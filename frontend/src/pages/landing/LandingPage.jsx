import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/landing/Hero';
import About from '../../components/landing/About';
import Tracks from '../../components/landing/Tracks';
import Mentors from '../../components/landing/Mentors';
import FAQ from '../../components/landing/FAQ';
import Contact from '../../components/landing/Contact';
import Footer from '../../components/layout/Footer';
import AuthModal from '../../components/common/AuthModal';
import ApplyModal from '../../components/common/ApplyModal';
import Toast from '../../components/common/Toast';

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('Frontend Track');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenApplyForTrack = (trackTitle) => {
    setSelectedTrack(trackTitle);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans relative">
      
      {/* Toast Notification Banner */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Navigation */}
      <Navbar
        onOpenLogin={() => setAuthModalOpen(true)}
        onOpenApply={() => setApplyModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero onOpenApply={() => setApplyModalOpen(true)} />
        <About />
        <Tracks onSelectTrack={handleOpenApplyForTrack} />
        <Mentors />
        <FAQ />
        <Contact onShowToast={showToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onShowToast={showToast}
      />

      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        initialTrack={selectedTrack}
        onShowToast={showToast}
      />

    </div>
  );
}
