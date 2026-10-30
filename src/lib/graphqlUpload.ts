import { GRAPHQL_ENDPOINT } from "./config";
import { GraphQLRequestError } from "./graphqlClient";


export async function graphqlUploadRequest<T>(
  query: string,
  variables: Record<string, unknown>,
  fileVariableName: string,
  file: File
): Promise<T> {
  const token = localStorage.getItem("rexo_access_token");

  const operations = JSON.stringify({
    query,
    variables: { ...variables, [fileVariableName]: null },
  });
  const map = JSON.stringify({ "0": [`variables.${fileVariableName}`] });

  const formData = new FormData();
  formData.append("operations", operations);
  formData.append("map", map);
  formData.append("0", file);

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "GraphQL-Preflight": "1",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new GraphQLRequestError(`Network error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new GraphQLRequestError(json.errors[0]?.message ?? "Upload failed", json.errors);
  }

  return json.data as T;
}