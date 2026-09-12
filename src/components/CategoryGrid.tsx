import { Link } from "react-router-dom";
import { categories } from "@/lib/mock-data";

const CategoryGrid = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">Shop by Category</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className="group flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary hover:bg-primary/5 transition-all duration-200"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
            <span className="text-xs font-medium text-foreground text-center">{cat.name}</span>
            <span className="text-[10px] text-muted-foreground">{cat.count.toLocaleString()} items</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryGrid;
