import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Pencil, ShieldCheck, Users2 } from "lucide-react";
import { toast } from "sonner";

const PERMISSIONS = [
  { id: "sellers", label: "Sellers" },
  { id: "customers", label: "Customers" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "categories", label: "Categories" },
  { id: "reviews", label: "Reviews" },
  { id: "coupons", label: "Coupons" },
  { id: "payments", label: "Payments" },
  { id: "shipping", label: "Shipping" },
  { id: "analytics", label: "Analytics" },
  { id: "banners", label: "Banners" },
  { id: "settings", label: "Settings" },
  { id: "staff", label: "Staff & Roles" },
];

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}
interface Staff {
  id: string;
  name: string;
  email: string;
  roleId: string;
  active: boolean;
  lastLogin: string;
  twoFA: boolean;
}

const RKEY = "admin_roles";
const SKEY = "admin_staff";

const seedRoles: Role[] = [
  { id: "r1", name: "Super Admin", description: "Full access to everything", permissions: PERMISSIONS.map(p => p.id) },
  { id: "r2", name: "Order Manager", description: "Manages orders & shipping", permissions: ["orders", "shipping", "customers"] },
  { id: "r3", name: "Content Moderator", description: "Reviews & product moderation", permissions: ["reviews", "products", "categories"] },
  { id: "r4", name: "Finance", description: "Payments & payouts", permissions: ["payments", "analytics"] },
];
const seedStaff: Staff[] = [
  { id: "s1", name: "Ali Raza", email: "ali@marketplace.pk", roleId: "r1", active: true, lastLogin: "2025-04-20", twoFA: true },
  { id: "s2", name: "Zainab Ahmed", email: "zainab@marketplace.pk", roleId: "r2", active: true, lastLogin: "2025-04-19", twoFA: false },
  { id: "s3", name: "Usman Tariq", email: "usman@marketplace.pk", roleId: "r3", active: false, lastLogin: "2025-03-11", twoFA: false },
];

const load = <T,>(k: string, seed: T): T => {
  const raw = localStorage.getItem(k);
  if (!raw) { localStorage.setItem(k, JSON.stringify(seed)); return seed; }
  try { return JSON.parse(raw); } catch { return seed; }
};

const AdminStaff = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [rOpen, setROpen] = useState(false);
  const [sOpen, setSOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);

  const [rForm, setRForm] = useState<Omit<Role, "id">>({ name: "", description: "", permissions: [] });
  const [sForm, setSForm] = useState<Omit<Staff, "id" | "lastLogin">>({ name: "", email: "", roleId: "", active: true, twoFA: false });

  useEffect(() => { setRoles(load(RKEY, seedRoles)); setStaff(load(SKEY, seedStaff)); }, []);
  useEffect(() => { localStorage.setItem(RKEY, JSON.stringify(roles)); }, [roles]);
  useEffect(() => { localStorage.setItem(SKEY, JSON.stringify(staff)); }, [staff]);

  const openRole = (r?: Role) => {
    if (r) { setEditRole(r); setRForm({ name: r.name, description: r.description, permissions: r.permissions }); }
    else { setEditRole(null); setRForm({ name: "", description: "", permissions: [] }); }
    setROpen(true);
  };
  const saveRole = () => {
    if (!rForm.name) return toast.error("Role name required");
    if (editRole) setRoles(roles.map(r => r.id === editRole.id ? { ...editRole, ...rForm } : r));
    else setRoles([...roles, { id: `r${Date.now()}`, ...rForm }]);
    toast.success("Role saved"); setROpen(false);
  };
  const delRole = (id: string) => {
    if (staff.some(s => s.roleId === id)) return toast.error("Role in use by staff");
    setRoles(roles.filter(r => r.id !== id)); toast.success("Role deleted");
  };
  const togglePerm = (p: string) => {
    setRForm({ ...rForm, permissions: rForm.permissions.includes(p) ? rForm.permissions.filter(x => x !== p) : [...rForm.permissions, p] });
  };

  const openStaff = (s?: Staff) => {
    if (s) { setEditStaff(s); setSForm({ name: s.name, email: s.email, roleId: s.roleId, active: s.active, twoFA: s.twoFA }); }
    else { setEditStaff(null); setSForm({ name: "", email: "", roleId: roles[0]?.id ?? "", active: true, twoFA: false }); }
    setSOpen(true);
  };
  const saveStaff = () => {
    if (!sForm.name || !sForm.email || !sForm.roleId) return toast.error("All fields required");
    if (editStaff) setStaff(staff.map(s => s.id === editStaff.id ? { ...editStaff, ...sForm } : s));
    else setStaff([...staff, { id: `s${Date.now()}`, ...sForm, lastLogin: "—" }]);
    toast.success("Staff saved"); setSOpen(false);
  };
  const delStaff = (id: string) => { setStaff(staff.filter(s => s.id !== id)); toast.success("Removed"); };
  const toggleActive = (id: string) => setStaff(staff.map(s => s.id === id ? { ...s, active: !s.active } : s));

  const roleName = (id: string) => roles.find(r => r.id === id)?.name || "—";
  const stats = [
    { label: "Total Staff", value: staff.length, icon: Users2 },
    { label: "Active", value: staff.filter(s => s.active).length, icon: Users2 },
    { label: "Roles", value: roles.length, icon: ShieldCheck },
    { label: "2FA Enabled", value: staff.filter(s => s.twoFA).length, icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Staff & Roles</h1>
          <p className="text-sm text-muted-foreground">Manage sub-admins and role-based permissions</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Staff & Roles" />
          <main className="flex-1 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map(s => (
                <div key={s.label} className="bg-card rounded-lg shadow-card p-4">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs text-muted-foreground">{s.label}</span><s.icon className="w-4 h-4 text-primary" /></div>
                  <div className="text-2xl font-bold">{s.value}</div>
                </div>
              ))}
            </div>

            <Tabs defaultValue="staff">
              <TabsList>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
              </TabsList>

              <TabsContent value="staff">
                <div className="bg-card rounded-lg shadow-card">
                  <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="font-semibold">Staff Members</h2>
                    <Button size="sm" onClick={() => openStaff()}><Plus className="w-4 h-4 mr-1" />Add Staff</Button>
                  </div>
                  <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>2FA</TableHead><TableHead>Last Login</TableHead><TableHead>Active</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>
                      {staff.map(s => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell className="text-sm">{s.email}</TableCell>
                          <TableCell><Badge variant="secondary">{roleName(s.roleId)}</Badge></TableCell>
                          <TableCell>{s.twoFA ? <Badge>ON</Badge> : <Badge variant="outline">OFF</Badge>}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{s.lastLogin}</TableCell>
                          <TableCell><Switch checked={s.active} onCheckedChange={() => toggleActive(s.id)} /></TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => openStaff(s)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => delStaff(s.id)}><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="roles">
                <div className="bg-card rounded-lg shadow-card">
                  <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="font-semibold">Roles</h2>
                    <Button size="sm" onClick={() => openRole()}><Plus className="w-4 h-4 mr-1" />Add Role</Button>
                  </div>
                  <Table>
                    <TableHeader><TableRow><TableHead>Role</TableHead><TableHead>Description</TableHead><TableHead>Permissions</TableHead><TableHead>Staff</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>
                      {roles.map(r => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{r.description}</TableCell>
                          <TableCell><Badge variant="outline">{r.permissions.length} / {PERMISSIONS.length}</Badge></TableCell>
                          <TableCell>{staff.filter(s => s.roleId === r.id).length}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => openRole(r)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => delRole(r.id)}><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      <Dialog open={rOpen} onOpenChange={setROpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editRole ? "Edit Role" : "New Role"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={rForm.name} onChange={e => setRForm({ ...rForm, name: e.target.value })} /></div>
            <div><Label>Description</Label><Input value={rForm.description} onChange={e => setRForm({ ...rForm, description: e.target.value })} /></div>
            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto border rounded-md p-3">
                {PERMISSIONS.map(p => (
                  <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={rForm.permissions.includes(p.id)} onCheckedChange={() => togglePerm(p.id)} />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={saveRole}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sOpen} onOpenChange={setSOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editStaff ? "Edit Staff" : "Add Staff"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={sForm.name} onChange={e => setSForm({ ...sForm, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={sForm.email} onChange={e => setSForm({ ...sForm, email: e.target.value })} /></div>
            <div><Label>Role</Label>
              <Select value={sForm.roleId} onValueChange={v => setSForm({ ...sForm, roleId: v })}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex gap-6 pt-2">
              <div className="flex items-center gap-2"><Switch checked={sForm.active} onCheckedChange={c => setSForm({ ...sForm, active: c })} /><Label>Active</Label></div>
              <div className="flex items-center gap-2"><Switch checked={sForm.twoFA} onCheckedChange={c => setSForm({ ...sForm, twoFA: c })} /><Label>Require 2FA</Label></div>
            </div>
          </div>
          <DialogFooter><Button onClick={saveStaff}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStaff;
