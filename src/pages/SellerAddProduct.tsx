import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trash2, Upload, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { graphqlRequest } from "@/lib/graphqlClient";
import { graphqlUploadRequest } from "@/lib/graphqlUpload";

// ── Backend se categories ──────────────────────────────
interface ApiCategory {
  id: string;
  name: string;
  isActive: boolean;
}

const CATEGORIES_QUERY = `
  query AllCategories {
    allCategories {
      id
      name
      isActive
    }
  }
`;

// ── Product create/publish/discount mutations ──────────
const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      data { id }
      error
    }
  }
`;

const SET_DISCOUNT_MUTATION = `
  mutation SetDiscount($input: SetProductDiscountInput!) {
    setProductDiscount(input: $input) {
      success
      error
    }
  }
`;

const PUBLISH_PRODUCT_MUTATION = `
  mutation PublishProduct($id: UUID!) {
    publishProduct(id: $id) {
      success
      error
    }
  }
`;

const ADD_IMAGE_MUTATION = `
  mutation AddProductImage($productId: UUID!, $file: Upload!, $isPrimary: Boolean!) {
    addProductImage(productId: $productId, file: $file, isPrimary: $isPrimary) {
      data { id url }
      error
    }
  }
`;

// Empty string ko null, warna number bana deta hai (optional numeric fields ke liye)
const toNumberOrNull = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

interface ImageFile {
  file: File;
  previewUrl: string;
}

const SellerAddProduct = () => {
  const navigate = useNavigate();

  // ── Form state ───────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Shipping state ───────────────────────────────────
  const [freeShipping, setFreeShipping] = useState(false);
  const [shippingFee, setShippingFee] = useState("");
  const [processingDays, setProcessingDays] = useState("1");
  const [weightKg, setWeightKg] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [widthCm, setWidthCm] = useState("");
  const [heightCm, setHeightCm] = useState("");

  // ── Categories backend se load karein ───────────────
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      graphqlRequest<{ allCategories: ApiCategory[] }>(CATEGORIES_QUERY),
  });
  const categories = (categoriesData?.allCategories ?? []).filter((c) => c.isActive);

  // ── Image select  ──────────────────
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = ""; 
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error("Category should be selected");
      return;
    }
    if (images.length === 0) {
      toast.error("At least one image should be added");
      return;
    }

    // Shipping validation
    if (!freeShipping && (shippingFee.trim() === "" || Number(shippingFee) < 0)) {
      toast.error("Enter a shipping fee, or turn on free shipping");
      return;
    }
    const days = Number(processingDays);
    if (!Number.isInteger(days) || days < 0 || days > 30) {
      toast.error("Processing time must be between 0 and 30 days");
      return;
    }
    for (const [label, value] of [
      ["Weight", weightKg],
      ["Length", lengthCm],
      ["Width", widthCm],
      ["Height", heightCm],
    ] as const) {
      if (value.trim() !== "" && !(Number(value) > 0)) {
        toast.error(`${label} must be greater than 0`);
        return;
      }
    }

    const sellingPrice = parseFloat(price);
    const basePrice = originalPrice ? parseFloat(originalPrice) : sellingPrice;

    setIsSubmitting(true);
    let createdProductId: string | null = null;
    try {
  
      const createResult = await graphqlRequest<{
        createProduct: { data: { id: string } | null; error: string | null };
      }>(CREATE_PRODUCT_MUTATION, {
        input: {
          sellerId: "00000000-0000-0000-0000-000000000000", 
          categoryId: selectedCategory,
          title,
          description,
          price: basePrice,
          currency: "PKR",
          stock: parseInt(stock, 10),
          isDropshipped: false,
          shipping: {
            weightKg: toNumberOrNull(weightKg),
            lengthCm: toNumberOrNull(lengthCm),
            widthCm: toNumberOrNull(widthCm),
            heightCm: toNumberOrNull(heightCm),
            freeShipping,
            shippingFee: freeShipping ? 0 : Number(shippingFee),
            processingDays: days,
          },
        },
      });

      if (createResult.createProduct.error || !createResult.createProduct.data) {
        throw new Error(createResult.createProduct.error ?? "Product can not be created");
      }

      const productId = createResult.createProduct.data.id;
      createdProductId = productId;


      if (originalPrice && sellingPrice < basePrice) {
        const discountResult = await graphqlRequest<{
          setProductDiscount: { success: boolean; error: string | null };
        }>(SET_DISCOUNT_MUTATION, {
          input: { id: productId, discountedPrice: sellingPrice, currency: "PKR" },
        });
        if (!discountResult.setProductDiscount.success) {
          throw new Error(discountResult.setProductDiscount.error ?? "Could not apply the discount");
        }
      }

    
      for (let i = 0; i < images.length; i++) {
        const imageResult = await graphqlUploadRequest<{
          addProductImage: { data: { id: string; url: string } | null; error: string | null };
        }>(ADD_IMAGE_MUTATION, { productId, isPrimary: i === 0 }, "file", images[i].file);
        if (imageResult.addProductImage.error || !imageResult.addProductImage.data) {
          throw new Error(imageResult.addProductImage.error ?? `Image ${i + 1} could not be uploaded`);
        }
      }


      const publishResult = await graphqlRequest<{
        publishProduct: { success: boolean; error: string | null };
      }>(PUBLISH_PRODUCT_MUTATION, { id: productId });
      if (!publishResult.publishProduct.success) {
        throw new Error(publishResult.publishProduct.error ?? "Product could not be published");
      }

      toast.success("Product has been added!", {
        description: "Your product is now live in the store.",
      });
      navigate("/seller/dashboard");
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Please try again";
      toast.error("Something went wrong", {
        description: createdProductId
          ? `The product was saved as a draft, but: ${reason}`
          : reason,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <Input
                  id="name"
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product in detail..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <img src={img.previewUrl} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
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
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[10px]">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
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
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (Rs.)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                A SKU is generated automatically. Product variants are not available yet.
              </p>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label htmlFor="freeShipping" className="text-sm font-medium">
                    Free shipping
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You cover the delivery cost for this product.
                  </p>
                </div>
                <Switch id="freeShipping" checked={freeShipping} onCheckedChange={setFreeShipping} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingFee">Shipping Fee (Rs.){freeShipping ? "" : " *"}</Label>
                  <Input
                    id="shippingFee"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={freeShipping ? "0" : shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    disabled={freeShipping}
                  />
                  <p className="text-xs text-muted-foreground">
                    Charged once per seller shipment, even if the buyer orders several of your products.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingDays">Processing Time (days) *</Label>
                  <Input
                    id="processingDays"
                    type="number"
                    min="0"
                    max="30"
                    step="1"
                    value={processingDays}
                    onChange={(e) => setProcessingDays(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    How many days you need to dispatch the order after payment.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Package details (optional)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weightKg">Weight (kg)</Label>
                    <Input
                      id="weightKg"
                      type="number"
                      min="0"
                      step="0.001"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lengthCm">Length (cm)</Label>
                    <Input
                      id="lengthCm"
                      type="number"
                      min="0"
                      step="0.1"
                      value={lengthCm}
                      onChange={(e) => setLengthCm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="widthCm">Width (cm)</Label>
                    <Input
                      id="widthCm"
                      type="number"
                      min="0"
                      step="0.1"
                      value={widthCm}
                      onChange={(e) => setWidthCm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heightCm">Height (cm)</Label>
                    <Input
                      id="heightCm"
                      type="number"
                      min="0"
                      step="0.1"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <Button type="button" variant="outline" onClick={() => navigate("/seller/dashboard")} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Publish Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SellerAddProduct;