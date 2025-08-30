import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout/Layout';
import {
  User, Camera, Save, Bell, Shield, Palette
} from 'lucide-react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Tabs, TabsContent
} from '@/components/ui/tabs';

const Settings = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    title: '',
    bio: '',
    timezone: '',
    language: 'en'
  });

  // ✅ Fetch user profile from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // or sessionStorage
        const res = await fetch('https://teamsphere-springboot.onrender.com/user/me', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();

        setProfile({
          ...profile,
          fullName: data.name,
          email: data.email,
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
      }
    };

    fetchUser();
  }, []);

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully!');
    // later: send PUT /user/update
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/avatars/user.png" alt="Profile" />
                    <AvatarFallback>
                      {profile.fullName ? profile.fullName[0] : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{profile.fullName}</h3>
                    <p className="text-gray-600">{profile.email}</p>
                    <Badge variant="outline" className="mt-2">User</Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="mt-2"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="mt-2"
                      disabled
                    />
                  </div>
                </div>

                
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
