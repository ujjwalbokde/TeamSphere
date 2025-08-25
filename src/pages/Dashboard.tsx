import { useEffect, useState } from "react";
import { Users, FolderOpen, CheckCircle, Clock, Plus, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout/Layout";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  // fetch teams & projects
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, projectsRes] = await Promise.all([
        fetch("http://localhost:8080/api/teams/my-teams", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8080/api/projects/my-projects", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!teamsRes.ok || !projectsRes.ok) {
        toast.error("Failed to load dashboard data");
        return;
      }

      const teams = await teamsRes.json();
      const projects = await projectsRes.json();

      // calculate stats
      const completedTasks = projects
        .flatMap((p) => p.tasks || [])
        .filter((t) => t.status === "completed").length;

      const hoursTracked = projects.reduce(
        (sum, p) => sum + (p.hoursTracked || 0),
        0
      );

      setStats([
        {
          title: "Total Teams",
          value: teams.length,
          change: "+2.5%",
          icon: Users,
          color: "text-primary",
        },
        {
          title: "Active Projects",
          value: projects.length,
          change: "+12.3%",
          icon: FolderOpen,
          color: "text-secondary",
        },
        {
          title: "Completed Tasks",
          value: completedTasks,
          change: "+8.1%",
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          title: "Hours Tracked",
          value: hoursTracked,
          change: "+3.2%",
          icon: Clock,
          color: "text-orange-600",
        },
      ]);

      setRecentProjects(projects.slice(0, 3)); // show only 3 latest
      console.log(projects)
    } catch (err) {
      console.error(err);
      toast.error("Error loading dashboard");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "At Risk":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your teams and projects today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="glass-card border-white/20 hover:scale-105 transition-transform duration-300"
            >
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-poppins font-semibold">
                  Recent Projects
                </CardTitle>
                <Button className="btn-gradient" onClick={() => navigate("/projects")}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProjects.map((project, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-white/50 border border-white/20 hover:bg-white/70 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {project.projectName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {project.team.teamName}
                        </p>
                      </div>
                    
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex -space-x-2">
                        {(project.team.members || [])
                          .slice(0, 3)
                          .map((member, idx2) => (
                            <Avatar key={idx2} className="h-8 w-8 border-2 border-white">
                              <AvatarFallback className="bg-gradient-primary text-white text-xs">
                                {member.slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        {project.members && project.members.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">
                              +{project.members.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                      
                    </div>

                    
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
