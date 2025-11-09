import { Suspense } from 'react';

// ایک سادہ سا 'Loading' میسج
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-lg font-medium text-gray-500">
        Loading Settings Page...
      </div>
    </div>
  );
}

// یہ لے آؤٹ خود بخود اسی فولڈر کے 'page.js' پر لاگو ہو جائے گا
export default function SettingsLayout({ children }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
}
