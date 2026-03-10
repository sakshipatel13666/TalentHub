export const CATEGORIES = [
  { id: 'coding', name: 'Coding', icon: 'Code' },
  { id: 'design', name: 'Design', icon: 'Palette' },
  { id: 'music', name: 'Music', icon: 'Music' },
  { id: 'photo', name: 'Photography', icon: 'Camera' },
  { id: 'fitness', name: 'Fitness', icon: 'Dumbbell' },
  { id: 'marketing', name: 'Marketing', icon: 'Megaphone' },
];

export const TALENTS = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'UI/UX Designer',
    rating: 4.9,
    reviews: 124,
    skills: ['Figma', 'Prototyping', 'User Research'],
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
    rating: 4.8,
    reviews: 89,
    skills: ['React', 'Node.js', 'PostgreSQL'],
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
    rating: 5.0,
    reviews: 56,
    skills: ['Commercial', 'Editing', 'Lighting'],
    price: '$120/hr',
    image: 'https://picsum.photos/seed/elena/400/400',
    bio: 'Capturing the essence of brands through striking visual storytelling and meticulous attention to detail.',
    portfolio: [
      'https://picsum.photos/seed/p5/600/400',
      'https://picsum.photos/seed/p6/600/400',
    ]
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
