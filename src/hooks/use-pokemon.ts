import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { api } from '@/lib/api';

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null };
}

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

/**
 * Example TanStack Query hook. Replace this with your own data sources — it exists
 * only to verify the query client and persisted cache work end-to-end.
 */
export function usePokemon(name: string): UseQueryResult<Pokemon> {
  return useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => api.get<Pokemon>(`${POKEAPI_BASE}/pokemon/${name}`, { withAuth: false }),
    enabled: Boolean(name),
  });
}
