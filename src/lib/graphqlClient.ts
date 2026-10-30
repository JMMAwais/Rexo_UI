import { GRAPHQL_ENDPOINT } from "./config";

export class GraphQLRequestError extends Error {
  errors: unknown[];
  constructor(message: string, errors: unknown[] = []) {
    super(message);
    this.name = "GraphQLRequestError";
    this.errors = errors;
  }
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const token = localStorage.getItem("rexo_access_token");

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  
  let json: any;
  try {
    json = await res.json();
  } catch {
    
    throw new GraphQLRequestError(`Network error: ${res.status} ${res.statusText}`);
  }

 if (json.errors?.length) {
  const first = json.errors[0];
  // Backend validation errors: extensions.errors = [{ Field, Message }]
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