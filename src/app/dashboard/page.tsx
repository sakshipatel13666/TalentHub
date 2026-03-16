"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Star, 
  CheckCircle2,
  Plus,
  Loader2
} from 'lucide-react';
import { WORKSHOPS } from '@/lib/mock-data';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const displayName = profile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

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
              <Link href={user ? `/profile/${user.uid}` : '#'}>View Public Profile</Link>
            </Button>
            <Button className="rounded-full px-8 gap-2">
              <Plus className="h-4 w-4" /> Create Workshop
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Earnings" value="$12,450" change="+12.5%" icon={DollarSign} color="text-green-600" />
          <StatCard title="Active Projects" value="8" change="+2" icon={Briefcase} color="text-primary" />
          <StatCard title="Workshops" value="4" change="0" icon={Calendar} color="text-accent" />
          <StatCard title="Rating" value="4.9" change="124 reviews" icon={Star} color="text-yellow-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Activity */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-border/50">
                <CardTitle className="text-xl font-headline">Upcoming Projects</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold">E-commerce UI Overhaul</h4>
                          <p className="text-sm text-muted-foreground">Client: TechFlow Solutions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">$2,500</p>
                        <p className="text-xs text-muted-foreground">Due in 4 days</p>
                      </div>
                    </div>
                  ))}
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

          {/* Side Panels */}
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
                        <p className="text-sm font-bold">John Doe</p>
                        <span className="text-[10px] text-muted-foreground uppercase">10m ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">Hey, let's discuss the final mockups for the checkout flow...</p>
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
