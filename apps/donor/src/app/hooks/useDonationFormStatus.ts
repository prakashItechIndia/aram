import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface DonationFormStatus {
  formEnabled: boolean;
  maintenanceMessage: string;
}

interface UseDonationFormStatusReturn {
  isEnabled: boolean;
  maintenanceMessage: string;
  isLoading: boolean;
  checkAndNotify: () => boolean;
  refetch: () => Promise<void>;
}

// Cache for the form status
let statusCache: { data: DonationFormStatus | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds

export function useDonationFormStatus(): UseDonationFormStatusReturn {
  const [status, setStatus] = useState<DonationFormStatus>({
    formEnabled: true,
    maintenanceMessage: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    // Check if we have a valid cache
    const now = Date.now();
    if (statusCache.data && now - statusCache.timestamp < CACHE_DURATION) {
      setStatus(statusCache.data);
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3000/api';
      const response = await fetch(`${baseUrl}/donation-form-settings/status`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch donation form status');
      }

      const data: DonationFormStatus = await response.json();
      
      // Update cache
      statusCache = {
        data,
        timestamp: now,
      };

      setStatus(data);
    } catch (error) {
      console.error('Error fetching donation form status:', error);
      // Default to enabled on error to not block users
      setStatus({
        formEnabled: true,
        maintenanceMessage: '',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch status on mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  /**
   * Check if form is enabled and show toast if disabled
   * Returns true if enabled, false if disabled
   */
  const checkAndNotify = useCallback((): boolean => {
    if (!status.formEnabled) {
      toast.error(status.maintenanceMessage || 'This feature is currently unavailable. Please try again later.');
      return false;
    }
    return true;
  }, [status]);

  return {
    isEnabled: status.formEnabled,
    maintenanceMessage: status.maintenanceMessage,
    isLoading,
    checkAndNotify,
    refetch: fetchStatus,
  };
}
