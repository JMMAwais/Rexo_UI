import { graphqlRequest } from "./graphqlClient";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  parentId: string | null;
}

export const ADMIN_CATEGORIES_KEY = ["admin", "categories"] as const;

type ActionPayload = { success: boolean; error: string | null };
type CategoryPayload = { data: AdminCategory | null; error: string | null };

const FIELDS = "id name slug description imageUrl isActive parentId";

const LIST_QUERY = `query AdminCategories { allCategories { ${FIELDS} } }`;

const CREATE_MUTATION = `
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) { data { ${FIELDS} } error }
  }
`;

const UPDATE_MUTATION = `
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) { data { ${FIELDS} } error }
  }
`;

const DELETE_MUTATION = `
  mutation DeleteCategory($id: UUID!) {
    deleteCategory(id: $id) { success error }
  }
`;

const ACTIVATE_MUTATION = `
  mutation ActivateCategory($id: UUID!) {
    activateCategory(id: $id) { success error }
  }
`;

const DEACTIVATE_MUTATION = `
  mutation DeactivateCategory($id: UUID!) {
    deactivateCategory(id: $id) { success error }
  }
`;

export interface CategoryFormValues {
  name: string;
  description: string;
  imageUrl: string;
}

// Khali string ko null bhejte hain
const orNull = (value: string) => (value.trim() === "" ? null : value.trim());

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const res = await graphqlRequest<{ allCategories: AdminCategory[] }>(LIST_QUERY);
  return res.allCategories;
}

export async function createCategory(
  values: CategoryFormValues,
  parentId: string | null
): Promise<AdminCategory> {
  const res = await graphqlRequest<{ createCategory: CategoryPayload }>(CREATE_MUTATION, {
    input: {
      name: values.name.trim(),
      description: orNull(values.description),
      imageUrl: orNull(values.imageUrl),
      parentId,
    },
  });
  const payload = res.createCategory;
  if (payload.error || !payload.data) throw new Error(payload.error ?? "Unable to create category");
  return payload.data;
}

export async function updateCategory(id: string, values: CategoryFormValues): Promise<AdminCategory> {
  const res = await graphqlRequest<{ updateCategory: CategoryPayload }>(UPDATE_MUTATION, {
    input: {
      id,
      name: values.name.trim(),
      description: orNull(values.description),
      imageUrl: orNull(values.imageUrl),
    },
  });
  const payload = res.updateCategory;
  if (payload.error || !payload.data) throw new Error(payload.error ?? "Unable to update category");
  return payload.data;
}

function assertSuccess(payload: ActionPayload, fallback: string) {
  if (!payload.success) throw new Error(payload.error ?? fallback);
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await graphqlRequest<{ deleteCategory: ActionPayload }>(DELETE_MUTATION, { id });
  assertSuccess(res.deleteCategory, "Unable to delete category");
}

export async function setCategoryActive(id: string, active: boolean): Promise<void> {
  if (active) {
    const res = await graphqlRequest<{ activateCategory: ActionPayload }>(ACTIVATE_MUTATION, { id });
    assertSuccess(res.activateCategory, "Unable to activate category");
  } else {
    const res = await graphqlRequest<{ deactivateCategory: ActionPayload }>(DEACTIVATE_MUTATION, { id });
    assertSuccess(res.deactivateCategory, "Unable to hide category");
  }
}