import React from 'react';
import {
  Droplets, FlaskConical, Microscope, Activity,
  Package, Wrench, AlertTriangle, Scale, ClipboardList
} from 'lucide-react';
import { CHECKLISTS } from '../data/checklists.js';

const ICON_MAP = {
  Droplets,
  FlaskConical,
  Microscope,
  Activity,
  Package,
  Wrench,
  AlertTriangle,
  Scale,
};

export default function HomeScreen({ onSelect, onViewLog }) {
  return (
    <div className="min-h-screen bg-skretting-light">
      {/* Header — white with Skretting red accent */}
      <header className="app-header">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/skretting_logo.webp" alt="Skretting" className="h-7 w-auto" />
            <div className="w-px h-5 bg-skretting-border" />
            <span className="text-skretting-red font-semibold text-sm tracking-wide">PondCheck</span>
          </div>
          <button
            onClick={onViewLog}
            className="flex items-center gap-1.5 text-sm text-skretting-muted hover:text-skretting-navy transition-colors duration-150"
          >
            <ClipboardList className="w-4 h-4" />
            Data Log
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Section heading */}
        <div className="mb-5">
          <h1 className="text-lg font-serif text-skretting-navy mb-1">Pond Inspections</h1>
          <p className="text-sm text-skretting-muted">Select a checklist to begin an inspection</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {CHECKLISTS.map(checklist => {
            const Icon = ICON_MAP[checklist.icon] || Droplets;
            return (
              <button
                key={checklist.id}
                onClick={() => onSelect(checklist)}
                className="card p-4 text-left hover:border-skretting-teal transition-colors duration-150 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-md bg-skretting-teal-soft flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-skretting-teal" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-skretting-navy leading-tight mb-1">
                  {checklist.name}
                </p>
                <p className="text-xs text-skretting-muted leading-snug mb-2">
                  {checklist.description}
                </p>
                <p className="text-xs text-skretting-muted">
                  {checklist.fields.length} fields
                </p>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
