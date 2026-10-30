import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, FolderTree, Layers, EyeOff, Eye, Loader2, CornerDownRight } from "lucide-react";
import { toast } from "sonner";
import {
  ADMIN_CATEGORIES_KEY,
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  setCategoryActive,
  updateCategory,
  type AdminCategory,
  type CategoryFormValues,
} from "@/lib/adminCategoriesApi";

const NO_PARENT = "none";
const EMPTY_FORM: CategoryFormValues = { name: "", description: "", imageUrl: "" };

type DialogState =
  | { mode: "create"; parentId: string | null }
  | { mode: "edit"; category: AdminCategory }
  | null;

interface Row {
  category: AdminCategory;
  depth: number;
}

/** Categories ko tree ki tarteeb mein (parent ke neeche uske subcategories) flat rows mein badalta hai */
function buildRows(categories: AdminCategory[]): Row[] {
  const byParent = new Map<string | null, AdminCategory[]>();
  for (const c of categories) {
    const key = c.parentId ?? null;
    const list = byParent.get(key) ?? [];
    list.push(c);
    byParent.set(key, list);
  }
  byParent.forEach((list) => list.sort((a, b) => a.name.localeCompare(b.name)));

  const rows: Row[] = [];
  const seen = new Set<string>();
  const walk = (parentId: string | null, depth: number) => {
    for (const c of byParent.get(parentId) ?? []) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      rows.push({ category: c, depth });
      walk(c.id, depth + 1);
    }
  };
  walk(null, 0);

  // Jin ka parent list mein nahi (maslan delete ho chuka), unhein bhi dikhayen
  for (const c of categories) {
    if (!seen.has(c.id)) rows.push({ category: c, depth: 0 });
  }
  return rows;
}

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ADMIN_CATEGORIES_KEY,
    queryFn: fetchAdminCategories,
  });

  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [form, setForm] = useState<CategoryFormValues>(EMPTY_FORM);
  const [parentId, setParentId] = useState<string>(NO_PARENT);
  const [toDelete, setToDelete] = useState<AdminCategory | null>(null);

  const nameById = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);
  const rows = useMemo(() => buildRows(categories), [categories]);

  const query = search.trim().toLowerCase();
  const visibleRows = query
    ? rows
        .filter(({ category: c }) => (c.name + " " + c.slug).toLowerCase().includes(query))
        .map((r) => ({ ...r, depth: 0 })) // search mein flat list
    : rows;

  const totals = {
    total: categories.length,
    active: categories.filter((c) => c.isActive).length,
    hidden: categories.filter((c) => !c.isActive).length,
    subs: categories.filter((c) => c.parentId).length,
  };

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
    // Seller ke add-product form wagera ki categories bhi taza ho jayen
    void queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!dialog) return;
      if (dialog.mode === "create") {
        await createCategory(form, parentId === NO_PARENT ? null : parentId);
      } else {
        await updateCategory(dialog.category.id, form);
      }
    },
    onSuccess: () => {
      toast.success(dialog?.mode === "create" ? "Category created" : "Category updated");
      closeDialog();
      refresh();
    },
    onError: (err: Error) => toast.error("Could not save category", { description: err.message }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ category, active }: { category: AdminCategory; active: boolean }) =>
      setCategoryActive(category.id, active),
    onSuccess: (_d, vars) => {
      toast.success(vars.active ? `"${vars.category.name}" is now visible` : `"${vars.category.name}" is now hidden`);
      refresh();
    },
    onError: (err: Error) => toast.error("Could not change visibility", { description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (category: AdminCategory) => deleteCategory(category.id),
    onSuccess: (_d, category) => {
      toast.success(`"${category.name}" was deleted`);
      setToDelete(null);
      refresh();
    },
    onError: (err: Error) => toast.error("Could not delete category", { description: err.message }),
  });

  const openCreate = (parent: string | null = null) => {
    setForm(EMPTY_FORM);
    setParentId(parent ?? NO_PARENT);
    setDialog({ mode: "create", parentId: parent });
  };

  const openEdit = (category: AdminCategory) => {
    setForm({
      name: category.name,
      description: category.description ?? "",
      imageUrl: category.imageUrl ?? "",
    });
    setDialog({ mode: "edit", category });
  };

  const closeDialog = () => {
    setDialog(null);
    setForm(EMPTY_FORM);
  };

  const submit = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    saveMutation.mutate();
  };

  const togglingId = toggleMutation.isPending ? toggleMutation.variables?.category.id : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Categories" />

          <main className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">Categories</h1>
                <p className="text-sm text-muted-foreground">Manage product categories & subcategories</p>
              </div>
              <Button onClick={() => openCreate()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{totals.total}</p>
                  </div>
                  <FolderTree className="w-8 h-8 text-primary" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{totals.active}</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Hidden</p>
                    <p className="text-2xl font-bold">{totals.hidden}</p>
                  </div>
                  <EyeOff className="w-8 h-8 text-muted-foreground" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Subcategories</p>
                    <p className="text-2xl font-bold">{totals.subs}</p>
                  </div>
                  <Layers className="w-8 h-8 text-primary" />
                </div>
              </Card>
            </div>

            {/* Search */}
            <Card className="p-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  className="pl-9"
                />
              </div>
            </Card>

            {/* Table */}
            <Card>
              {isLoading ? (
                <div className="p-10 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading categories...
                </div>
              ) : isError ? (
                <div className="p-10 text-center space-y-3">
                  <p className="text-sm text-destructive">
                    {error instanceof Error ? error.message : "Unable to load categories"}
                  </p>
                  <Button size="sm" variant="outline" onClick={() => void refetch()}>
                    Try again
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleRows.map(({ category: c, depth }) => (
                      <TableRow key={c.id} className={c.isActive ? "" : "opacity-60"}>
                        <TableCell>
                          <div className="flex items-center gap-3" style={{ paddingLeft: depth * 24 }}>
                            {depth > 0 && <CornerDownRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                            {c.imageUrl ? (
                              <img src={c.imageUrl} alt={c.name} className="w-10 h-10 rounded-lg object-cover bg-secondary" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                                <FolderTree className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{c.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {c.slug}
                                {c.parentId && query && nameById.get(c.parentId) ? ` · in ${nameById.get(c.parentId)}` : ""}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-muted-foreground line-clamp-2">{c.description ?? "-"}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Switch
                              checked={c.isActive}
                              disabled={togglingId === c.id}
                              onCheckedChange={(checked) => toggleMutation.mutate({ category: c, active: checked })}
                            />
                            <Badge variant="outline" className="text-xs font-normal">
                              {c.isActive ? "Active" : "Hidden"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" title="Add subcategory" onClick={() => openCreate(c.id)}>
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Edit" onClick={() => openEdit(c)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Delete"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setToDelete(c)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {visibleRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {categories.length === 0 ? "No categories yet. Add your first category." : "No categories found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </Card>
          </main>
        </div>
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={!!dialog} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog?.mode === "edit" ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {dialog?.mode === "edit"
                ? "Update the name, description or image. A category's parent cannot be changed."
                : "Create a top-level category, or choose a parent to create a subcategory."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name *</Label>
              <Input
                id="cat-name"
                value={form.name}
                maxLength={100}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Electronics"
              />
            </div>

            {dialog?.mode === "create" ? (
              <div className="space-y-2">
                <Label>Parent category</Label>
                <Select value={parentId} onValueChange={setParentId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_PARENT}>None (top-level category)</SelectItem>
                    {rows.map(({ category: c, depth }) => (
                      <SelectItem key={c.id} value={c.id}>
                        {"— ".repeat(depth)}
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              dialog?.mode === "edit" && (
                <p className="text-sm text-muted-foreground">
                  Parent:{" "}
                  <span className="text-foreground">
                    {dialog.category.parentId ? (nameById.get(dialog.category.parentId) ?? "-") : "None (top-level)"}
                  </span>
                </p>
              )
            )}

            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                rows={3}
                maxLength={500}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-image">Image URL</Label>
              <Input
                id="cat-image"
                value={form.imageUrl}
                maxLength={500}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://... (optional)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={saveMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {dialog?.mode === "edit" ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{toDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              A category that has subcategories or products cannot be deleted. If you only want to stop showing
              it in the store, turn its Active switch off instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (toDelete) deleteMutation.mutate(toDelete);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;