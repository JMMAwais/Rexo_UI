import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { graphqlRequest } from "@/lib/graphqlClient";
import { isUuid } from "@/lib/productsApi";



interface ApiProduct {
  id: string;
  title: string;
  price: number;
  discountedPrice: number | null;
  primaryImageUrl: string | null;
  sellerStoreName: string | null;
  stock: number;
}

interface ProductsResponse {
  products: {
    items: ApiProduct[];
    totalCount: number;
  } | null;
}

const PRODUCTS_QUERY = `
  query GetProducts($searchTerm: String, $categoryId: UUID, $pageNumber: Int, $pageSize: Int, $sortBy: String, $sortDirection: String) {
    products(searchTerm: $searchTerm, categoryId: $categoryId, pageNumber: $pageNumber, pageSize: $pageSize, sortBy: $sortBy, sortDirection: $sortDirection) {
      items {
        id
        title
        price
        discountedPrice
        primaryImageUrl
        sellerStoreName
        stock
      }
      totalCount
    }
  }
`;

const CATEGORY_NAMES_QUERY = `query CategoryNames { allCategories { id name } }`;

function toProduct(item: ApiProduct): Product {
  return {
    id: item.id,
    name: item.title,
    price: item.discountedPrice ?? item.price,
    originalPrice: item.discountedPrice ? item.price : undefined,
    image: item.primaryImageUrl ?? "/placeholder.svg",
    category: "",
    seller: { id: "", name: item.sellerStoreName ?? "Seller", avatar: "", rating: 0, totalSales: 0, location: "" },
    rating: 0,
    reviews: 0,
  };
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
 
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  // "debouncedSearch" — 
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const rawCategory = searchParams.get("sub") ?? searchParams.get("category");
  const categoryId = isUuid(rawCategory ?? undefined) ? rawCategory : null;
  const { data: categoryNames } = useQuery({
    queryKey: ["categories", "names"],
    queryFn: () =>
      graphqlRequest<{ allCategories: { id: string; name: string }[] }>(CATEGORY_NAMES_QUERY),
    staleTime: 5 * 60 * 1000,
  });
  const categoryName = categoryId
    ? categoryNames?.allCategories.find((c) => c.id === categoryId)?.name ?? null
    : null;
 
  useEffect(() => {
    const fromUrl = searchParams.get("search") ?? "";
    setSearchInput(fromUrl);
    setDebouncedSearch(fromUrl);
  }, [searchParams]);

  // Debounce 
   useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      const next = new URLSearchParams(searchParams);
      if (searchInput) next.set("search", searchInput);
      else next.delete("search");
      if (next.toString() !== searchParams.toString()) {
        setSearchParams(next, { replace: true });
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const sortMap: Record<string, { sortBy?: string; sortDirection?: string }> = {
    "price-low": { sortBy: "price", sortDirection: "asc" },
    "price-high": { sortBy: "price", sortDirection: "desc" },
    default: {},
  };

   const { data, isLoading, isError } = useQuery({
    queryKey: ["products", debouncedSearch, sort, categoryId],
    queryFn: () =>
      graphqlRequest<ProductsResponse>(PRODUCTS_QUERY, {
        searchTerm: debouncedSearch || null,
        categoryId,
        pageNumber: 1,
        pageSize: 40,
        ...sortMap[sort],
      }),
  });

  const products = useMemo(
    () => (data?.products?.items ?? []).map(toProduct),
    [data]
  );

   const clearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSort("default");
    setSearchParams({});
  };

  const clearCategory = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    next.delete("sub");
    setSearchParams(next);
  };

  const hasFilters = searchInput || sort !== "default" || categoryId;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
          <div>
                      <h1 className="text-3xl font-bold text-foreground">{categoryName ?? "All Products"}</h1>
            {categoryId && (
              <button
                onClick={clearCategory}
                className="inline-flex items-center gap-1 mt-1 text-xs text-primary hover:underline"
              >
                <X className="w-3 h-3" /> Clear category filter
              </button>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading ? "Loading..." : `${data?.products?.totalCount ?? 0} products found`}
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Input
                placeholder="Search products..."
                className="pr-8 bg-secondary border-0"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary text-primary-foreground" : ""}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-secondary/50 rounded-lg items-center">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-3 h-3 mr-1" /> Clear
              </Button>
            )}
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-lg text-destructive">Kuch masla ho gaya, dobara try karein</p>
          </div>
        )}

        {!isError && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          !isLoading && !isError && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No products found</p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear filters
              </Button>
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;