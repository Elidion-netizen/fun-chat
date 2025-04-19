import React from '@/react';

export function ConnectionLost(): React.JSX.Element {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white text-lg font-semibold">
          Connection lost
        </span>
      </div>
    </div>
  );
}
