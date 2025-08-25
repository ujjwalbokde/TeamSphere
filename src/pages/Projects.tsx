import { useState,useEffect } from 'react';
import { FolderOpen, Plus, Search, Filter, Calendar, Users, MoreHorizontal, Star, Clock, CalendarDays, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Layout from '@/components/Layout/Layout';
import toast from 'react-hot-toast';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState('');

  // const teams = [
  //   { id: 1, name: 'Design Team' },
  //   { id: 2, name: 'Engineering' },
  //   { id: 3, name: 'Marketing' },
  //   { id: 4, name: 'Product' },
  //   { id: 5, name: 'Sales' },
  //   { id: 6, name: 'Support' }
  // ];
   const [teams, setTeams] = useState([]);
  
    const fetchMyTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please login again.");
        }
  
        const res = await fetch("http://localhost:8080/api/teams/my-teams", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
  
        const data = await res.json();
        console.log("Raw My Teams:", data);
  
        // ✅ Map backend keys to frontend shape
        const mappedTeams = data.map((team) => ({
          id: team.id,
          name: team.teamName,
          description: team.description || "No description provided",
          color:
            team.teamColor || "bg-gradient-to-br from-blue-500 to-purple-500",
          members: team.members || [],
          memberCount: team.members ? team.members.length : 0,
          projectCount: team.projectCount || 0, // if backend doesn’t send this, default 0
          role: team.role || "Member",
          isStarred: team.isStarred || false,
          createdBy: team.createdBy || "Unknown",
        }));
  
        setTeams(mappedTeams);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };
  
    useEffect(() => {
      fetchMyTeams();
    }, []);

    const [projects, setProjects] = useState([]);
  // const projects = [
  //   {
  //     id: 1,
  //     name: 'Website Redesign',
  //     description: 'Complete overhaul of the company website with modern design',
  //     team: 'Design Team',
  //     status: 'In Progress',
  //     priority: 'High',
  //     progress: 85,
  //     dueDate: '2024-08-15',
  //     createdDate: '2024-07-01',
  //     members: [
  //       { name: 'Alice', avatar: '/avatars/alice.png' },
  //       { name: 'Bob', avatar: '/avatars/bob.png' },
  //       { name: 'Carol', avatar: '/avatars/carol.png' }
  //     ],
  //     isStarred: true,
  //     color: 'bg-gradient-to-br from-purple-500 to-pink-500',
  //     tasks: { total: 24, completed: 20 }
  //   },
  //   {
  //     id: 2,
  //     name: 'Mobile App Development',
  //     description: 'Native mobile app for iOS and Android platforms',
  //     team: 'Engineering',
  //     status: 'In Progress',
  //     priority: 'High',
  //     progress: 62,
  //     dueDate: '2024-09-30',
  //     createdDate: '2024-06-15',
  //     members: [
  //       { name: 'David', avatar: '/avatars/david.png' },
  //       { name: 'Eve', avatar: '/avatars/eve.png' },
  //       { name: 'Frank', avatar: '/avatars/frank.png' }
  //     ],
  //     isStarred: false,
  //     color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  //     tasks: { total: 45, completed: 28 }
  //   },
  //   {
  //     id: 3,
  //     name: 'Marketing Campaign Q4',
  //     description: 'Comprehensive marketing strategy for Q4 product launch',
  //     team: 'Marketing',
  //     status: 'Planning',
  //     priority: 'Medium',
  //     progress: 25,
  //     dueDate: '2024-10-01',
  //     createdDate: '2024-07-20',
  //     members: [
  //       { name: 'Grace', avatar: '/avatars/grace.png' },
  //       { name: 'Henry', avatar: '/avatars/henry.png' }
  //     ],
  //     isStarred: true,
  //     color: 'bg-gradient-to-br from-orange-500 to-red-500',
  //     tasks: { total: 18, completed: 4 }
  //   },
  //   {
  //     id: 4,
  //     name: 'API Documentation',
  //     description: 'Complete API documentation with examples and guides',
  //     team: 'Engineering',
  //     status: 'Completed',
  //     priority: 'Low',
  //     progress: 100,
  //     dueDate: '2024-07-30',
  //     createdDate: '2024-07-01',
  //     members: [
  //       { name: 'Ivy', avatar: '/avatars/ivy.png' },
  //       { name: 'Jack', avatar: '/avatars/jack.png' }
  //     ],
  //     isStarred: false,
  //     color: 'bg-gradient-to-br from-green-500 to-emerald-500',
  //     tasks: { total: 12, completed: 12 }
  //   },
  //   {
  //     id: 5,
  //     name: 'Customer Support Portal',
  //     description: 'Self-service portal for customer support and knowledge base',
  //     team: 'Support',
  //     status: 'On Hold',
  //     priority: 'Medium',
  //     progress: 40,
  //     dueDate: '2024-11-15',
  //     createdDate: '2024-06-01',
  //     members: [
  //       { name: 'Kate', avatar: '/avatars/kate.png' },
  //       { name: 'Liam', avatar: '/avatars/liam.png' },
  //       { name: 'Mia', avatar: '/avatars/mia.png' }
  //     ],
  //     isStarred: false,
  //     color: 'bg-gradient-to-br from-teal-500 to-blue-500',
  //     tasks: { total: 30, completed: 12 }
  //   },
  //   {
  //     id: 6,
  //     name: 'Data Analytics Dashboard',
  //     description: 'Real-time analytics dashboard for business intelligence',
  //     team: 'Product',
  //     status: 'In Progress',
  //     priority: 'High',
  //     progress: 75,
  //     dueDate: '2024-08-30',
  //     createdDate: '2024-06-10',
  //     members: [
  //       { name: 'Noah', avatar: '/avatars/noah.png' },
  //       { name: 'Olivia', avatar: '/avatars/olivia.png' }
  //     ],
  //     isStarred: true,
  //     color: 'bg-gradient-to-br from-indigo-500 to-purple-500',
  //     tasks: { total: 36, completed: 27 }
  //   }
  // ];
  //api req for all projects
const fetchProjects = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You must be logged in to view projects");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/projects/my-projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch projects");
    }

    const data = await response.json();
    console.log("Fetched projects (raw):", data);

    // 🔄 normalize backend → frontend
    const mappedProjects = data.map((p) => ({
      id: p.id,
      projectName: p.projectName,
      description: p.description || "No description provided",
      team: p.team?.teamName || "Unknown Team",
      color: p.team?.teamColor || "bg-gradient-to-br from-blue-500 to-purple-500",
      status: "Planning", // 🔧 backend doesn’t send status → fallback
      priority: p.priority
        ? p.priority.charAt(0) + p.priority.slice(1).toLowerCase()
        : "Medium", // HIGH → High
      progress: 0, // 🔧 placeholder until you have tasks tracking
      dueDate: p.endDate,
      members: (p.team?.members || []).map((m) => ({
        name: m.split("@")[0], // take prefix before @ as "name"
        email: m,
      })),
      isStarred: false,
    }));

    setProjects(mappedProjects);
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Something went wrong while fetching projects");
  }
};

  useEffect(() => {
    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterProjects = (status: string) => {
    let filtered = projects;
    
    if (status !== 'all') {
      filtered = projects.filter(project => 
        project.status.toLowerCase().replace(' ', '-') === status
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleStarProject = (projectId: number, projectName: string, isStarred: boolean) => {
    if (isStarred) {
      toast.success(`Removed ${projectName} from favorites`);
    } else {
      toast.success(`Added ${projectName} to favorites`);
    }
  };

const handleCreateProject = async () => {
  if (!newProjectName.trim()) {
    toast.error("Please enter a project name");
    return;
  }
  if (!selectedTeam) {
    toast.error("Please select a team");
    return;
  }
  if (!priority) {
    toast.error("Please select a priority level");
    return;
  }

  try {
    const token = localStorage.getItem("token"); // your JWT
    if (!token) {
      toast.error("You must be logged in to create a project");
      return;
    }

    const response = await fetch(`http://localhost:8080/api/projects/${selectedTeam}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectName: newProjectName,
        description: newProjectDescription,
        teamId: selectedTeam, // required by backend
        priority: priority.toUpperCase(), // backend expects "HIGH"/"MEDIUM"/"LOW"
        startDate,
        endDate,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create project");
    }

    const data = await response.json();
    console.log("Project created:", data);

    toast.success(`Project "${newProjectName}" created successfully!`);
    setNewProjectName("");
    setNewProjectDescription("");
    setSelectedTeam("");
    setStartDate("");
    setEndDate("");
    setPriority("");
    setIsCreateDialogOpen(false);

  } catch (err) {
    console.error(err);
    toast.error(err.message || "Something went wrong while creating project");
  }
};


  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
              Projects
            </h1>
            <p className="text-gray-600">
              Manage and track your team's projects and deliverables
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-poppins font-bold">Create New Project</DialogTitle>
                <DialogDescription>
                  Set up a new project for your team to collaborate on.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                      Project Name *
                    </Label>
                    <Input
                      id="projectName"
                      placeholder="Enter project name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="projectDescription" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="projectDescription"
                      placeholder="What is this project about?"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                      <Users className="h-4 w-4 mr-2" />
                      Team *
                    </Label>
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                      <Flag className="h-4 w-4 mr-2" />
                      Priority *
                    </Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      End Date
                    </Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreateProject} className="btn-gradient flex-1">
                    Create Project
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
              placeholder="Search projects..."
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="on-hold">On Hold</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterProjects(activeTab).map((project) => (
                <Card key={project.id} className="glass-card border-white/20 hover:scale-105 transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg ${project.color} flex items-center justify-center text-white font-bold text-lg`}>
                          {project.projectName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-poppins font-semibold group-hover:gradient-text transition-all duration-300 truncate">
                            {project.projectName}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{project.team}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStarProject(project.id, project.name, project.isStarred)}
                          className={project.isStarred ? 'text-yellow-500' : 'text-gray-400'}
                        >
                          <Star className={`h-4 w-4 ${project.isStarred ? 'fill-current' : ''}`} />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FolderOpen className="h-4 w-4 mr-2" />
                              Open Project
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Manage Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                    
                    {/* <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div> */}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {getDaysUntilDue(project.dueDate)} days left
                      </span>
                      {/* <span>{project.tasks.completed}/{project.tasks.total} tasks</span> */}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, idx) => (
                          <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                            <AvatarFallback className="bg-gradient-primary text-white text-xs">
                              {member.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.members.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{project.members.length - 3}</span>
                          </div>
                        )}
                      </div>
                      
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/projects/${project.id}/board`}
                          className="hover:bg-primary hover:text-white transition-colors"
                        >
                          View Board
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filterProjects(activeTab).length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : `No ${activeTab === 'all' ? '' : activeTab.replace('-', ' ')} projects yet`
                  }
                </p>
                {!searchTerm && activeTab === 'all' && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-gradient">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Projects;