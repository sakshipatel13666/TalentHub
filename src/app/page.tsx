"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { TalentCard } from '@/components/talent/TalentCard';
import { WorkshopCard } from '@/components/workshop/WorkshopCard';
import { CATEGORIES, TALENTS, WORKSHOPS } from '@/lib/mock-data';
import { ArrowRight, Sparkles, CheckCircle, Search, Star, Globe, Code, Palette, Music, Camera, Dumbbell, Megaphone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const iconMap: Record<string, any> = {
  Code,
  Palette,
  Music,
  Camera,
  Dumbbell,
  Megaphone
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="h-4 w-4" />
              <span>World's #1 Marketplace for Creative Talent</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-headline font-bold mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Hire <span className="text-primary italic">Expert</span> Talent or <span className="text-accent underline decoration-accent/30">Master</span> New Skills.
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              TalentHub is where the world's best creatives, developers, and teachers connect to build, learn, and grow. Everything you need to scale your vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button size="lg" className="rounded-full px-8 py-7 text-lg shadow-lg shadow-primary/20" asChild>
                <Link href="/explore">Discover Talent <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg border-2" asChild>
                <Link href="/workshops">Explore Workshops</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold">15k+</span>
                <span className="text-xs uppercase tracking-widest font-semibold">Active Talents</span>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold">2.5k+</span>
                <span className="text-xs uppercase tracking-widest font-semibold">Live Classes</span>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold">4.9/5</span>
                <span className="text-xs uppercase tracking-widest font-semibold">Satisfaction</span>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
              <Image 
                src="https://picsum.photos/seed/hero/1200/1000" 
                alt="Creatives working" 
                width={600} 
                height={500}
                className="object-cover"
                data-ai-hint="creative workspace"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            </div>
            <div className="absolute -top-6 -right-6 h-64 w-64 bg-accent/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 h-80 w-80 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            
            {/* Floating UI Elements */}
            <div className="absolute top-10 -left-12 glass-card p-4 rounded-2xl animate-bounce duration-[4000ms]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-tighter opacity-50">Project Status</p>
                  <p className="font-bold">Hired Marcus C.</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-10 -right-8 glass-card p-4 rounded-2xl animate-pulse">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-secondary"></div>
                  ))}
                </div>
                <p className="text-xs font-bold">+12 People Enrolled</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-headline font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">Find the perfect professional for your next project</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map(cat => {
              const Icon = iconMap[cat.icon] || Globe;
              return (
                <Link 
                  key={cat.id} 
                  href={`/explore?category=${cat.id}`}
                  className="group relative h-48 rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl transition-all"
                >
                  <Image 
                    src={cat.image || 'https://picsum.photos/seed/ws/600/400'} 
                    alt={cat.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    data-ai-hint={cat.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-primary/60 transition-colors flex flex-col items-center justify-center text-white text-center p-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md mb-3 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all">
                       <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-lg">{cat.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Talents Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-headline font-bold mb-4">Trending Talents</h2>
              <p className="text-muted-foreground">Work with the top rated creatives on TalentHub</p>
            </div>
            <Button variant="link" className="text-primary font-bold hidden sm:flex" asChild>
              <Link href="/explore">View all talents <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TALENTS.map(talent => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        </div>
      </section>

      {/* Workshops Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-3xl lg:text-4xl font-headline font-bold mb-6">Expert-Led Workshops</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Join live, interactive sessions led by industry veterans. Level up your skills with hands-on projects and peer feedback.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Live Q&A Sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Project-Based Learning</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Certified Instructors</span>
                </div>
              </div>
              <Button size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90">Browse all Classes</Button>
            </div>
            <div className="lg:col-span-8 grid gap-6">
              {WORKSHOPS.map(workshop => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="talent-gradient rounded-[3rem] p-12 lg:p-20 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white rounded-full blur-[120px]"></div>
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white rounded-full blur-[120px]"></div>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-headline font-bold mb-8">Ready to showcase your talent to the world?</h2>
              <p className="text-xl text-white/80 mb-12">
                Join our community of thousands of creators and start earning from your skills today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-16 text-lg">Create Profile</Button>
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-10 h-16 text-lg">Learn More</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2">
               <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg talent-gradient text-white font-bold">T</div>
                <span className="text-xl font-headline font-bold text-primary">TalentHub</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                The leading marketplace for creative talent and expert-led education. Connecting visionaries with the skills they need.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Marketplace</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><Link href="/explore">All Talents</Link></li>
                <li><Link href="/workshops">Workshops</Link></li>
                <li><Link href="/trending">Trending</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Talents</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><Link href="/signup">Join as Creator</Link></li>
                <li><Link href="/pricing">Fees & Pricing</Link></li>
                <li><Link href="/community">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/safety">Safety</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 TalentHub Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
