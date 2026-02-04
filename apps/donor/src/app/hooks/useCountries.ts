import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../context/ApiContext';

interface CountryOption {
  value: string;
  label: string;
}

/**
 * Hook to fetch available countries based on donation form settings
 * Returns all countries if multiCountry is enabled, otherwise returns only India
 */
export function useCountries() {
  const [countries, setCountries] = useState<CountryOption[]>([{ value: 'india', label: 'India' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/countries`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        
        const data = await response.json();
        setCountries(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch countries');
        // Fallback to India only
        setCountries([{ value: 'india', label: 'India' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
}
