import React from 'react';
import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-900">HEAL NEXUS</h1>
          </div>
          <div className="text-sm text-blue-600">Secure Payment Portal</div>
        </div>
      </div>
    </header>
  );
}