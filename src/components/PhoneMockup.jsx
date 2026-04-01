import React from 'react';
import { ChevronLeft, Signal, Wifi, Battery } from 'lucide-react';

export default function PhoneMockup({ children, contactName = 'PondCheck AI' }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full max-w-sm mx-auto border-2 border-gray-800 rounded-[2.5rem] bg-white overflow-hidden shadow-xl">
      {/* Status bar */}
      <div className="bg-skretting-navy px-6 py-2 flex items-center justify-between">
        <span className="text-white text-xs font-semibold">{timeStr}</span>
        <span className="text-gray-400 text-xs">Skretting Net</span>
        <div className="flex items-center gap-1">
          <Signal className="w-3 h-3 text-white" />
          <Wifi className="w-3 h-3 text-white" />
          <Battery className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Contact header */}
      <div className="bg-skretting-navy border-b border-gray-700 px-4 py-3 flex items-center gap-3">
        <ChevronLeft className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <div className="w-8 h-8 rounded-full bg-skretting-teal flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">PC</span>
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">{contactName}</p>
          <p className="text-gray-400 text-xs">Automated validation</p>
        </div>
      </div>

      {/* Message area */}
      <div className="bg-gray-50 min-h-[380px] max-h-[480px] overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {children}
      </div>

      {/* Input bar — visual only */}
      <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-400">
          iMessage
        </div>
        <div className="w-7 h-7 rounded-full bg-skretting-teal flex items-center justify-center">
          <span className="text-white text-xs">↑</span>
        </div>
      </div>
    </div>
  );
}
