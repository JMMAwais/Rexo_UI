import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Pencil, FileText, Eye } from "lucide-react";
import { toast } from "sonner";

type PageStatus = "published" | "draft";
type PageType = "page" | "faq";

interface CmsPage {
  id: string;
  title: string;
  slug: string;
  type: PageType;
  content: string;
  status: PageStatus;
  showInFooter: boolean;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
}

const KEY = "admin_pages";
const seed: CmsPage[] = [
  { id: "p1", title: "About Us", slug: "about", type: "page", content: "We are Pakistan's premier multi-vendor marketplace connecting buyers with verified sellers across the country.", status: "published", showInFooter: true, metaTitle: "About Us — Marketplace", metaDescription: "Learn about our marketplace and mission.", updatedAt: "2025-04-10" },
  { id: "p2", title: "Terms & Conditions", slug: "terms", type: "page", content: "By using this platform you agree to our terms of service…", status: "published", showInFooter: true, metaTitle: "Terms & Conditions", metaDescription: "Terms of using the marketplace.", updatedAt: "2025-04-05" },
  { id: "p3", title: "Return Policy", slug: "returns", type: "page", content: "Returns accepted within 7 days of delivery for unused items…", status: "published", showInFooter: true, metaTitle: "Return Policy", metaDescription: "Our return & refund policy.", updatedAt: "2025-04-08" },
  { id: "p4", title: "How do I track my order?", slug: "faq-track-order", type: "faq", content: "You can track your order from the 'Order Tracking' page using your order ID and email.", status: "published", showInFooter: false, metaTitle: "", metaDescription: "", updatedAt: "2025-04-12" },
  { id: "p5", title: "How do I become a seller?", slug: "faq-become-seller", type: "faq", content: "Register as a seller from the 'Sell on Marketplace' link and complete the verification process.", status: "published", showInFooter: false, metaTitle: "", metaDescription: "", updatedAt: "2025-04-12" },
];

const load = (): CmsPage[] => {
  const raw = localStorage.getItem(KEY);
  if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed; }
  try { return JSON.parse(raw); } catch { return seed; }
};

const AdminPages = () => {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<CmsPage | null>(null);
  const [edit, setEdit] = useState<CmsPage | null>(null);
  const [filter, setFilter] = useState<"all" | PageType>("all");

  const empty: Omit<CmsPage, "id" | "updatedAt"> = {
    title: "", slug: "", type: "page", content: "", status: "draft", showInFooter: false, metaTitle: "", metaDescription: "",
  };
  const [form, setForm] = useState(empty);

  useEffect(() => { setPages(load()); }, []);
  useEffect(() => { if (pages.length) localStorage.setItem(KEY, JSON.stringify(pages)); }, [pages]);

  const openNew = () => { setEdit(null); setForm(empty); setOpen(true); };
  const openEdit = (p: CmsPage) => {
    setEdit(p);
    setForm({ title: p.title, slug: p.slug, type: p.type, content: p.content, status: p.status, showInFooter: p.showInFooter, metaTitle: p.metaTitle, metaDescription: p.metaDescription });
    setOpen(true);
  };
  const save = () => {
    if (!form.title || !form.slug || !form.content) return toast.error("Title, slug & content required");
    const now = new Date().toISOString().slice(0, 10);
    if (edit) setPages(pages.map(p => p.id === edit.id ? { ...edit, ...form, updatedAt: now } : p));
    else setPages([...pages, { id: `p${Date.now()}`, ...form, updatedAt: now }]);
    toast.success("Page saved"); setOpen(false);
  };
  const del = (id: string) => { setPages(pages.filter(p => p.id !== id)); toast.success("Deleted"); };
  const toggleStatus = (id: string) => setPages(pages.map(p => p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p));

  const filtered = filter === "all" ? pages : pages.filter(p => p.type === filter);
  const stats = [
    { label: "Total", value: pages.length },
    { label: "Published", value: pages.filter(p => p.status === "published").length },
    { label: "Pages", value: pages.filter(p => p.type === "page").length },
    { label: "FAQs", value: pages.filter(p => p.type === "faq").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Content Pages</h1>
            <p className="text-sm text-muted-foreground">Manage static pages, policies and FAQs</p>
          </div>
          <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" />New Page</Button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Content Pages" />
          <main className="flex-1 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map(s => (
                <div key={s.label} className="bg-card rounded-lg shadow-card p-4">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs text-muted-foreground">{s.label}</span><FileText className="w-4 h-4 text-primary" /></div>
                  <div className="text-2xl font-bold">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-lg shadow-card">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="font-semibold">All Content</h2>
                <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="page">Pages</SelectItem>
                    <SelectItem value="faq">FAQs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Slug</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Footer</TableHead><TableHead>Updated</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {filtered.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">/{p.slug}</TableCell>
                      <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                      <TableCell><Badge variant={p.status === "published" ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleStatus(p.id)}>{p.status}</Badge></TableCell>
                      <TableCell>{p.showInFooter ? <Badge>Yes</Badge> : <span className="text-muted-foreground text-sm">—</span>}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.updatedAt}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setPreview(p)}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => del(p.id)}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{edit ? "Edit Page" : "New Page"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={(v: PageType) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="page">Page</SelectItem><SelectItem value="faq">FAQ</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Status</Label>
                <Select value={form.status} onValueChange={(v: PageStatus) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Content</Label><Textarea rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
            <div><Label>Meta Title</Label><Input value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} /></div>
            <div><Label>Meta Description</Label><Textarea rows={2} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.showInFooter} onCheckedChange={c => setForm({ ...form, showInFooter: c })} /><Label>Show in footer</Label></div>
          </div>
          <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!preview} onOpenChange={o => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{preview?.title}</DialogTitle></DialogHeader>
          <div className="text-xs text-muted-foreground">/{preview?.slug} · {preview?.type}</div>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">{preview?.content}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPages;
