import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface DonationFormStatus {
  formEnabled: boolean;
  maintenanceMessage: string;
  panRequired?: 'always' | 'threshold' | 'optional' | 'never';
  panThreshold?: number;
}

interface UseDonationFormStatusReturn {
  isEnabled: boolean;
  maintenanceMessage: string;
  isLoading: boolean;
  checkAndNotify: () => boolean;
  refetch: () => Promise<void>;
  panRequired: 'always' | 'threshold' | 'optional' | 'never';
  panThreshold: number;
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
    panRequired: 'threshold',
    panThreshold: 2000,
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
      // Fetch from /current endpoint to get full settings including PAN config
      const response = await fetch(`${baseUrl}/donation-form-settings/current`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch donation form status');
      }

      const data = await response.json();
      
      // Extract relevant fields
      const formStatus: DonationFormStatus = {
        formEnabled: data.formEnabled ?? true,
        maintenanceMessage: data.maintenanceMessage ?? '',
        panRequired: data.panRequired ?? 'threshold',
        panThreshold: data.config?.panThreshold ?? 2000,
      };
      
      // Update cache
      statusCache = {
        data: formStatus,
        timestamp: now,
      };

      setStatus(formStatus);
    } catch (error) {
      console.error('Error fetching donation form status:', error);
      // Default to enabled on error to not block users
      setStatus({
        formEnabled: true,
        maintenanceMessage: '',
        panRequired: 'threshold',
        panThreshold: 2000,
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
    panRequired: status.panRequired ?? 'threshold',
    panThreshold: status.panThreshold ?? 2000,
  };
}
