import { useState } from 'react';
import { Users, Plus, Search, Filter, MoreHorizontal, UserPlus, Settings, Star, FolderOpen, Palette, Mail, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Layout from '@/components/Layout/Layout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Teams = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('bg-gradient-to-br from-blue-500 to-purple-500');
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');

  const teams = [
    {
      id: 1,
      name: 'Design Team',
      description: 'Creating beautiful and intuitive user experiences',
      memberCount: 8,
      projectCount: 12,
      avatar: '/teams/design.png',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      members: [
        { name: 'Alice', avatar: '/avatars/alice.png' },
        { name: 'Bob', avatar: '/avatars/bob.png' },
        { name: 'Carol', avatar: '/avatars/carol.png' }
      ],
      isStarred: true,
      role: 'Admin'
    },
    {
      id: 2,
      name: 'Engineering',
      description: 'Building robust and scalable solutions',
      memberCount: 15,
      projectCount: 8,
      avatar: '/teams/engineering.png',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      members: [
        { name: 'David', avatar: '/avatars/david.png' },
        { name: 'Eve', avatar: '/avatars/eve.png' },
        { name: 'Frank', avatar: '/avatars/frank.png' }
      ],
      isStarred: false,
      role: 'Member'
    },
    {
      id: 3,
      name: 'Marketing',
      description: 'Driving growth and engagement',
      memberCount: 6,
      projectCount: 15,
      avatar: '/teams/marketing.png',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      members: [
        { name: 'Grace', avatar: '/avatars/grace.png' },
        { name: 'Henry', avatar: '/avatars/henry.png' }
      ],
      isStarred: true,
      role: 'Member'
    },
    {
      id: 4,
      name: 'Product',
      description: 'Defining product strategy and roadmap',
      memberCount: 5,
      projectCount: 6,
      avatar: '/teams/product.png',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      members: [
        { name: 'Ivy', avatar: '/avatars/ivy.png' },
        { name: 'Jack', avatar: '/avatars/jack.png' }
      ],
      isStarred: false,
      role: 'Admin'
    },
    {
      id: 5,
      name: 'Sales',
      description: 'Building relationships and closing deals',
      memberCount: 10,
      projectCount: 20,
      avatar: '/teams/sales.png',
      color: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      members: [
        { name: 'Kate', avatar: '/avatars/kate.png' },
        { name: 'Liam', avatar: '/avatars/liam.png' },
        { name: 'Mia', avatar: '/avatars/mia.png' }
      ],
      isStarred: false,
      role: 'Member'
    },
    {
      id: 6,
      name: 'Support',
      description: 'Helping customers succeed',
      memberCount: 7,
      projectCount: 5,
      avatar: '/teams/support.png',
      color: 'bg-gradient-to-br from-teal-500 to-blue-500',
      members: [
        { name: 'Noah', avatar: '/avatars/noah.png' },
        { name: 'Olivia', avatar: '/avatars/olivia.png' }
      ],
      isStarred: true,
      role: 'Member'
    }
  ];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    // Simulate team creation with invite emails
    const emailCount = inviteEmails.length;
    const successMessage = emailCount > 0 
      ? `Team "${newTeamName}" created successfully! Invites sent to ${emailCount} ${emailCount === 1 ? 'person' : 'people'}.`
      : `Team "${newTeamName}" created successfully!`;
    
    toast.success(successMessage);
    setNewTeamName('');
    setNewTeamDescription('');
    setInviteEmails([]);
    setCurrentEmail('');
    setNewTeamColor('bg-gradient-to-br from-blue-500 to-purple-500');
    setIsCreateDialogOpen(false);
  };

  const handleAddEmail = () => {
    if (!currentEmail.trim()) return;
    
    if (!/\S+@\S+\.\S+/.test(currentEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (inviteEmails.includes(currentEmail)) {
      toast.error('Email already added');
      return;
    }
    
    setInviteEmails([...inviteEmails, currentEmail]);
    setCurrentEmail('');
    toast.success('Email added to invite list');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter(email => email !== emailToRemove));
    toast.success('Email removed from invite list');
  };

  const handleViewTeam = (teamId: number, teamName: string) => {
    navigate(`/teams/${teamId}`);
  };

  const handleJoinTeam = (teamName: string) => {
    toast.success(`Joined ${teamName} successfully!`);
  };

  const handleStarTeam = (teamId: number, teamName: string, isStarred: boolean) => {
    if (isStarred) {
      toast.success(`Removed ${teamName} from favorites`);
    } else {
      toast.success(`Added ${teamName} to favorites`);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
              Teams
            </h1>
            <p className="text-gray-600">
              Collaborate with your teams and manage projects together
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle className="text-2xl font-poppins font-bold">Create New Team</DialogTitle>
                <DialogDescription>
                  Start collaborating with a new team. You can invite members immediately.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-6">
                <div>
                  <Label htmlFor="teamName" className="text-sm font-medium text-gray-700">
                    Team Name *
                  </Label>
                  <Input
                    id="teamName"
                    placeholder="Enter team name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="teamDescription" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="teamDescription"
                    placeholder="What does this team work on?"
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center mb-3">
                    <Palette className="h-4 w-4 mr-2" />
                    Team Color
                  </Label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      'bg-gradient-to-br from-blue-500 to-purple-500',
                      'bg-gradient-to-br from-purple-500 to-pink-500',
                      'bg-gradient-to-br from-orange-500 to-red-500',
                      'bg-gradient-to-br from-green-500 to-emerald-500',
                      'bg-gradient-to-br from-cyan-500 to-blue-500',
                      'bg-gradient-to-br from-indigo-500 to-purple-500',
                      'bg-gradient-to-br from-teal-500 to-cyan-500',
                      'bg-gradient-to-br from-rose-500 to-pink-500'
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTeamColor(color)}
                        className={`w-12 h-12 rounded-lg ${color} ring-2 ring-offset-2 transition-all ${
                          newTeamColor === color ? 'ring-primary' : 'ring-transparent'
                        } hover:scale-105`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                    <Mail className="h-4 w-4 mr-2" />
                    Invite Members (Optional)
                  </Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter email address"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                        className="flex-1"
                      />
                      <Button 
                        type="button"
                        onClick={handleAddEmail}
                        variant="outline"
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {inviteEmails.length > 0 && (
                      <div className="max-h-24 overflow-y-auto">
                        <div className="space-y-2">
                          {inviteEmails.map((email, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                              <span className="text-sm text-gray-700">{email}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEmail(email)}
                                className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      {inviteEmails.length === 0 ? 'Add emails one by one' : `${inviteEmails.length} email(s) added`}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={handleCreateTeam} 
                    className="btn-gradient flex-1"
                  >
                    Create Team
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="glass-card border-white/20 hover:scale-105 transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${team.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-poppins font-semibold group-hover:gradient-text transition-all duration-300">
                        {team.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {team.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStarTeam(team.id, team.name, team.isStarred)}
                      className={team.isStarred ? 'text-yellow-500' : 'text-gray-400'}
                    >
                      <Star className={`h-4 w-4 ${team.isStarred ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite Members
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {team.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {team.memberCount} members
                    </span>
                    <span className="flex items-center">
                      <FolderOpen className="h-4 w-4 mr-1" />
                      {team.projectCount} projects
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 3).map((member, idx) => (
                      <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="bg-gradient-primary text-white text-xs">
                          {member.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {team.memberCount > 3 && (
                      <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{team.memberCount - 3}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewTeam(team.id, team.name)}
                    className="hover:bg-primary hover:text-white transition-colors"
                  >
                    View Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">
              No teams found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first team'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="btn-gradient"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Team
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Teams;