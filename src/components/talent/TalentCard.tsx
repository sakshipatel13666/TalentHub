"use client";

import Image from 'next/image';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TalentCardProps {
  talent: any;
}

export function TalentCard({ talent }: TalentCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <div className="relative aspect-square overflow-hidden">
        <Image 
          src={talent.image} 
          alt={talent.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button className="w-full bg-white text-primary hover:bg-white/90" asChild>
            <Link href={`/profile/${talent.id}`}>View Portfolio</Link>
          </Button>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-headline font-bold text-lg leading-none">{talent.name}</h3>
              <CheckCircle2 className="h-4 w-4 text-accent fill-accent/10" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{talent.role}</p>
          </div>
          <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{talent.rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {talent.skills.slice(0, 3).map((skill: string) => (
            <Badge key={skill} variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-medium">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-border/50 pt-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Starting at</span>
          <span className="text-lg font-bold text-primary">{talent.price}</span>
        </div>
        <Button size="sm" variant="ghost" className="text-accent font-bold hover:text-accent hover:bg-accent/10">
          Hire Now
        </Button>
      </CardFooter>
    </Card>
  );
}