import { io } from 'socket.io-client';

/**
 * Socket.IO client manager with:
 * - Event ID deduplication (bounded cache)
 * - Automatic REST refetch trigger on reconnect
 * - Safe fallback when offline or in Mock mode
 */

const MAX_DEDUP_CACHE_SIZE = 1000;
const seenEventIds = new Set();

function isDuplicateEvent(eventId) {
  if (!eventId) return false;
  if (seenEventIds.has(eventId)) {
    return true;
  }
  if (seenEventIds.size >= MAX_DEDUP_CACHE_SIZE) {
    const firstAdded = seenEventIds.values().next().value;
    seenEventIds.delete(firstAdded);
  }
  seenEventIds.add(eventId);
  return false;
}

export function createSocketManager({ url = '/', tokenGetter, onReconnect } = {}) {
  let socket = null;
  let isInitialConnect = true;
  const listeners = new Map();

  function connect() {
    if (socket?.connected) return socket;

    socket = io(url, {
      path: '/socket.io',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: (cb) => {
        const token = tokenGetter?.();
        cb({ token });
      },
    });

    socket.on('connect', () => {
      if (!isInitialConnect) {
        // Trigger REST refetch on reconnect to guarantee counts are fresh
        onReconnect?.();
      }
      isInitialConnect = false;
    });

    socket.onAny((event, payload) => {
      // Check event envelope for deduplication
      if (payload && payload.eventId && isDuplicateEvent(payload.eventId)) {
        return; // Drop duplicate
      }
      const handlers = listeners.get(event) || [];
      handlers.forEach((fn) => fn(payload));
    });

    return socket;
  }

  function disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }

  function on(event, handler) {
    if (!listeners.has(event)) {
      listeners.set(event, []);
    }
    listeners.get(event).push(handler);
    return () => off(event, handler);
  }

  function off(event, handler) {
    const handlers = listeners.get(event) || [];
    const filtered = handlers.filter((fn) => fn !== handler);
    listeners.set(event, filtered);
  }

  function isConnected() {
    return Boolean(socket?.connected);
  }

  return {
    connect,
    disconnect,
    on,
    off,
    isConnected,
    isDuplicateEvent,
  };
}

export const socketService = createSocketManager({
  url: window.location.origin,
  tokenGetter: () => {
    try {
      return localStorage.getItem('vrumm_access_token');
    } catch {
      return null;
    }
  },
});
