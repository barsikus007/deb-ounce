import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import Index from 'pages/Index';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Index />
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
