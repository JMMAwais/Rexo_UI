import { useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { categories as seedCategories } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, Search, FolderTree, Layers, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";

interface SubCat { id: string; name: string; }
interface Cat {
  id: string;
  name: string;
  icon: string;
  count: number;
  subcategories: SubCat[];
  active: boolean;
}

const seed: Cat[] = seedCategories.map((c) => ({ ...c, active: true }));

const AdminCategories = () => {
  const [list, setList] = useState<Cat[]>(seed);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [form, setForm] = useState({ name: "", icon: "📦", subsText: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      list.filter((c) =>
        (c.name + " " + c.subcategories.map((s) => s.name).join(" "))
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [list, search]
  );

  const totals = useMemo(
    () => ({
      total: list.length,
      active: list.filter((c) => c.active).length,
      hidden: list.filter((c) => !c.active).length,
      subs: list.reduce((a, c) => a + c.subcategories.length, 0),
    }),
    [list]
  );

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", icon: "📦", subsText: "" });
    setOpen(true);
  };
  const openEdit = (c: Cat) => {
    setEditing(c);
    setForm({
      name: c.name,
      icon: c.icon,
      subsText: c.subcategories.map((s) => s.name).join(", "),
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Name required");
      return;
    }
    const subs: SubCat[] = form.subsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, i) => ({ id: `${Date.now()}-${i}`, name }));

    if (editing) {
      setList((p) =>
        p.map((c) =>
          c.id === editing.id
            ? { ...c, name: form.name, icon: form.icon || "📦", subcategories: subs }
            : c
        )
      );
      toast.success("Category updated");
    } else {
      setList((p) => [
        ...p,
        {
          id: `cat-${Date.now()}`,
          name: form.name,
          icon: form.icon || "📦",
          count: 0,
          subcategories: subs,
          active: true,
        },
      ]);
      toast.success("Category added");
    }
    setOpen(false);
  };

  const toggleActive = (id: string) => {
    setList((p) => p.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    setList((p) => p.filter((c) => c.id !== deleteId));
    toast.success("Category deleted");
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Categories" />

          <main className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">Categories</h1>
                <p className="text-sm text-muted-foreground">
                  Manage product categories & subcategories
                </p>
              </div>
              <Button onClick={openNew}>
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
                  placeholder="Search categories or subcategories..."
                  className="pl-9"
                />
              </div>
            </Card>

            {/* Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Subcategories</TableHead>
                    <TableHead className="text-center">Products</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                            {c.icon}
                          </div>
                          <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {c.subcategories.length === 0 ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : (
                            c.subcategories.map((s) => (
                              <Badge key={s.id} variant="secondary" className="font-normal">
                                {s.name}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{c.count}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={c.active}
                            onCheckedChange={() => toggleActive(c.id)}
                          />
                          <span className="text-xs text-muted-foreground">
                            {c.active ? "Active" : "Hidden"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(c.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </main>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-[80px_1fr] gap-3">
              <div>
                <Label>Icon</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="📦"
                  className="text-center text-xl"
                  maxLength={2}
                />
              </div>
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Electronics"
                />
              </div>
            </div>
            <div>
              <Label>Subcategories (comma separated)</Label>
              <Input
                value={form.subsText}
                onChange={(e) => setForm({ ...form, subsText: e.target.value })}
                placeholder="Mobiles, Laptops, Accessories"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate names with commas
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Products in this category will become uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;
