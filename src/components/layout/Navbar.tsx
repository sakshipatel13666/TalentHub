
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Menu, Bell, Loader2 } from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, limit, doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Navbar() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  // Fetch current user's profile from Firestore
  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(userRef);

  // Fetch notifications
  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
  }, [db, user]);

  const { data: notifications } = useCollection(notificationsQuery);
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleLogout = () => {
    signOut(auth);
  };

  const markAsRead = (id: string) => {
    if (!user || !db) return;
    updateDocumentNonBlocking(doc(db, 'users', user.uid, 'notifications', id), { read: true });
  };

  const displayName = profile?.name || user?.displayName || user?.email?.split('@')[0] || 'Member';
  const displayPhoto = profile?.profilePhotoUrl || user?.photoURL;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg talent-gradient text-white font-bold">T</div>
            <span className="text-xl font-headline font-bold text-primary">TalentHub</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors">Find Talent</Link>
            <Link href="/workshops" className="text-sm font-medium hover:text-primary transition-colors">Workshops</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search talent or skills..." 
              className="w-full rounded-full border bg-muted/50 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {isUserLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : !user ? (
            <>
              <Button variant="ghost" className="hidden sm:flex" asChild>
                <Link href="/auth">Log in</Link>
              </Button>
              <Button className="rounded-full px-6" asChild>
                <Link href="/auth">Join Now</Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-accent border-2 border-background animate-pulse"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl border-none">
                  <DropdownMenuLabel className="p-4 bg-muted/50 font-headline font-bold flex justify-between items-center">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-accent text-white px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="m-0" />
                  <ScrollArea className="h-80">
                    {notifications && notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <DropdownMenuItem 
                          key={notification.id} 
                          className="p-4 focus:bg-accent/5 cursor-pointer border-b last:border-0"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`h-2 w-2 mt-1.5 rounded-full shrink-0 ${notification.read ? 'bg-muted' : 'bg-accent'}`} />
                            <div className="flex-1 space-y-1">
                              <p className={`text-sm font-bold leading-none ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-12 text-center text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-medium">No notifications yet</p>
                      </div>
                    )}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border">
                    {displayPhoto ? (
                      <img src={displayPhoto} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center talent-gradient text-white text-xs font-bold">
                        {displayName[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-none">
                  <div className="flex items-center gap-3 p-3">
                    <div className="h-10 w-10 rounded-full talent-gradient flex items-center justify-center text-white font-bold">
                       {displayName[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-bold truncate">{displayName}</span>
                      <span className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">{user.email || 'Anonymous'}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-3"><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-3"><Link href="/dashboard/settings">Settings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive rounded-xl cursor-pointer py-3 font-bold">Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
