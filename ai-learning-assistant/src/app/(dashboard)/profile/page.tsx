"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          console.log('No session found in profile page');
          router.push("/login");
          return;
        }
        
        setUser(session.user);
        
        // Get the user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }
        
        if (profile) {
          setProfile(profile);
          setName(profile.full_name || '');
        }
      } catch (error) {
        console.error('Profile loading error:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfile();
  }, [router]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: name,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading your profile...</p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings.
        </p>
      </div>
      
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6">
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-muted-foreground">
                  Your email cannot be changed
                </p>
              </div>
              
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" disabled>
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start" disabled>
                Notification Settings
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-700" disabled>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-card rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Member since</p>
                <p>{new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Last login</p>
                <p>{new Date(user?.last_sign_in_at || Date.now()).toLocaleDateString()}</p>
              </div>
              
              <Button onClick={handleSignOut} variant="outline" className="w-full mt-4">
                Sign Out
              </Button>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Assessments completed</p>
                <p>0</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Learning plans</p>
                <p>0</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p>0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 