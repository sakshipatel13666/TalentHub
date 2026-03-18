"use client";

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { TalentCard } from '@/components/talent/TalentCard';
import { TALENTS, CATEGORIES } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [ratingFilters, setRatingFilters] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('popular');

  const filteredTalents = useMemo(() => {
    let results = [...TALENTS];

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.role.toLowerCase().includes(query) ||
        t.skills.some(s => s.toLowerCase().includes(query))
      );
    }

    // Category Filter
    if (selectedCategory) {
      results = results.filter(t => t.category === selectedCategory);
    }

    // Price Range Filter
    results = results.filter(t => t.hourlyRate >= priceRange[0] && t.hourlyRate <= priceRange[1]);

    // Rating Filter
    if (ratingFilters.length > 0) {
      const minRating = Math.min(...ratingFilters);
      results = results.filter(t => t.rating >= minRating);
    }

    // Sorting
    results.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'price-high') return b.hourlyRate - a.hourlyRate;
      if (sortBy === 'newest') return b.id.localeCompare(a.id); // Assuming ID order for "newest"
      return b.reviews - a.reviews; // Default to "popular"
    });

    return results;
  }, [searchQuery, selectedCategory, priceRange, ratingFilters, sortBy]);

  const toggleRatingFilter = (rating: number) => {
    setRatingFilters(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 500]);
    setRatingFilters([]);
    setSearchQuery('');
  };

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
                    <div 
                      onClick={() => setSelectedCategory(null)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${!selectedCategory ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
                    >
                      <div className={`h-2 w-2 rounded-full ${!selectedCategory ? 'bg-primary' : 'bg-primary/30'}`}></div>
                      <span className="text-sm font-medium">All Categories</span>
                    </div>
                    {CATEGORIES.map(cat => (
                      <div 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedCategory === cat.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
                      >
                        <div className={`h-2 w-2 rounded-full ${selectedCategory === cat.id ? 'bg-primary' : 'bg-primary/30'}`}></div>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Price Range (₹{priceRange[0]} - ₹{priceRange[1]})</label>
                  <div className="px-2">
                    <Slider 
                      value={[priceRange[1]]} 
                      max={500} 
                      step={10} 
                      onValueChange={(val) => setPriceRange([0, val[0]])}
                      className="mb-4" 
                    />
                    <div className="flex justify-between text-xs font-bold">
                      <span>₹0</span>
                      <span>₹500+</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Rating</label>
                  <div className="space-y-3">
                    {[5, 4, 3].map(rating => (
                      <div key={rating} className="flex items-center gap-3">
                        <Checkbox 
                          id={`rating-${rating}`}
                          checked={ratingFilters.includes(rating)}
                          onCheckedChange={() => toggleRatingFilter(rating)}
                        />
                        <label htmlFor={`rating-${rating}`} className="text-sm font-medium cursor-pointer flex items-center gap-1">
                          {rating} Stars & Up
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <Button className="w-full" variant="outline" onClick={clearFilters}>Clear all filters</Button>
          </aside>

          {/* Results Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search skills, names, or industries..." 
                  className="pl-10 h-12 rounded-xl" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-12 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredTalents.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTalents.map(talent => (
                  <TalentCard key={talent.id} talent={talent} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border-2 border-dashed rounded-[3rem] bg-muted/20">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-xl font-bold font-headline mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
                <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}

            {filteredTalents.length > 0 && (
              <div className="mt-16 flex justify-center">
                <Button variant="outline" size="lg" className="rounded-full px-12">Load More Results</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
