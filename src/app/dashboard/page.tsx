"use client";

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Star, 
  Music,
  Plus,
  Loader2,
  MapPin,
  Edit2,
  Trash2
} from 'lucide-react';
import { WORKSHOPS } from '@/lib/mock-data';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const showsCollectionRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'shows');
  }, [db, user]);

  const showsQuery = useMemoFirebase(() => {
    if (!showsCollectionRef || !user) return null;
    return query(showsCollectionRef, orderBy('date', 'asc'));
  }, [showsCollectionRef, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);
  const { data: upcomingShows, isLoading: isShowsLoading } = useCollection(showsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<any>(null);
  const [showForm, setShowForm] = useState({
    title: '',
    venue: '',
    payout: '',
    date: ''
  });

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full rounded-[2rem] border-none shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">Access Restricted</CardTitle>
              <CardDescription>Please log in to view your talent dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
               <Button asChild className="rounded-xl px-8">
                 <Link href="/auth">Sign In</Link>
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

  // Calculate dynamic total earnings
  const totalEarningsValue = upcomingShows?.reduce((acc, show) => {
    const value = parseFloat(show.payout.replace(/[^0-9.]/g, '')) || 0;
    return acc + value;
  }, 0) || 0;

  const formattedEarnings = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalEarningsValue);

  const handleOpenAddDialog = () => {
    setEditingShow(null);
    setShowForm({ title: '', venue: '', payout: '', date: '' });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (show: any) => {
    setEditingShow(show);
    setShowForm({
      title: show.title,
      venue: show.venue,
      payout: show.payout,
      date: show.date
    });
    setIsDialogOpen(true);
  };

  const handleSaveShow = () => {
    if (!showsCollectionRef || !user || !db) return;

    const showData = {
      ...showForm,
      userId: user.uid,
      updatedAt: serverTimestamp()
    };

    if (editingShow) {
      const showDocRef = doc(db, 'users', user.uid, 'shows', editingShow.id);
      updateDocumentNonBlocking(showDocRef, showData);
    } else {
      addDocumentNonBlocking(showsCollectionRef, {
        ...showData,
        createdAt: serverTimestamp()
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteShow = (showId: string) => {
    if (!db || !user) return;
    const showDocRef = doc(db, 'users', user.uid, 'shows', showId);
    deleteDocumentNonBlocking(showDocRef);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold">Welcome back, {displayName}</h1>
            <p className="text-muted-foreground">Here's what's happening with your account today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href={`/profile/${user.uid}`}>View Public Profile</Link>
            </Button>
            <Button className="rounded-full px-8 gap-2">
              <Plus className="h-4 w-4" /> Create Workshop
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Earnings" value={formattedEarnings} change="+0%" icon={DollarSign} color="text-green-600" />
          <StatCard title="Active Bookings" value={upcomingShows?.length || 0} change="+0" icon={Briefcase} color="text-primary" />
          <StatCard title="Workshops" value="4" change="0" icon={Calendar} color="text-accent" />
          <StatCard title="Rating" value="4.9" change="124 reviews" icon={Star} color="text-yellow-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-border/50 flex flex-row items-center justify-between py-4 px-6">
                <CardTitle className="text-xl font-headline">Upcoming Shows</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleOpenAddDialog} className="rounded-full gap-1">
                  <Plus className="h-4 w-4" /> Add Show
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {isShowsLoading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
                  ) : upcomingShows && upcomingShows.length > 0 ? (
                    upcomingShows.map(show => (
                      <div key={show.id} className="p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Music className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-bold">{show.title}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {show.venue}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold">{show.payout}</p>
                            <p className="text-xs text-muted-foreground">{show.date}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditDialog(show)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteShow(show.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      <p>No upcoming shows listed.</p>
                      <Button variant="link" onClick={handleOpenAddDialog} className="mt-2">Add your first show</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-border/50">
                <CardTitle className="text-xl font-headline">My Workshops</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {WORKSHOPS.slice(0, 2).map(ws => (
                    <div key={ws.id} className="p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-16 rounded-lg overflow-hidden shrink-0">
                          <Image src={ws.image} alt={ws.title} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold">{ws.title}</h4>
                          <p className="text-sm text-muted-foreground">{ws.participants} students enrolled</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-accent font-bold">Manage</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-primary text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-headline font-bold mb-4">Upgrade to Pro</h3>
                <p className="text-white/80 text-sm mb-8 leading-relaxed">
                  Get zero platform fees, unlimited portfolio items, and featured listings in search results.
                </p>
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12 rounded-xl">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-headline">Recent Messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-secondary shrink-0"></div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between">
                        <p className="text-sm font-bold">Booking Agent</p>
                        <span className="text-[10px] text-muted-foreground uppercase">10m ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">Confirmation for your Friday night performance at...</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full rounded-xl mt-4" asChild>
                  <Link href="/messages">Open Messaging</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>{editingShow ? 'Edit Show' : 'Add New Show'}</DialogTitle>
              <DialogDescription>
                Fill in the details for your upcoming performance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Show Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Acoustic Night Live"
                  value={showForm.title}
                  onChange={(e) => setShowForm({ ...showForm, title: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  placeholder="e.g. The Velvet Lounge"
                  value={showForm.venue}
                  onChange={(e) => setShowForm({ ...showForm, venue: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={showForm.date}
                  onChange={(e) => setShowForm({ ...showForm, date: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payout">Payout</Label>
                <Input
                  id="payout"
                  placeholder="e.g. $800"
                  value={showForm.payout}
                  onChange={(e) => setShowForm({ ...showForm, payout: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="button" onClick={handleSaveShow} className="rounded-xl px-8">Save Show</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl bg-secondary ${color} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{change}</span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold font-headline">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
