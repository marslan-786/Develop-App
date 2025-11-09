import { Suspense } from 'react';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-lg font-medium text-gray-500">
        Loading Page...
      </div>
    </div>
  );
}

export default function AddProductLayout({ children }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
}
