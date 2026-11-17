import { GRAPHQL_ENDPOINT } from "./config";

export class GraphQLRequestError extends Error {
  errors: unknown[];
  constructor(message: string, errors: unknown[] = []) {
    super(message);
    this.name = "GraphQLRequestError";
    this.errors = errors;
  }
}

const ACCESS_KEY = "rexo_access_token";
const REFRESH_KEY = "rexo_refresh_token";
const USER_KEY = "rexo_user";

const REFRESH_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(input: { refreshToken: $refreshToken }) {
      data { accessToken refreshToken email fullName role roles }
      error
    }
  }
`;

type RefreshOutcome =
  | { status: "ok"; accessToken: string }
  | { status: "invalid" } // refresh token expire 
  | { status: "network" }; 

async function sendRequest(
  query: string,
  variables: Record<string, unknown> | undefined,
  token: string | null
) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { res, json };
}

// Access token expire 
function isAuthError(res: Response, json: any): boolean {
  if (res.status === 401) return true;
  const errors: any[] = json?.errors ?? [];
  return errors.some((e) => {
    const code = e?.extensions?.code;
    if (code) return code === "AUTH_NOT_AUTHENTICATED";
    return /not authorized|unauthorized|unauthenticated/i.test(e?.message ?? "");
  });
}

async function requestNewTokens(): Promise<RefreshOutcome> {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return { status: "invalid" };

  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: REFRESH_MUTATION, variables: { refreshToken } }),
    });
    const json = await res.json();

    const payload = json?.data?.refreshToken;
    if (!payload) return { status: "network" };
    const data = payload.data;
    if (!data?.accessToken) return { status: "invalid" };

    localStorage.setItem(ACCESS_KEY, data.accessToken);
    localStorage.setItem(REFRESH_KEY, data.refreshToken);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        roles: data.roles,
      })
    );
    window.dispatchEvent(new Event("rexo-token-refreshed"));
    return { status: "ok", accessToken: data.accessToken };
  } catch {
    return { status: "network" };
  }
}


let refreshInFlight: Promise<RefreshOutcome> | null = null;

async function refreshAccessToken(failedToken: string): Promise<RefreshOutcome> {

  const stored = localStorage.getItem(ACCESS_KEY);
  if (stored && stored !== failedToken) return { status: "ok", accessToken: stored };

  if (!refreshInFlight) {
    refreshInFlight = requestNewTokens().finally(() => {
      refreshInFlight = null;
    });
  }
  const outcome = await refreshInFlight;

  
  if (outcome.status === "invalid") {
    const latest = localStorage.getItem(ACCESS_KEY);
    if (latest && latest !== failedToken) return { status: "ok", accessToken: latest };
  }
  return outcome;
}

function endSession() {
  const hadSession = !!localStorage.getItem(USER_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  if (hadSession) window.dispatchEvent(new Event("rexo-session-expired"));
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const token = localStorage.getItem(ACCESS_KEY);
  let { res, json } = await sendRequest(query, variables, token);


  if (token && isAuthError(res, json)) {
    const outcome = await refreshAccessToken(token);
    if (outcome.status === "ok") {
      ({ res, json } = await sendRequest(query, variables, outcome.accessToken));
    } else if (outcome.status === "invalid") {
      endSession();
      throw new GraphQLRequestError("Session expire ho gaya. Please dobara login karein.");
    }

  }

  if (json === null) {
    throw new GraphQLRequestError(`Network error: ${res.status} ${res.statusText}`);
  }

  if (json.errors?.length) {
    const first = json.errors[0];
    // Backend validation errors
    const details = Array.isArray(first?.extensions?.errors)
      ? first.extensions.errors
          .map((e: any) => e.message ?? e.Message)
          .filter(Boolean)
          .join(", ")
      : "";
    throw new GraphQLRequestError(details || first?.message || "GraphQL error", json.errors);
  }

  if (!res.ok) {
    throw new GraphQLRequestError(`Network error: ${res.status} ${res.statusText}`);
  }

  return json.data as T;
}