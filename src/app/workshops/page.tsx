"use client";

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { WorkshopCard } from '@/components/workshop/WorkshopCard';
import { WORKSHOPS, CATEGORIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, BookOpen } from 'lucide-react';

export default function WorkshopsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredWorkshops = useMemo(() => {
    let results = [...WORKSHOPS, ...WORKSHOPS.map(w => ({ ...w, id: `dup-${w.id}` }))];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(w => 
        w.title.toLowerCase().includes(query) || 
        w.instructor.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      results = results.filter(w => w.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    return results;
  }, [searchQuery, selectedCategory]);

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
                <Input 
                  placeholder="Search workshops..." 
                  className="pl-10 rounded-full" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-full shrink-0" onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}>
                <Filter className="h-4 w-4" />
              </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <Button 
            variant={selectedCategory === null ? "default" : "secondary"} 
            className="rounded-full px-6 whitespace-nowrap"
            onClick={() => setSelectedCategory(null)}
          >
            All Classes
          </Button>
          {CATEGORIES.map(cat => (
            <Button 
              key={cat.id} 
              variant={selectedCategory === cat.id ? "default" : "secondary"} 
              className={`rounded-full px-6 whitespace-nowrap transition-colors ${selectedCategory === cat.id ? '' : 'bg-white hover:bg-primary hover:text-white'}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {filteredWorkshops.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredWorkshops.map(workshop => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-[3rem] bg-muted/20">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-xl font-bold font-headline mb-2">No workshops found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your category or search terms.</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}>Clear All Filters</Button>
          </div>
        )}

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
