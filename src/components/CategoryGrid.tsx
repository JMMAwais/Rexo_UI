import { Link } from "react-router-dom";
import { useGridCategories } from "@/lib/publicCategoriesApi";

const CategoryGrid = () => {
  const { data: categories = [], isLoading } = useGridCategories();

  // Koi category na ho to poora section chhupa do
  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 rounded-lg bg-secondary animate-pulse" />
              ))
            : categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="group flex flex-col items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-primary/5 transition-all duration-200"
                >
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      loading="lazy"
                      className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold group-hover:scale-110 transition-transform">
                      {cat.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="text-xs font-medium text-foreground text-center">{cat.name}</span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;