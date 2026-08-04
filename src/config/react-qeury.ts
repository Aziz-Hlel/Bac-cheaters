import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      throwOnError: false,
      staleTime: 0,
      gcTime: 0,
    },
  },
});

export default queryClient;
