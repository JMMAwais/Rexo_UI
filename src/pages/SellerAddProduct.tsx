import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Upload, ImagePlus } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { toast } from "sonner";

interface VariantRow {
  id: number;
  type: "color" | "size" | "storage" | "material";
  label: string;
  value: string;
  priceAdjustment: string;
  inStock: boolean;
}

const SellerAddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: Date.now(), type: "color", label: "", value: "", priceAdjustment: "0", inStock: true },
    ]);
  };

  const removeVariant = (id: number) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const updateVariant = (id: number, field: keyof VariantRow, value: string | boolean) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const addImagePlaceholder = () => {
    const placeholders = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    ];
    if (images.length < 6) {
      setImages((prev) => [...prev, placeholders[prev.length % placeholders.length]]);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Product added successfully!", { description: "Your product is now live in your store." });
    navigate("/seller/dashboard");
  };

  const category = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/seller/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">Add New Product</h1>
            <p className="text-sm text-muted-foreground">Fill in the details to list a new product in your store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" placeholder="e.g. Wireless Noise Cancelling Headphones" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" placeholder="Describe your product in detail..." rows={4} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subcategory</Label>
                  <Select disabled={!selectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCategory ? "Select subcategory" : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {category?.subcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] text-center py-0.5">
                        Main
                      </span>
                    )}
                  </div>
                ))}
                {images.length < 6 && (
                  <button
                    type="button"
                    onClick={addImagePlaceholder}
                    className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[10px]">Add Image</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Upload up to 6 images. First image will be the main product image.</p>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price (Rs.) *</Label>
                  <Input id="price" type="number" placeholder="0" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (Rs.)</Label>
                  <Input id="originalPrice" type="number" placeholder="0" min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input id="stock" type="number" placeholder="0" min="0" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="e.g. WH-NC-001" />
                </div>
                <div className="space-y-2">
                  <Label>Badge / Label</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="hot">Hot Deal</SelectItem>
                      <SelectItem value="best">Best Seller</SelectItem>
                      <SelectItem value="new">New Arrival</SelectItem>
                      <SelectItem value="limited">Limited Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card className="shadow-card">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Product Variants</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </Button>
            </CardHeader>
            <CardContent>
              {variants.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No variants added yet. Add variants for different sizes, colors, or other options.
                </p>
              ) : (
                <div className="space-y-3">
                  {variants.map((v, idx) => (
                    <div key={v.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-secondary/50 rounded-lg">
                      <div className="col-span-12 md:col-span-2 space-y-1">
                        {idx === 0 && <Label className="text-xs">Type</Label>}
                        <Select value={v.type} onValueChange={(val) => updateVariant(v.id, "type", val)}>
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="color">Color</SelectItem>
                            <SelectItem value="size">Size</SelectItem>
                            <SelectItem value="storage">Storage</SelectItem>
                            <SelectItem value="material">Material</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-5 md:col-span-3 space-y-1">
                        {idx === 0 && <Label className="text-xs">Label</Label>}
                        <Input
                          className="h-9 text-xs"
                          placeholder="e.g. Black"
                          value={v.label}
                          onChange={(e) => updateVariant(v.id, "label", e.target.value)}
                        />
                      </div>
                      <div className="col-span-5 md:col-span-3 space-y-1">
                        {idx === 0 && <Label className="text-xs">Value</Label>}
                        <Input
                          className="h-9 text-xs"
                          placeholder={v.type === "color" ? "#1a1a1a" : "e.g. M"}
                          value={v.value}
                          onChange={(e) => updateVariant(v.id, "value", e.target.value)}
                        />
                      </div>
                      <div className="col-span-5 md:col-span-2 space-y-1">
                        {idx === 0 && <Label className="text-xs">Price +/-</Label>}
                        <Input
                          className="h-9 text-xs"
                          type="number"
                          placeholder="0"
                          value={v.priceAdjustment}
                          onChange={(e) => updateVariant(v.id, "priceAdjustment", e.target.value)}
                        />
                      </div>
                      <div className="col-span-5 md:col-span-1 space-y-1">
                        {idx === 0 && <Label className="text-xs">Stock</Label>}
                        <label className="flex items-center gap-1.5 h-9 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={v.inStock}
                            onChange={(e) => updateVariant(v.id, "inStock", e.target.checked)}
                            className="accent-primary"
                          />
                          <span className="text-xs text-muted-foreground">Yes</span>
                        </label>
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-end">
                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => removeVariant(v.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" step="0.1" placeholder="0.0" min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Dimensions (L×W×H cm)</Label>
                  <Input id="length" placeholder="e.g. 30×20×10" />
                </div>
                <div className="space-y-2">
                  <Label>Shipping Type</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free Shipping</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <Button type="button" variant="outline" onClick={() => navigate("/seller/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="w-4 h-4" /> Publish Product
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SellerAddProduct;
