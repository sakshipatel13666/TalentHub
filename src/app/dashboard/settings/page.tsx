"use client";

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Loader2, Save, ArrowLeft, Camera, Upload, Wand2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { aiContentAssistant } from '@/ai/flows/ai-content-assistant';

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profilePhotoUrl: '',
    emailNotifications: true,
    jobAlerts: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        profilePhotoUrl: profile.profilePhotoUrl || '',
        emailNotifications: profile.emailNotifications ?? true,
        jobAlerts: profile.jobAlerts ?? true,
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhotoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRefineBioWithAI = async () => {
    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your name first so the AI can personalize your bio.",
      });
      return;
    }

    setIsGeneratingBio(true);
    try {
      const result = await aiContentAssistant({
        contentType: 'bio',
        context: `User name is ${formData.name}. They are a creative professional on TalentHub.`,
        currentText: formData.bio,
        desiredLength: 'medium',
      });
      
      setFormData(prev => ({ ...prev, bio: result.generatedContent }));
      toast({
        title: "Bio generated!",
        description: "AI has drafted a new bio for you. Don't forget to save changes.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: "Failed to generate bio. Please try again later.",
      });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSave = () => {
    if (!userRef) return;
    setIsSaving(true);

    updateDocumentNonBlocking(userRef, {
      ...formData,
      updatedAt: new Date().toISOString(),
    });

    // Simulate a brief delay for UI feedback
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your profile has been updated successfully.",
      });
    }, 500);
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full rounded-[2rem] border-none shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">Authentication Required</CardTitle>
              <CardDescription>Please log in to access your settings.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full h-12 rounded-xl font-bold">
                <Link href="/auth">Login to Continue</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Link>
            </div>
            <h1 className="text-4xl font-headline font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your profile, preferences, and notifications.</p>
          </div>
          <Button onClick={handleSave} className="rounded-xl font-bold gap-2 px-8 h-12 shadow-lg shadow-primary/20" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-full sm:w-auto grid grid-cols-2 sm:flex">
            <TabsTrigger value="profile" className="rounded-xl px-8 font-bold gap-2 data-[state=active]:bg-background">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl px-8 font-bold gap-2 data-[state=active]:bg-background">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline">Public Profile</CardTitle>
                <CardDescription>This information will be displayed publicly on your profile page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div 
                    onClick={triggerFileInput}
                    className="group relative h-32 w-32 rounded-3xl overflow-hidden bg-secondary flex items-center justify-center border-4 border-white shadow-md shrink-0 cursor-pointer"
                  >
                    {formData.profilePhotoUrl ? (
                      <img src={formData.profilePhotoUrl} alt="Avatar" className="h-full w-full object-cover transition-opacity group-hover:opacity-50" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center talent-gradient text-white text-3xl font-bold group-hover:opacity-50">
                        {formData.name?.[0]?.toUpperCase() || user.email?.[0].toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="rounded-xl h-12" placeholder="Your full name" />
                    </div>
                    <Button variant="outline" size="sm" onClick={triggerFileInput} className="rounded-xl gap-2">
                      <Upload className="h-4 w-4" /> Change Profile Picture
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bio">Bio</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary gap-2 h-8 px-2 hover:bg-primary/5 font-bold"
                      onClick={handleRefineBioWithAI}
                      disabled={isGeneratingBio}
                    >
                      {isGeneratingBio ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="h-3.5 w-3.5" />
                      )}
                      AI Refine Bio
                    </Button>
                  </div>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleInputChange} 
                    placeholder="Tell us about your expertise and what you offer..." 
                    className="rounded-xl min-h-[120px] resize-none" 
                  />
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>Tip: Use the AI Refine button to professionally polish your bio.</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline">Account Information</CardTitle>
                <CardDescription>Private details associated with your login account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={user.email || 'Anonymous'} disabled className="rounded-xl h-12 bg-muted/50 border-dashed" />
                  <p className="text-[10px] text-muted-foreground">Email changes must be initiated through our security portal for your protection.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline">Notification Preferences</CardTitle>
                <CardDescription>Control how and when you want to stay updated.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-border/50">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly digests and platform updates via email.</p>
                  </div>
                  <Switch 
                    checked={formData.emailNotifications} 
                    onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">Job Alerts</Label>
                    <p className="text-sm text-muted-foreground">Immediate notifications when a client sends a hire request.</p>
                  </div>
                  <Switch 
                    checked={formData.jobAlerts} 
                    onCheckedChange={(checked) => handleSwitchChange('jobAlerts', checked)} 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-accent/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Mobile push notifications are coming soon to the TalentHub app.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
