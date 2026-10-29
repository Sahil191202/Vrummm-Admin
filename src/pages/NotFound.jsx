import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 text-[#171717] dark:text-[#F4F6F5]">
      <div className="w-16 h-16 rounded-2xl bg-white border border-[#E2E8E4] dark:bg-[#171717] dark:border-[#2A322D] flex items-center justify-center text-[#5E6A64] dark:text-[#9AA6A0] mb-4 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold mb-2">404</h1>
      <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mb-6 max-w-sm">
        The requested resource was not found on the Vrumm Admin portal.
      </p>
      <Link to="/">
        <Button variant="default" className="text-xs gap-2">
          <Home className="w-4 h-4" />
          Return to Overview
        </Button>
      </Link>
    </div>
  );
}
