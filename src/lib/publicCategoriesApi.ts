import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "./graphqlClient";

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  isActive: boolean;
}

export interface MenuSubCategory {
  id: string;
  name: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  subcategories: MenuSubCategory[];
}

// ["categories", ...] se shuru hone ki wajah se jab admin category add/edit kare to ye menu bhi khud refresh ho jata hai
export const MENU_CATEGORIES_KEY = ["categories", "menu"] as const;

const QUERY = `query MenuCategories { allCategories { id name slug parentId isActive } }`;


export async function fetchMenuCategories(): Promise<MenuCategory[]> {
  const res = await graphqlRequest<{ allCategories: ApiCategory[] }>(QUERY);
  const active = res.allCategories.filter((c) => c.isActive);

  return active
    .filter((c) => !c.parentId)
    .slice(0, 6)
    .map((parent) => ({
      id: parent.id,
      name: parent.name,
      slug: parent.slug,
      subcategories: active
        .filter((c) => c.parentId === parent.id)
        .map((s) => ({ id: s.id, name: s.name })),
    }));
}

export function useMenuCategories() {
  return useQuery({
    queryKey: MENU_CATEGORIES_KEY,
    queryFn: fetchMenuCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export interface GridCategory {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface ApiGridCategory {
  id: string;
  name: string;
  imageUrl: string | null;
  parentId: string | null;
  isActive: boolean;
}

const GRID_QUERY = `query GridCategories { allCategories { id name imageUrl parentId isActive } }`;


export async function fetchGridCategories(): Promise<GridCategory[]> {
  const res = await graphqlRequest<{ allCategories: ApiGridCategory[] }>(GRID_QUERY);
  return res.allCategories
    .filter((c) => c.isActive && !c.parentId)
    .slice(0, 6)
    .map((c) => ({ id: c.id, name: c.name, imageUrl: c.imageUrl }));
}

export function useGridCategories() {
  return useQuery({
    queryKey: ["categories", "grid"],
    queryFn: fetchGridCategories,
    staleTime: 5 * 60 * 1000,
  });
}