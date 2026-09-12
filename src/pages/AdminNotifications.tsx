import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Bell, Megaphone, Mail, Trash2, Plus, Send } from "lucide-react";
import { toast } from "sonner";

type Audience = "all" | "buyers" | "sellers";
type Channel = "push" | "email" | "in_app";
type NotifStatus = "draft" | "sent" | "scheduled";

interface Notification {
  id: string;
  title: string;
  message: string;
  audience: Audience;
  channel: Channel;
  status: NotifStatus;
  createdAt: string;
  sentAt?: string;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: Audience;
  active: boolean;
  bannerColor: "info" | "warning" | "success" | "promo";
  startsAt: string;
  endsAt: string;
}

const NKEY = "admin_notifications";
const AKEY = "admin_announcements";

const seedN: Notification[] = [
  { id: "n1", title: "Eid Sale Live!", message: "Flat 30% off across all fashion items.", audience: "buyers", channel: "push", status: "sent", createdAt: "2025-04-15", sentAt: "2025-04-15" },
  { id: "n2", title: "Payout processed", message: "Your April payout has been processed.", audience: "sellers", channel: "email", status: "sent", createdAt: "2025-04-10", sentAt: "2025-04-10" },
];
const seedA: Announcement[] = [
  { id: "a1", title: "Free Shipping Weekend", body: "Enjoy free shipping on orders over Rs. 2,000 this weekend.", audience: "all", active: true, bannerColor: "promo", startsAt: "2025-05-01", endsAt: "2025-05-03" },
];

const load = <T,>(k: string, seed: T): T => {
  const raw = localStorage.getItem(k);
  if (!raw) { localStorage.setItem(k, JSON.stringify(seed)); return seed; }
  try { return JSON.parse(raw); } catch { return seed; }
};

const AdminNotifications = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [anns, setAnns] = useState<Announcement[]>([]);
  const [nOpen, setNOpen] = useState(false);
  const [aOpen, setAOpen] = useState(false);

  const [nForm, setNForm] = useState<Omit<Notification, "id" | "createdAt" | "status" | "sentAt">>({
    title: "", message: "", audience: "all", channel: "push",
  });
  const [aForm, setAForm] = useState<Omit<Announcement, "id">>({
    title: "", body: "", audience: "all", active: true, bannerColor: "info", startsAt: "", endsAt: "",
  });

  useEffect(() => { setNotifs(load(NKEY, seedN)); setAnns(load(AKEY, seedA)); }, []);
  useEffect(() => { localStorage.setItem(NKEY, JSON.stringify(notifs)); }, [notifs]);
  useEffect(() => { localStorage.setItem(AKEY, JSON.stringify(anns)); }, [anns]);

  const sendNow = (draft = false) => {
    if (!nForm.title || !nForm.message) return toast.error("Title & message required");
    const now = new Date().toISOString().slice(0, 10);
    setNotifs([{ id: `n${Date.now()}`, ...nForm, status: draft ? "draft" : "sent", createdAt: now, sentAt: draft ? undefined : now }, ...notifs]);
    toast.success(draft ? "Saved as draft" : "Notification sent");
    setNOpen(false);
    setNForm({ title: "", message: "", audience: "all", channel: "push" });
  };

  const saveAnn = () => {
    if (!aForm.title || !aForm.body) return toast.error("Title & body required");
    setAnns([{ id: `a${Date.now()}`, ...aForm }, ...anns]);
    toast.success("Announcement created");
    setAOpen(false);
    setAForm({ title: "", body: "", audience: "all", active: true, bannerColor: "info", startsAt: "", endsAt: "" });
  };

  const toggleAnn = (id: string) => setAnns(anns.map(a => a.id === id ? { ...a, active: !a.active } : a));
  const delAnn = (id: string) => { setAnns(anns.filter(a => a.id !== id)); toast.success("Deleted"); };
  const delNotif = (id: string) => { setNotifs(notifs.filter(n => n.id !== id)); toast.success("Deleted"); };

  const stats = [
    { label: "Total Sent", value: notifs.filter(n => n.status === "sent").length, icon: Send },
    { label: "Drafts", value: notifs.filter(n => n.status === "draft").length, icon: Mail },
    { label: "Active Announcements", value: anns.filter(a => a.active).length, icon: Megaphone },
    { label: "All Notifications", value: notifs.length, icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Notifications & Announcements</h1>
          <p className="text-sm text-muted-foreground">Send push/email notifications and manage site-wide announcements</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Notifications" />
          <main className="flex-1 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map(s => (
                <div key={s.label} className="bg-card rounded-lg shadow-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{s.value}</div>
                </div>
              ))}
            </div>

            <Tabs defaultValue="notifs">
              <TabsList>
                <TabsTrigger value="notifs">Notifications</TabsTrigger>
                <TabsTrigger value="anns">Announcements</TabsTrigger>
              </TabsList>

              <TabsContent value="notifs">
                <div className="bg-card rounded-lg shadow-card">
                  <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="font-semibold">All Notifications</h2>
                    <Dialog open={nOpen} onOpenChange={setNOpen}>
                      <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />New</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Send Notification</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                          <div><Label>Title</Label><Input value={nForm.title} onChange={e => setNForm({ ...nForm, title: e.target.value })} /></div>
                          <div><Label>Message</Label><Textarea value={nForm.message} onChange={e => setNForm({ ...nForm, message: e.target.value })} /></div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><Label>Audience</Label>
                              <Select value={nForm.audience} onValueChange={(v: Audience) => setNForm({ ...nForm, audience: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="buyers">Buyers</SelectItem><SelectItem value="sellers">Sellers</SelectItem></SelectContent>
                              </Select>
                            </div>
                            <div><Label>Channel</Label>
                              <Select value={nForm.channel} onValueChange={(v: Channel) => setNForm({ ...nForm, channel: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="push">Push</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="in_app">In-app</SelectItem></SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => sendNow(true)}>Save Draft</Button>
                          <Button onClick={() => sendNow(false)}>Send Now</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Title</TableHead><TableHead>Audience</TableHead><TableHead>Channel</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {notifs.map(n => (
                        <TableRow key={n.id}>
                          <TableCell><div className="font-medium">{n.title}</div><div className="text-xs text-muted-foreground line-clamp-1">{n.message}</div></TableCell>
                          <TableCell><Badge variant="outline">{n.audience}</Badge></TableCell>
                          <TableCell><Badge variant="secondary">{n.channel}</Badge></TableCell>
                          <TableCell><Badge>{n.status}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{n.sentAt || n.createdAt}</TableCell>
                          <TableCell><Button variant="ghost" size="icon" onClick={() => delNotif(n.id)}><Trash2 className="w-4 h-4" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="anns">
                <div className="bg-card rounded-lg shadow-card">
                  <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="font-semibold">Site-wide Announcements</h2>
                    <Dialog open={aOpen} onOpenChange={setAOpen}>
                      <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />New</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                          <div><Label>Title</Label><Input value={aForm.title} onChange={e => setAForm({ ...aForm, title: e.target.value })} /></div>
                          <div><Label>Body</Label><Textarea value={aForm.body} onChange={e => setAForm({ ...aForm, body: e.target.value })} /></div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><Label>Audience</Label>
                              <Select value={aForm.audience} onValueChange={(v: Audience) => setAForm({ ...aForm, audience: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="buyers">Buyers</SelectItem><SelectItem value="sellers">Sellers</SelectItem></SelectContent>
                              </Select>
                            </div>
                            <div><Label>Style</Label>
                              <Select value={aForm.bannerColor} onValueChange={(v: any) => setAForm({ ...aForm, bannerColor: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="info">Info</SelectItem><SelectItem value="warning">Warning</SelectItem><SelectItem value="success">Success</SelectItem><SelectItem value="promo">Promo</SelectItem></SelectContent>
                              </Select>
                            </div>
                            <div><Label>Starts</Label><Input type="date" value={aForm.startsAt} onChange={e => setAForm({ ...aForm, startsAt: e.target.value })} /></div>
                            <div><Label>Ends</Label><Input type="date" value={aForm.endsAt} onChange={e => setAForm({ ...aForm, endsAt: e.target.value })} /></div>
                          </div>
                          <div className="flex items-center gap-2"><Switch checked={aForm.active} onCheckedChange={c => setAForm({ ...aForm, active: c })} /><Label>Active</Label></div>
                        </div>
                        <DialogFooter><Button onClick={saveAnn}>Create</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Title</TableHead><TableHead>Audience</TableHead><TableHead>Style</TableHead><TableHead>Period</TableHead><TableHead>Active</TableHead><TableHead></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {anns.map(a => (
                        <TableRow key={a.id}>
                          <TableCell><div className="font-medium">{a.title}</div><div className="text-xs text-muted-foreground line-clamp-1">{a.body}</div></TableCell>
                          <TableCell><Badge variant="outline">{a.audience}</Badge></TableCell>
                          <TableCell><Badge variant="secondary">{a.bannerColor}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{a.startsAt} → {a.endsAt}</TableCell>
                          <TableCell><Switch checked={a.active} onCheckedChange={() => toggleAnn(a.id)} /></TableCell>
                          <TableCell><Button variant="ghost" size="icon" onClick={() => delAnn(a.id)}><Trash2 className="w-4 h-4" /></Button></TableCell>
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
    </div>
  );
};

export default AdminNotifications;
