import type { Component } from 'solid-js';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools';

import Index from './pages/Index';

const queryClient = new QueryClient();

const App: Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Index />
      <SolidQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
