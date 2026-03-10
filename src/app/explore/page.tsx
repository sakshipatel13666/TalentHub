"use client";

import { Navbar } from '@/components/layout/Navbar';
import { TalentCard } from '@/components/talent/TalentCard';
import { TALENTS, CATEGORIES } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-headline font-bold mb-4">Discover Top Talent</h1>
          <p className="text-muted-foreground">Browse through thousands of world-class professionals ready to bring your ideas to life.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8 shrink-0">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Category</label>
                  <div className="space-y-2">
                    {CATEGORIES.map(cat => (
                      <div key={cat.id} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
                        <div className="h-2 w-2 rounded-full bg-primary/30"></div>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Price Range</label>
                  <div className="px-2">
                    <Slider defaultValue={[20, 150]} max={500} step={10} className="mb-4" />
                    <div className="flex justify-between text-xs font-bold">
                      <span>$0</span>
                      <span>$500+</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Rating</label>
                  <div className="space-y-2">
                    {[5, 4, 3].map(rating => (
                      <div key={rating} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input type="checkbox" className="rounded-sm border-primary text-primary" />
                        <span>{rating} Stars & Up</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <Button className="w-full" variant="outline">Clear all filters</Button>
          </aside>

          {/* Results Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search skills, names, or industries..." className="pl-10 h-12 rounded-xl" />
              </div>
              <Select defaultValue="popular">
                <SelectTrigger className="w-[180px] h-12 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {TALENTS.map(talent => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
              {/* Duplicate for demo */}
              {TALENTS.map(talent => (
                <TalentCard key={`dup-${talent.id}`} talent={talent} />
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <Button variant="outline" size="lg" className="rounded-full px-12">Load More Results</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}