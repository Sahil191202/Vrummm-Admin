import { useEffect, useState, useCallback, useRef } from 'react';
import { socketService } from '../services/socketService';
import { apiClient } from '../api/client';

/**
 * useLiveDashboard hook:
 * - Subscribes to live Socket.IO ops.dashboardUpdate events.
 * - Polls and refetches live backend REST overview (/ops/overview) on connect, reconnect, and interval.
 */
export function useLiveDashboard() {
  const [counts, setCounts] = useState({
    activeRides: 0,
    searchingBookings: 0,
    onlineCaptains: 0,
    openSafetyAlerts: 0,
    todayFareVolumePaise: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING');
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
      // Endpoint error handling
    }
  }, []);

  const fetchRef = useRef(fetchRestOverview);
  useEffect(() => {
    fetchRef.current = fetchRestOverview;
  }, [fetchRestOverview]);

  useEffect(() => {
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

    // Background refresh interval every 15s to guarantee fresh cluster state
    const refreshInterval = setInterval(() => {
      fetchRef.current();
    }, 15000);

    return () => {
      clearInterval(refreshInterval);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socketService.off('ops.dashboardUpdate', handleDashboardUpdate);
      socketService.off('safety.incident', handleSafetyIncident);
    };
  }, [fetchRestOverview]);

  return {
    counts,
    connectionStatus,
    incidentAlerts,
    refetch: fetchRestOverview,
  };
}
