import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { MantineProvider } from '@mantine/core';
import { RecoilRoot } from 'recoil';
import { createClient } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

(async () => {
  const keys = await caches.keys();
  for (const key of keys) {
    caches.delete(key);
  }

  // Unregister our service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(async (registration) => {
      const result = await registration.unregister();
    });
  }
})();


// Remove dumb warning (errors) caused by Mantine in dev
const consoleError = console.error;
console.error = function (message, ...args) {
  if (/validateDOMNesting|changing an uncontrolled input/.test(message)) {
    return;
  }
  consoleError(message, ...args);
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <MantineProvider defaultColorScheme='dark'>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>
);