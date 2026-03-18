"use client";

import { useState, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Briefcase, 
  Calendar, 
  IndianRupee, 
  Star, 
  Music,
  Plus,
  Loader2,
  MapPin,
  Edit2,
  Trash2,
  Video as VideoIcon,
  Play,
  Upload,
  Check,
  X
} from 'lucide-react';
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const showsCollectionRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'shows');
  }, [db, user]);

  const workshopsCollectionRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'workshops');
  }, [db, user]);

  const videosCollectionRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'videos');
  }, [db, user]);

  const showsQuery = useMemoFirebase(() => {
    if (!showsCollectionRef || !user) return null;
    return query(showsCollectionRef, orderBy('date', 'asc'));
  }, [showsCollectionRef, user]);

  const workshopsQuery = useMemoFirebase(() => {
    if (!workshopsCollectionRef || !user) return null;
    return query(workshopsCollectionRef, orderBy('date', 'asc'));
  }, [workshopsCollectionRef, user]);

  const videosQuery = useMemoFirebase(() => {
    if (!videosCollectionRef || !user) return null;
    return query(videosCollectionRef, orderBy('createdAt', 'desc'));
  }, [videosCollectionRef, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);
  const { data: upcomingShows, isLoading: isShowsLoading } = useCollection(showsQuery);
  const { data: myWorkshops, isLoading: isWorkshopsLoading } = useCollection(workshopsQuery);
  const { data: myVideos, isLoading: isVideosLoading } = useCollection(videosQuery);

  // Show Dialog State
  const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<any>(null);
  const [showForm, setShowForm] = useState({
    title: '',
    venue: '',
    payout: '',
    date: ''
  });

  // Workshop Dialog State
  const [isWorkshopDialogOpen, setIsWorkshopDialogOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<any>(null);
  const [workshopForm, setWorkshopForm] = useState({
    title: '',
    category: 'Coding',
    price: '',
    date: '',
    maxParticipants: '20'
  });

  // Video Dialog State
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    videoUrl: '',
    description: ''
  });

  // Video Playback State
  const [playingVideo, setPlayingVideo] = useState<any>(null);

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

  const formattedEarnings = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalEarningsValue);

  // Show Actions
  const handleOpenAddShowDialog = () => {
    setEditingShow(null);
    setShowForm({ title: '', venue: '', payout: '', date: '' });
    setIsShowDialogOpen(true);
  };

  const handleOpenEditShowDialog = (show: any) => {
    setEditingShow(show);
    setShowForm({
      title: show.title,
      venue: show.venue,
      payout: show.payout,
      date: show.date
    });
    setIsShowDialogOpen(true);
  };

  const handleSaveShow = () => {
    if (!showsCollectionRef || !user || !db) return;
    const showData = { ...showForm, userId: user.uid, updatedAt: serverTimestamp() };
    if (editingShow) {
      updateDocumentNonBlocking(doc(db, 'users', user.uid, 'shows', editingShow.id), showData);
    } else {
      addDocumentNonBlocking(showsCollectionRef, { ...showData, createdAt: serverTimestamp() });
    }
    setIsShowDialogOpen(false);
  };

  const handleDeleteShow = (showId: string) => {
    if (!db || !user) return;
    deleteDocumentNonBlocking(doc(db, 'users', user.uid, 'shows', showId));
  };

  // Workshop Actions
  const handleOpenAddWorkshopDialog = () => {
    setEditingWorkshop(null);
    setWorkshopForm({ title: '', category: 'Coding', price: '', date: '', maxParticipants: '20' });
    setIsWorkshopDialogOpen(true);
  };

  const handleOpenEditWorkshopDialog = (ws: any) => {
    setEditingWorkshop(ws);
    setWorkshopForm({
      title: ws.title,
      category: ws.category,
      price: ws.price,
      date: ws.date,
      maxParticipants: ws.maxParticipants?.toString() || '20'
    });
    setIsWorkshopDialogOpen(true);
  };

  const handleSaveWorkshop = () => {
    if (!workshopsCollectionRef || !user || !db) return;
    const workshopData = {
      ...workshopForm,
      maxParticipants: parseInt(workshopForm.maxParticipants) || 20,
      participants: editingWorkshop ? editingWorkshop.participants : 0,
      image: editingWorkshop ? editingWorkshop.image : `https://picsum.photos/seed/${Math.random()}/600/400`,
      userId: user.uid,
      updatedAt: serverTimestamp()
    };
    if (editingWorkshop) {
      updateDocumentNonBlocking(doc(db, 'users', user.uid, 'workshops', editingWorkshop.id), workshopData);
    } else {
      addDocumentNonBlocking(workshopsCollectionRef, { ...workshopData, createdAt: serverTimestamp() });
    }
    setIsWorkshopDialogOpen(false);
  };

  const handleDeleteWorkshop = (wsId: string) => {
    if (!db || !user) return;
    deleteDocumentNonBlocking(doc(db, 'users', user.uid, 'workshops', wsId));
  };

  // Video Actions
  const handleOpenAddVideoDialog = () => {
    setEditingVideo(null);
    setVideoForm({ title: '', videoUrl: '', description: '' });
    setIsVideoDialogOpen(true);
  };

  const handleOpenEditVideoDialog = (e: React.MouseEvent, vid: any) => {
    e.stopPropagation();
    setEditingVideo(vid);
    setVideoForm({
      title: vid.title,
      videoUrl: vid.videoUrl,
      description: vid.description || ''
    });
    setIsVideoDialogOpen(true);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoForm(prev => ({ ...prev, videoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveVideo = () => {
    if (!videosCollectionRef || !user || !db) return;
    const videoData = {
      ...videoForm,
      userId: user.uid,
      updatedAt: serverTimestamp()
    };
    if (editingVideo) {
      updateDocumentNonBlocking(doc(db, 'users', user.uid, 'videos', editingVideo.id), videoData);
    } else {
      addDocumentNonBlocking(videosCollectionRef, { ...videoData, createdAt: serverTimestamp() });
    }
    setIsVideoDialogOpen(false);
  };

  const handleDeleteVideo = (e: React.MouseEvent, vidId: string) => {
    e.stopPropagation();
    if (!db || !user) return;
    deleteDocumentNonBlocking(doc(db, 'users', user.uid, 'videos', vidId));
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
            <Button className="rounded-full px-8 gap-2" onClick={handleOpenAddWorkshopDialog}>
              <Plus className="h-4 w-4" /> Create Workshop
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Earnings" value={formattedEarnings} change="+12.5%" icon={IndianRupee} color="text-green-600" />
          <StatCard title="Active Bookings" value={upcomingShows?.length || 0} change={upcomingShows && upcomingShows.length > 0 ? `+${upcomingShows.length} new` : "Stable"} icon={Briefcase} color="text-primary" />
          <StatCard title="Workshops" value={myWorkshops?.length || 0} change={myWorkshops && myWorkshops.length > 0 ? "Active" : "None"} icon={Calendar} color="text-accent" />
          <StatCard title="Rating" value="4.9" change="124 reviews" icon={Star} color="text-yellow-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Shows Section */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-border/50 flex flex-row items-center justify-between py-4 px-6">
                <CardTitle className="text-xl font-headline">Upcoming Shows</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleOpenAddShowDialog} className="rounded-full gap-1">
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditShowDialog(show)}>
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
                      <Button variant="link" onClick={handleOpenAddShowDialog} className="mt-2">Add your first show</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Videos Portfolio Section */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-border/50 flex flex-row items-center justify-between py-4 px-6">
                <CardTitle className="text-xl font-headline">My Talent Videos</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleOpenAddVideoDialog} className="rounded-full gap-1">
                  <Plus className="h-4 w-4" /> Add Video
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {isVideosLoading ? (
                  <div className="p-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : myVideos && myVideos.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {myVideos.map(vid => (
                      <div 
                        key={vid.id} 
                        onClick={() => setPlayingVideo(vid)}
                        className="relative group rounded-3xl overflow-hidden bg-muted aspect-video border border-border/50 flex flex-col cursor-pointer"
                      >
                        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                          {vid.videoUrl.startsWith('data:video') ? (
                            <video 
                              src={vid.videoUrl} 
                              className="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <VideoIcon className="h-10 w-10 text-white opacity-50" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-14 w-14 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="h-6 w-6 ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90" onClick={(e) => handleOpenEditVideoDialog(e, vid)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={(e) => handleDeleteVideo(e, vid.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 bg-white border-t border-border/50">
                          <h4 className="font-bold truncate text-sm">{vid.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    <VideoIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No videos added to your portfolio yet.</p>
                    <Button variant="link" onClick={handleOpenAddVideoDialog} className="mt-2">Upload your first talent video</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Workshops Section */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-border/50 flex flex-row items-center justify-between py-4 px-6">
                <CardTitle className="text-xl font-headline">My Workshops</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleOpenAddWorkshopDialog} className="rounded-full gap-1">
                  <Plus className="h-4 w-4" /> Add Workshop
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {isWorkshopsLoading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
                  ) : myWorkshops && myWorkshops.length > 0 ? (
                    myWorkshops.map(ws => (
                      <div key={ws.id} className="p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-16 rounded-lg overflow-hidden shrink-0">
                            <Image src={ws.image || 'https://picsum.photos/seed/ws/600/400'} alt={ws.title} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold">{ws.title}</h4>
                            <p className="text-sm text-muted-foreground">{ws.participants || 0} students enrolled • {ws.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditWorkshopDialog(ws)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteWorkshop(ws.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="ghost" className="text-accent font-bold">Manage</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      <p>No workshops created yet.</p>
                      <Button variant="link" onClick={handleOpenAddWorkshopDialog} className="mt-2">Host your first workshop</Button>
                    </div>
                  )}
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

        {/* Show Dialog */}
        <Dialog open={isShowDialogOpen} onOpenChange={setIsShowDialogOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>{editingShow ? 'Edit Show' : 'Add New Show'}</DialogTitle>
              <DialogDescription>Fill in the details for your upcoming performance.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Show Title</Label>
                <Input id="title" placeholder="e.g. Acoustic Night Live" value={showForm.title} onChange={(e) => setShowForm({ ...showForm, title: e.target.value })} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="venue">Venue</Label>
                <Input id="venue" placeholder="e.g. The Velvet Lounge" value={showForm.venue} onChange={(e) => setShowForm({ ...showForm, venue: e.target.value })} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={showForm.date} onChange={(e) => setShowForm({ ...showForm, date: e.target.value })} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payout">Payout</Label>
                <Input id="payout" placeholder="e.g. ₹800" value={showForm.payout} onChange={(e) => setShowForm({ ...showForm, payout: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsShowDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="button" onClick={handleSaveShow} className="rounded-xl px-8">Save Show</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Workshop Dialog */}
        <Dialog open={isWorkshopDialogOpen} onOpenChange={setIsWorkshopDialogOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>{editingWorkshop ? 'Edit Workshop' : 'Create Workshop'}</DialogTitle>
              <DialogDescription>Share your knowledge with the TalentHub community.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ws-title">Workshop Title</Label>
                <Input id="ws-title" placeholder="e.g. UI Design Masterclass" value={workshopForm.title} onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={workshopForm.category} onValueChange={(v) => setWorkshopForm({...workshopForm, category: v})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coding">Coding</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ws-date">Date</Label>
                <Input id="ws-date" type="date" value={workshopForm.date} onChange={(e) => setWorkshopForm({ ...workshopForm, date: e.target.value })} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ws-price">Price</Label>
                <Input id="ws-price" placeholder="e.g. ₹49 or Free" value={workshopForm.price} onChange={(e) => setWorkshopForm({ ...workshopForm, price: e.target.value })} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ws-max">Max Participants</Label>
                <Input id="ws-max" type="number" value={workshopForm.maxParticipants} onChange={(e) => setWorkshopForm({ ...workshopForm, maxParticipants: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsWorkshopDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="button" onClick={handleSaveWorkshop} className="rounded-xl px-8">Save Workshop</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Video Upload Dialog */}
        <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>{editingVideo ? 'Edit Portfolio Video' : 'Add Portfolio Video'}</DialogTitle>
              <DialogDescription>Upload a video file to showcase your talent publicly.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="vid-title">Video Title</Label>
                <Input id="vid-title" placeholder="e.g. Live at The O2" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label>Upload Video File</Label>
                <div 
                  onClick={() => videoFileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to select video from desktop</p>
                  <p className="text-xs text-muted-foreground mt-1">Max size: 1MB (Prototype limit)</p>
                  {videoForm.videoUrl && videoForm.videoUrl.startsWith('data:video') && (
                    <div className="mt-4 p-2 bg-primary/10 rounded-lg text-primary text-xs font-bold flex items-center justify-center gap-2">
                      <Check className="h-3 w-3" /> File selected
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={videoFileInputRef} 
                  onChange={handleVideoFileChange} 
                  className="hidden" 
                  accept="video/*"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vid-desc">Short Description (Optional)</Label>
                <Textarea id="vid-desc" placeholder="Briefly describe what this video shows..." value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} className="rounded-xl resize-none" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsVideoDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="button" onClick={handleSaveVideo} className="rounded-xl px-8">Save Video</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Video Playback Modal */}
        <Dialog open={!!playingVideo} onOpenChange={() => setPlayingVideo(null)}>
          <DialogContent className="max-w-4xl p-0 bg-black border-none rounded-3xl overflow-hidden aspect-video flex flex-col items-center justify-center">
            <DialogHeader className="sr-only">
              <DialogTitle>{playingVideo?.title || 'Video Player'}</DialogTitle>
              <DialogDescription>Watching talent demonstration video</DialogDescription>
            </DialogHeader>
             <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-white z-50 hover:bg-white/20"
              onClick={() => setPlayingVideo(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            {playingVideo && (
              <video 
                src={playingVideo.videoUrl} 
                controls 
                autoPlay
                className="w-full h-full object-contain"
              />
            )}
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
          {change && (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full shrink-0">
              {change}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold font-headline">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
