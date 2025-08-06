import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, Settings, Mail, Copy, Link, Plus, Edit, 
  Crown, Shield, User, ChevronLeft, FolderOpen,
  Calendar, Clock, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Layout from '@/components/Layout/Layout';
import toast from 'react-hot-toast';

const TeamDetail = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [inviteEmails, setInviteEmails] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  // Mock team data - in real app, this would come from API
  const team = {
    id: parseInt(teamId || '1'),
    name: 'Design Team',
    description: 'Creating beautiful and intuitive user experiences for our products',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    memberCount: 8,
    projectCount: 12,
    createdDate: '2024-01-15',
    teamCode: 'DT-2024-001',
    inviteLink: `https://teamsphere.com/invite/${teamId}`,
    members: [
      { id: 1, name: 'Alice Johnson', email: 'alice@company.com', role: 'Admin', avatar: '', joinedDate: '2024-01-15' },
      { id: 2, name: 'Bob Smith', email: 'bob@company.com', role: 'Member', avatar: '', joinedDate: '2024-01-20' },
      { id: 3, name: 'Carol Davis', email: 'carol@company.com', role: 'Member', avatar: '', joinedDate: '2024-02-01' },
      { id: 4, name: 'David Wilson', email: 'david@company.com', role: 'Member', avatar: '', joinedDate: '2024-02-10' },
      { id: 5, name: 'Eve Brown', email: 'eve@company.com', role: 'Editor', avatar: '', joinedDate: '2024-02-15' },
      { id: 6, name: 'Frank Miller', email: 'frank@company.com', role: 'Member', avatar: '', joinedDate: '2024-03-01' },
      { id: 7, name: 'Grace Taylor', email: 'grace@company.com', role: 'Editor', avatar: '', joinedDate: '2024-03-10' },
      { id: 8, name: 'Henry Clark', email: 'henry@company.com', role: 'Member', avatar: '', joinedDate: '2024-03-15' }
    ],
    projects: [
      { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 75, dueDate: '2024-08-15' },
      { id: 2, name: 'Mobile App UI', status: 'Planning', progress: 25, dueDate: '2024-09-01' },
      { id: 3, name: 'Brand Guidelines', status: 'Completed', progress: 100, dueDate: '2024-07-30' },
      { id: 4, name: 'Design System', status: 'In Progress', progress: 60, dueDate: '2024-08-30' }
    ]
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'Editor':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendInvites = () => {
    if (!inviteEmails.trim()) {
      toast.error('Please enter at least one email address');
      return;
    }

    const emailList = inviteEmails.split(',').filter(email => email.trim());
    toast.success(`Invites sent to ${emailList.length} ${emailList.length === 1 ? 'person' : 'people'}!`);
    setInviteEmails('');
    setIsInviteDialogOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(team.inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(team.teamCode);
    toast.success('Team code copied to clipboard!');
  };

  const handleLeaveTeam = () => {
    toast.success(`You have left ${team.name}`);
    navigate('/teams');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/teams')}
            className="shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-16 h-16 rounded-xl ${team.color} flex items-center justify-center text-white font-bold text-2xl`}>
              {team.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-poppins font-bold text-gray-900">
                {team.name}
              </h1>
              <p className="text-gray-600 mt-1">{team.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Members
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-poppins font-bold">Invite Team Members</DialogTitle>
                  <DialogDescription>
                    Add new members to {team.name} by email or share the invite link.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <Label htmlFor="inviteEmails" className="text-sm font-medium text-gray-700">
                      Email Addresses
                    </Label>
                    <Textarea
                      id="inviteEmails"
                      placeholder="Enter email addresses separated by commas"
                      value={inviteEmails}
                      onChange={(e) => setInviteEmails(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate multiple emails with commas
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Share Invite Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={team.inviteLink}
                        readOnly
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleCopyLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Team Code</Label>
                    <div className="flex gap-2">
                      <Input
                        value={team.teamCode}
                        readOnly
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleCopyCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSendInvites} className="btn-gradient flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invites
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsInviteDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Team
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLeaveTeam} className="text-red-600">
                  <Users className="h-4 w-4 mr-2" />
                  Leave Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Team Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Team Members */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-poppins font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Members ({team.members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <p className="text-xs text-gray-500">Joined {new Date(member.joinedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(member.role)}
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Projects */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-poppins font-semibold flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2" />
                  Team Projects ({team.projects.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg ${team.color} flex items-center justify-center text-white font-bold`}>
                          {project.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{project.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {project.progress}% complete
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(project.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Team Stats & Actions */}
          <div className="space-y-6">
            {/* Team Stats */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-poppins font-semibold">Team Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-semibold">{team.memberCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-semibold">{team.projectCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Team Created</span>
                  <span className="font-semibold">{new Date(team.createdDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Team Code</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{team.teamCode}</span>
                    <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-poppins font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full btn-gradient" onClick={handleCopyLink}>
                  <Link className="h-4 w-4 mr-2" />
                  Share Invite Link
                </Button>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Team Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamDetail;