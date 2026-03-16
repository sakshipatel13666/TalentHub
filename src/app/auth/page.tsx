
"use client";

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const auth = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    initiateEmailSignUp(auth, email, password);
    // Redirection is handled by the AuthSync and general auth state listeners
    router.push('/dashboard');
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    initiateEmailSignIn(auth, email, password);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl talent-gradient text-white font-bold text-2xl mb-4 shadow-lg shadow-primary/20">T</div>
            <h1 className="text-3xl font-headline font-bold">Welcome to TalentHub</h1>
            <p className="text-muted-foreground mt-2">The future of creative work starts here.</p>
          </div>

          <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-none h-14 bg-muted/50 p-1">
                <TabsTrigger value="login" className="rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="p-8 mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" name="email" type="email" placeholder="name@example.com" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Link href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</Link>
                    </div>
                    <Input id="login-password" name="password" type="password" required className="rounded-xl h-12" />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold mt-2" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="p-8 mt-0">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" name="name" placeholder="John Doe" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" name="email" type="email" placeholder="name@example.com" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" name="password" type="password" required className="rounded-xl h-12" />
                  </div>
                  <div className="flex items-center gap-2 py-2">
                    <input type="checkbox" id="terms" required className="rounded border-gray-300 text-primary focus:ring-primary" />
                    <label htmlFor="terms" className="text-xs text-muted-foreground">
                      I agree to the <Link href="#" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                    </label>
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold mt-2" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="px-8 pb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-semibold">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 rounded-xl border-2 font-bold gap-2">
                  <Github className="h-4 w-4" /> Github
                </Button>
                <Button variant="outline" className="h-12 rounded-xl border-2 font-bold gap-2">
                  <Mail className="h-4 w-4" /> Google
                </Button>
              </div>
            </div>
          </Card>
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Want to explore first? <Link href="/explore" className="text-primary font-bold hover:underline">Browse the marketplace</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
