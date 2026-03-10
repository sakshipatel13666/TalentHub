"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Menu, User, Bell, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state

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

          {!isLoggedIn ? (
            <>
              <Button variant="ghost" className="hidden sm:flex" onClick={() => setIsLoggedIn(true)}>Log in</Button>
              <Button className="rounded-full px-6" onClick={() => setIsLoggedIn(true)}>Join Now</Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent border-2 border-background"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <div className="h-8 w-8 rounded-full talent-gradient"></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Alex Rivera</span>
                      <span className="text-xs text-muted-foreground">Client Profile</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/dashboard/settings">Settings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsLoggedIn(false)} className="text-destructive">Log out</DropdownMenuItem>
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