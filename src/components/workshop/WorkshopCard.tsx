"use client";

import Image from 'next/image';
import { Calendar, Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface WorkshopCardProps {
  workshop: any;
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  const { toast } = useToast();

  const handleEnroll = () => {
    toast({
      title: "Enrollment Started",
      description: `You are now enrolling in ${workshop.title}. Please complete your profile to finish.`,
    });
  };

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden border-none shadow-sm hover:shadow-lg transition-all bg-card/50">
      <div className="relative w-full sm:w-48 aspect-video sm:aspect-square shrink-0">
        <Image 
          src={workshop.image} 
          alt={workshop.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
            {workshop.category}
          </span>
        </div>
      </div>
      <CardContent className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-headline font-bold text-lg leading-snug group-hover:text-primary transition-colors">
              {workshop.title}
            </h3>
            <span className={`text-sm font-bold ${workshop.price === 'Free' ? 'text-green-600' : 'text-primary'}`}>
              {workshop.price}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            by <span className="font-medium text-foreground underline decoration-primary/30">{workshop.instructor}</span>
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {workshop.date}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {workshop.participants}/{workshop.maxParticipants} enrolled
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{workshop.rating || '4.8'}</span>
          </div>
          <Button 
            size="sm" 
            className="rounded-full px-6 bg-accent hover:bg-accent/90"
            onClick={handleEnroll}
          >
            Enroll Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
