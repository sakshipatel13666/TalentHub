
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { TALENTS } from '@/lib/mock-data';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Globe, Twitter, Linkedin, MessageSquare, Briefcase, Play, ExternalLink, Video as VideoIcon, X, Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const talentId = Array.isArray(id) ? id[0] : id;

  const talentRef = useMemoFirebase(() => {
    if (!db || !talentId) return null;
    return doc(db, 'users', talentId);
  }, [db, talentId]);

  const videosRef = useMemoFirebase(() => {
    if (!db || !talentId) return null;
    return collection(db, 'users', talentId, 'videos');
  }, [db, talentId]);

  const videosQuery = useMemoFirebase(() => {
    if (!videosRef) return null;
    return query(videosRef, orderBy('createdAt', 'desc'));
  }, [videosRef]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(talentRef);
  const { data: videos, isLoading: isVideosLoading } = useCollection(videosQuery);

  // Use Firestore data if available, fallback to mock data if id matches, otherwise default
  const mockTalent = TALENTS.find(t => t.id === talentId) || TALENTS[0];
  
  const talent = {
    ...mockTalent,
    name: profile?.name || (isProfileLoading ? "Loading..." : mockTalent.name),
    bio: profile?.bio || (isProfileLoading ? "" : mockTalent.bio),
    image: profile?.profilePhotoUrl || mockTalent.image,
  };

  const [playingVideo, setPlayingVideo] = useState<any>(null);

  if (isProfileLoading && !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="h-64 talent-gradient relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 h-full relative">
          <Button 
            variant="ghost" 
            className="absolute top-6 left-4 text-white hover:bg-white/20 rounded-full font-bold gap-2 z-20"
            asChild
          >
            <Link href="/explore">
              <ArrowLeft className="h-4 w-4" /> Back to Explore
            </Link>
          </Button>
        </div>
      </div>
      
      <main className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Info Column */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl mb-10 border border-white/20">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="relative h-40 w-40 rounded-3xl overflow-hidden shadow-lg border-4 border-white shrink-0">
                  <Image src={talent.image} alt={talent.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-headline font-bold">{talent.name}</h1>
                      <p className="text-primary font-medium text-lg">{talent.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-full gap-2">
                        <MessageSquare className="h-4 w-4" /> Message
                      </Button>
                      <Button className="rounded-full px-8 shadow-lg shadow-primary/20">Hire Me</Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-foreground">{talent.rating}</span>
                      <span>({talent.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      London, UK
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      15+ Projects Completed
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button size="icon" variant="ghost" className="rounded-full bg-secondary/50">
                      <Globe className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full bg-secondary/50">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full bg-secondary/50">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-headline font-bold">About Me</h2>
                </div>
                
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {talent.bio}
                </p>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 block">Core Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {talent.skills.map(skill => (
                      <Badge key={skill} className="bg-primary/5 text-primary border-none py-2 px-4 rounded-xl text-xs font-semibold">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="bg-transparent border-b rounded-none h-12 p-0 gap-8 mb-8">
                <TabsTrigger value="videos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base px-0 font-bold">Videos</TabsTrigger>
                <TabsTrigger value="portfolio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base px-0 font-bold">Portfolio</TabsTrigger>
                <TabsTrigger value="services" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base px-0 font-bold">Services</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base px-0 font-bold">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="videos" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {isVideosLoading ? (
                    <div className="col-span-full py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : videos && videos.length > 0 ? (
                    videos.map((vid) => (
                      <div 
                        key={vid.id} 
                        onClick={() => setPlayingVideo(vid)}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border/50 group flex flex-col cursor-pointer"
                      >
                        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                          {vid.videoUrl.startsWith('data:video') ? (
                             <video 
                              src={vid.videoUrl} 
                              className="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <VideoIcon className="h-12 w-12 text-white opacity-50" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-16 w-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="h-8 w-8 ml-1" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-t border-border/50 bg-white">
                          <h4 className="font-bold mb-1 truncate">{vid.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{vid.description || 'No description provided.'}</p>
                          {!vid.videoUrl.startsWith('data:video') && (
                            <Button variant="outline" size="sm" className="w-full rounded-xl gap-2" asChild onClick={(e) => e.stopPropagation()}>
                              <a href={vid.videoUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" /> Watch Publicly
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-3xl bg-muted/20">
                      <VideoIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No demonstration videos available yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {talent.portfolio.map((img, i) => (
                    <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden shadow-md cursor-pointer">
                      <Image src={img} alt={`Portfolio ${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-white font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm">View Project</span>
                      </div>
                    </div>
                  ))}
                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground bg-muted/20">
                    <span className="text-sm font-medium">Coming soon...</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="services" className="mt-0 space-y-4">
                {[
                  { title: 'Standard Design Package', price: '$450', desc: 'Complete UI/UX design for up to 5 mobile or web pages.' },
                  { title: 'Consultation & Strategy', price: '$120', desc: '1-hour video consultation to audit your current product UX.' }
                ].map((service, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-border/50 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{service.title}</h4>
                      <p className="text-sm text-muted-foreground">{service.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary mb-2">{service.price}</div>
                      <Button size="sm">Select</Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="reviews" className="mt-0 space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary"></div>
                        <div>
                          <p className="font-bold text-sm">Client {i}</p>
                          <p className="text-xs text-muted-foreground">Oct 2023</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">"Working with {talent.name} was an absolute dream. High attention to detail and delivered ahead of schedule!"</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar CTA Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="text-center mb-6">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-2">Hourly Rate</span>
                  <div className="text-4xl font-headline font-bold text-primary">{talent.price}</div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Unlimited revisions
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Source files included
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Direct communication
                  </div>
                </div>
                
                <Button className="w-full h-14 rounded-2xl text-lg font-bold mb-4">Hire {talent.name}</Button>
                <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold">Contact Me</Button>
                
                <p className="text-center text-xs text-muted-foreground mt-6">
                  Payments are secure and only released when you approve the work.
                </p>
              </div>

              <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
                <h3 className="font-headline font-bold mb-4">{talent.name.split(' ')[0]}'s Classes</h3>
                <div className="space-y-4">
                  <div className="group cursor-pointer">
                    <div className="flex gap-4 items-center">
                      <div className="h-16 w-16 rounded-xl bg-primary/20 shrink-0"></div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">Talent Masterclass</p>
                        <p className="text-xs text-muted-foreground">Next class: Oct 30</p>
                        <p className="text-xs font-bold text-primary mt-1">$49</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="link" className="w-full text-primary font-bold mt-4">View all classes</Button>
              </div>
            </div>
          </div>
        </div>

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

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
