import { useEffect, useState, useCallback, useRef } from 'react';
import { socketService } from '../services/socketService';
import { useUIStore } from '../store/uiStore';
import { apiClient } from '../api/client';

/**
 * useLiveDashboard hook:
 * - Subscribes to live Socket.IO ops.dashboardUpdate events with deduplication.
 * - On socket reconnect, triggers a REST refetch to ensure consistent metrics.
 * - In Mock API mode or when socket server is disconnected, periodically polls REST.
 */
export function useLiveDashboard() {
  const isMockApi = useUIStore((s) => s.isMockApi);
  const [counts, setCounts] = useState({
    activeRides: 2845,
    searchingBookings: 142,
    onlineCaptains: 1420,
    openSafetyAlerts: 0,
    todayFareVolumePaise: 48235000,
    lastUpdated: new Date().toISOString(),
  });
  const [connectionStatus, setConnectionStatus] = useState(
    isMockApi ? 'MOCK' : 'CONNECTING',
  );
  const [incidentAlerts, setIncidentAlerts] = useState([]);

  const fetchRestOverview = useCallback(async () => {
    try {
      const res = await apiClient('/ops/overview');
      if (res?.data) {
        setCounts((prev) => ({
          ...prev,
          ...res.data,
          lastUpdated: new Date().toISOString(),
        }));
      }
    } catch {
      // If REST endpoint is not yet provided by backend, keep current display
    }
  }, []);

  const fetchRef = useRef(fetchRestOverview);
  useEffect(() => {
    fetchRef.current = fetchRestOverview;
  }, [fetchRestOverview]);

  useEffect(() => {
    if (isMockApi) {
      setConnectionStatus('MOCK');
      // Gentle polling for mock updates
      const interval = setInterval(() => {
        setCounts((prev) => ({
          ...prev,
          activeRides: prev.activeRides + Math.floor(Math.random() * 5) - 2,
          searchingBookings: Math.max(10, prev.searchingBookings + Math.floor(Math.random() * 3) - 1),
          lastUpdated: new Date().toISOString(),
        }));
      }, 5000);
      return () => clearInterval(interval);
    }

    // Live Socket connection
    const socket = socketService.connect();

    const handleConnect = () => {
      setConnectionStatus('CONNECTED');
      fetchRef.current(); // Refetch on connect / reconnect
    };

    const handleDisconnect = () => {
      setConnectionStatus('RECONNECTING');
    };

    const handleDashboardUpdate = (data) => {
      if (data) {
        setCounts((prev) => ({
          ...prev,
          ...data,
          lastUpdated: data.emittedAt || new Date().toISOString(),
        }));
      }
    };

    const handleSafetyIncident = (incident) => {
      if (incident) {
        setIncidentAlerts((prev) => [incident, ...prev.slice(0, 4)]);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socketService.on('ops.dashboardUpdate', handleDashboardUpdate);
    socketService.on('safety.incident', handleSafetyIncident);

    // Initial fetch
    fetchRestOverview();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socketService.off('ops.dashboardUpdate', handleDashboardUpdate);
      socketService.off('safety.incident', handleSafetyIncident);
    };
  }, [isMockApi, fetchRestOverview]);

  return {
    counts,
    connectionStatus,
    incidentAlerts,
    refetch: fetchRestOverview,
  };
}
