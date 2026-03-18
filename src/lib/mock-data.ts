import { PlaceHolderImages } from './placeholder-images';

export const CATEGORIES = [
  { 
    id: 'coding', 
    name: 'Coding', 
    icon: 'Code',
    image: PlaceHolderImages.find(img => img.id === 'cat-coding')?.imageUrl || 'https://picsum.photos/seed/coding/400/300',
    imageHint: 'coding codes'
  },
  { 
    id: 'design', 
    name: 'Design', 
    icon: 'Palette',
    image: PlaceHolderImages.find(img => img.id === 'cat-design')?.imageUrl || 'https://picsum.photos/seed/design/400/300',
    imageHint: 'web design'
  },
  { 
    id: 'music', 
    name: 'Music', 
    icon: 'Music',
    image: PlaceHolderImages.find(img => img.id === 'cat-music')?.imageUrl || 'https://picsum.photos/seed/music/400/300',
    imageHint: 'singer singing'
  },
  { 
    id: 'photo', 
    name: 'Photography', 
    icon: 'Camera',
    image: PlaceHolderImages.find(img => img.id === 'cat-photo')?.imageUrl || 'https://picsum.photos/seed/photo/400/300',
    imageHint: 'photography camera'
  },
  { 
    id: 'fitness', 
    name: 'Fitness', 
    icon: 'Dumbbell',
    image: PlaceHolderImages.find(img => img.id === 'cat-fitness')?.imageUrl || 'https://picsum.photos/seed/fitness/400/300',
    imageHint: 'gym fitness'
  },
  { 
    id: 'marketing', 
    name: 'Marketing', 
    icon: 'Megaphone',
    image: PlaceHolderImages.find(img => img.id === 'cat-marketing')?.imageUrl || 'https://picsum.photos/seed/marketing/400/300',
    imageHint: 'digital marketing'
  },
];

export const TALENTS = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'UI/UX Designer',
    category: 'design',
    rating: 4.9,
    reviews: 124,
    skills: ['Figma', 'Prototyping', 'User Research'],
    hourlyRate: 65,
    price: '$65/hr',
    image: 'https://picsum.photos/seed/sarah/400/400',
    bio: 'Award-winning designer with 8+ years of experience in creating digital products that people love.',
    portfolio: [
      'https://picsum.photos/seed/p1/600/400',
      'https://picsum.photos/seed/p2/600/400',
    ]
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'Full Stack Developer',
    category: 'coding',
    rating: 4.8,
    reviews: 89,
    skills: ['React', 'Node.js', 'PostgreSQL'],
    hourlyRate: 80,
    price: '$80/hr',
    image: 'https://picsum.photos/seed/marcus/400/400',
    bio: 'Passionate developer specializing in scalable web applications and high-performance architecture.',
    portfolio: [
      'https://picsum.photos/seed/p3/600/400',
      'https://picsum.photos/seed/p4/600/400',
    ]
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Product Photographer',
    category: 'photo',
    rating: 5.0,
    reviews: 56,
    skills: ['Commercial', 'Editing', 'Lighting'],
    hourlyRate: 120,
    price: '$120/hr',
    image: 'https://picsum.photos/seed/elena/400/400',
    bio: 'Capturing the essence of brands through striking visual storytelling and meticulous attention to detail.',
    portfolio: [
      'https://picsum.photos/seed/p5/600/400',
      'https://picsum.photos/seed/p6/600/400',
    ]
  },
  {
    id: '4',
    name: 'David Wilson',
    role: 'Music Producer',
    category: 'music',
    rating: 4.7,
    reviews: 42,
    skills: ['Mixing', 'Mastering', 'Ableton'],
    hourlyRate: 50,
    price: '$50/hr',
    image: 'https://picsum.photos/seed/david/400/400',
    bio: 'Transforming melodies into radio-ready hits with professional production and crystal-clear sound.',
    portfolio: [
      'https://picsum.photos/seed/p7/600/400',
    ]
  },
  {
    id: '5',
    name: 'Anya Sokolov',
    role: 'Yoga Instructor',
    category: 'fitness',
    rating: 4.9,
    reviews: 210,
    skills: ['Vinyasa', 'Meditation', 'Wellness'],
    hourlyRate: 40,
    price: '$40/hr',
    image: 'https://picsum.photos/seed/anya/400/400',
    bio: 'Helping individuals find balance and strength through mindful movement and specialized yoga sequences.',
    portfolio: []
  },
  {
    id: '6',
    name: 'Jordan Lee',
    role: 'Growth Marketer',
    category: 'marketing',
    rating: 4.6,
    reviews: 75,
    skills: ['SEO', 'PPC', 'Content Strategy'],
    hourlyRate: 95,
    price: '$95/hr',
    image: 'https://picsum.photos/seed/jordan/400/400',
    bio: 'Driving measurable results for startups and enterprises through data-driven marketing campaigns.',
    portfolio: []
  },
  {
    id: '7',
    name: 'Sophie Martinez',
    role: 'Mobile Developer',
    category: 'coding',
    rating: 4.8,
    reviews: 34,
    skills: ['Flutter', 'Swift', 'Firebase'],
    hourlyRate: 110,
    price: '$110/hr',
    image: 'https://picsum.photos/seed/sophie/400/400',
    bio: 'Building elegant, cross-platform mobile experiences that engage users on any device.',
    portfolio: []
  },
  {
    id: '8',
    name: 'Chris Taylor',
    role: 'Graphic Designer',
    category: 'design',
    rating: 4.5,
    reviews: 156,
    skills: ['Illustrator', 'Branding', 'Print'],
    hourlyRate: 45,
    price: '$45/hr',
    image: 'https://picsum.photos/seed/chris/400/400',
    bio: 'Creative visionary focused on bold branding and high-impact visual communications.',
    portfolio: []
  }
];

export const WORKSHOPS = [
  {
    id: 'w1',
    title: 'Mastering React Server Components',
    instructor: 'Marcus Chen',
    category: 'Coding',
    price: '$49',
    date: 'Oct 24, 2023',
    duration: '3 Hours',
    rating: 4.9,
    image: 'https://picsum.photos/seed/react/600/400',
    participants: 12,
    maxParticipants: 20
  },
  {
    id: 'w2',
    title: 'Introduction to Brand Identity',
    instructor: 'Sarah Jenkins',
    category: 'Design',
    price: 'Free',
    date: 'Oct 28, 2023',
    duration: '1.5 Hours',
    rating: 4.7,
    image: 'https://picsum.photos/seed/brand/600/400',
    participants: 45,
    maxParticipants: 100
  }
];
