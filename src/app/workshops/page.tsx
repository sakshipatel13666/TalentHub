"use client";

import { Navbar } from '@/components/layout/Navbar';
import { WorkshopCard } from '@/components/workshop/WorkshopCard';
import { WORKSHOPS, CATEGORIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, BookOpen } from 'lucide-react';

export default function WorkshopsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-4">
              <BookOpen className="h-3 w-3" />
              <span>LIVE & ON-DEMAND LEARNING</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-headline font-bold mb-4">Master Your Craft</h1>
            <p className="text-muted-foreground max-w-xl">Learn from world-class professionals in intimate, project-driven workshops designed to jumpstart your career.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search workshops..." className="pl-10 rounded-full" />
              </div>
              <Button variant="outline" size="icon" className="rounded-full shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <Button variant="default" className="rounded-full px-6">All Classes</Button>
          {CATEGORIES.map(cat => (
            <Button key={cat.id} variant="secondary" className="rounded-full px-6 whitespace-nowrap bg-white hover:bg-primary hover:text-white transition-colors">
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {WORKSHOPS.map(workshop => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
          {/* Duplicates for demo */}
          {WORKSHOPS.map(workshop => (
            <WorkshopCard key={`dup-${workshop.id}`} workshop={workshop} />
          ))}
        </div>

        <div className="mt-20 talent-gradient rounded-[2rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-headline font-bold mb-4">Are you an expert?</h3>
            <p className="text-white/80 max-w-md">Turn your knowledge into income. Host your own workshop and reach thousands of students globally.</p>
          </div>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-12 h-14 text-lg font-bold">Become an Instructor</Button>
        </div>
      </main>
    </div>
  );
}