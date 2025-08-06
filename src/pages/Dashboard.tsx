import { Users, FolderOpen, CheckCircle, Clock, TrendingUp, Plus, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout/Layout';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: 'Total Teams',
      value: '12',
      change: '+2.5%',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Active Projects',
      value: '28',
      change: '+12.3%',
      icon: FolderOpen,
      color: 'text-secondary'
    },
    {
      title: 'Completed Tasks',
      value: '1,247',
      change: '+8.1%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Hours Tracked',
      value: '342',
      change: '+3.2%',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'Website Redesign',
      team: 'Design Team',
      progress: 85,
      dueDate: '2024-08-15',
      status: 'On Track',
      members: [
        { name: 'Alice', avatar: '/avatars/alice.png' },
        { name: 'Bob', avatar: '/avatars/bob.png' },
        { name: 'Carol', avatar: '/avatars/carol.png' }
      ]
    },
    {
      id: 2,
      name: 'Mobile App Development',
      team: 'Engineering',
      progress: 62,
      dueDate: '2024-08-25',
      status: 'In Progress',
      members: [
        { name: 'David', avatar: '/avatars/david.png' },
        { name: 'Eve', avatar: '/avatars/eve.png' }
      ]
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      team: 'Marketing',
      progress: 45,
      dueDate: '2024-09-01',
      status: 'At Risk',
      members: [
        { name: 'Frank', avatar: '/avatars/frank.png' },
        { name: 'Grace', avatar: '/avatars/grace.png' },
        { name: 'Henry', avatar: '/avatars/henry.png' },
        { name: 'Ivy', avatar: '/avatars/ivy.png' }
      ]
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Alice Johnson',
      action: 'completed task',
      target: 'Homepage wireframes',
      time: '2 hours ago',
      avatar: '/avatars/alice.png'
    },
    {
      id: 2,
      user: 'Bob Smith',
      action: 'commented on',
      target: 'API Documentation',
      time: '4 hours ago',
      avatar: '/avatars/bob.png'
    },
    {
      id: 3,
      user: 'Carol Davis',
      action: 'created project',
      target: 'Q4 Planning',
      time: '6 hours ago',
      avatar: '/avatars/carol.png'
    },
    {
      id: 4,
      user: 'David Wilson',
      action: 'joined team',
      target: 'Frontend Development',
      time: '1 day ago',
      avatar: '/avatars/david.png'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'At Risk':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your teams and projects today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card border-white/20 hover:scale-105 transition-transform duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  {stat.change}
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-poppins font-semibold">
                  Recent Projects
                </CardTitle>
                <Button 
                  className="btn-gradient"
                  onClick={() => navigate('/projects')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-4 rounded-lg bg-white/50 border border-white/20 hover:bg-white/70 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.team}</p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, idx) => (
                          <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                            <AvatarFallback className="bg-gradient-primary text-white text-xs">
                              {member.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.members.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{project.members.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">Due {project.dueDate}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Progress value={project.progress} className="flex-1" />
                      <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-poppins font-semibold">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-primary text-white text-sm">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card border-white/20 mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-poppins font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start btn-gradient"
                  onClick={() => navigate('/teams')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Team
                </Button>
                <Button 
                  className="w-full justify-start btn-gradient-secondary"
                  onClick={() => navigate('/projects')}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Start New Project
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.success('Analytics coming soon!')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;