export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthSyncUser {
  id: number | string;
  email: string;
  display_name?: string;
  name?: string;
  picture?: string;
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const AUTH_CLEARED_EVENT = "leetguardAuthCleared";
const AUTH_SYNC_ACK_TYPE = "LEETGUARD_AUTH_SYNC_ACK";
const AUTH_SYNC_RETRIES = 3;
const AUTH_SYNC_ACK_TIMEOUT_MS = 500;

let refreshPromise: Promise<AuthTokens> | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function createSyncId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sync-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthTokens(
  tokens: AuthTokens,
  options: { syncExtension?: boolean; user?: AuthSyncUser | null } = {}
): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  if (options.syncExtension !== false) {
    syncAuthWithExtension(tokens, options.user ?? null);
  }
}

export function clearAuthState(options: { notifyExtension?: boolean } = {}): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  if (options.notifyExtension !== false) {
    window.postMessage({ type: "LEETGUARD_LOGOUT" }, window.location.origin);
  }

  window.dispatchEvent(new CustomEvent(AUTH_CLEARED_EVENT));
  window.dispatchEvent(new CustomEvent("userLoggedOut"));
}

export function onAuthCleared(listener: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(AUTH_CLEARED_EVENT, listener);
  return () => window.removeEventListener(AUTH_CLEARED_EVENT, listener);
}

export async function refreshTokensOnce(
  refresher: (refreshToken: string) => Promise<AuthTokens>
): Promise<AuthTokens> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuthState();
    throw new Error("No refresh token available");
  }

  refreshPromise = refresher(refreshToken)
    .then((tokens) => {
      setAuthTokens(tokens);
      return tokens;
    })
    .catch((error) => {
      clearAuthState();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export function syncAuthWithExtension(
  tokens: AuthTokens,
  user: AuthSyncUser | null = null
): void {
  if (!isBrowser()) return;

  const syncId = createSyncId();
  let attempts = 0;
  let acknowledged = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    window.removeEventListener("message", handleAck);
  };

  const handleAck = (event: MessageEvent) => {
    if (
      event.origin === window.location.origin &&
      event.data?.type === AUTH_SYNC_ACK_TYPE &&
      event.data?.sync_id === syncId &&
      event.data?.success === true
    ) {
      acknowledged = true;
      cleanup();
    }
  };

  const postSync = () => {
    if (acknowledged || attempts >= AUTH_SYNC_RETRIES) {
      cleanup();
      return;
    }

    attempts += 1;
    window.postMessage(
      {
        type: "LEETGUARD_AUTH_SYNC",
        sync_id: syncId,
        tokens,
        user,
      },
      window.location.origin
    );

    timeoutId = setTimeout(postSync, AUTH_SYNC_ACK_TIMEOUT_MS);
  };

  window.addEventListener("message", handleAck);
  postSync();
}
