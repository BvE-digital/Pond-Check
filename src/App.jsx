import React, { useState } from 'react';
import { CHECKLISTS } from './data/checklists.js';
import HomeScreen from './components/HomeScreen.jsx';
import ChecklistForm from './components/ChecklistForm.jsx';
import SmsView from './components/SmsView.jsx';
import DataLog from './components/DataLog.jsx';

export default function App() {
  const [view, setView] = useState('home');
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [formData, setFormData] = useState({});
  const [submission, setSubmission] = useState(null);

  function handleSelectChecklist(checklist) {
    setSelectedChecklist(checklist);
    setFormData({});
    setSubmission(null);
    setView('form');
  }

  function handleFormSubmit(data) {
    setFormData(data);
    setSubmission(null);
    setView('sms');
  }

  function handleViewSubmission(sub) {
    // Look up the full checklist definition from the saved checklist_id
    const checklist = CHECKLISTS.find(c => c.id === sub.checklist_id) || null;
    setSelectedChecklist(checklist);
    setFormData(sub.data || {});
    setSubmission(sub);
    setView('sms');
  }

  function handleViewLog() {
    setView('log');
  }

  function handleBack() {
    setView('home');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {view === 'home' && (
        <HomeScreen onSelect={handleSelectChecklist} onViewLog={handleViewLog} />
      )}
      {view === 'form' && selectedChecklist && (
        <ChecklistForm checklist={selectedChecklist} onSubmit={handleFormSubmit} onBack={handleBack} />
      )}
      {view === 'sms' && (
        <SmsView
          checklist={selectedChecklist}
          formData={formData}
          submission={submission}
          onBack={handleBack}
        />
      )}
      {view === 'log' && (
        <DataLog onViewSubmission={handleViewSubmission} onBack={handleBack} />
      )}
    </div>
  );
}
