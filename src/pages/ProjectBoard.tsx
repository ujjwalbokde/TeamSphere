import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Users,
  Calendar,
  Flag,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  User,
  Edit3,
  Trash2,
  MessageSquare,
  Paperclip,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Layout from "@/components/Layout/Layout";
import toast from "react-hot-toast";

const ProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [tasks, setTasks] = useState([]);

  // Mock project data - in real app, this would come from API
  // const project = {
  //   id: projectId,
  //   name: 'Website Redesign',
  //   description: 'Complete overhaul of the company website with modern design',
  //   team: 'Design Team',
  //   status: 'In Progress',
  //   priority: 'High',
  //   progress: 85,
  //   dueDate: '2024-08-15',
  //   createdDate: '2024-07-01',
  //   members: [
  //     { id: 1, name: 'Alice Johnson', email: 'alice@company.com', role: 'Lead Designer', avatar: '/avatars/alice.png' },
  //     { id: 2, name: 'Bob Smith', email: 'bob@company.com', role: 'UI Designer', avatar: '/avatars/bob.png' },
  //     { id: 3, name: 'Carol Davis', email: 'carol@company.com', role: 'UX Researcher', avatar: '/avatars/carol.png' }
  //   ],
  //   color: 'bg-gradient-to-br from-purple-500 to-pink-500'
  // };

  const [project, setProject] = useState(null);
  //fetch project using projectId
  const fetchProject = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to view this project");
      return;
    }

    const res = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      toast.error("Failed to fetch project");
      return;
    }

    const data = await res.json();
    console.log("Fetched Project:", data);
    const normalized = {
      id: data.id,
      name: data.projectName,
      description: data.description || "No description",
      color:
        data.team?.teamColor || "bg-gradient-to-br from-blue-500 to-purple-500",
      members: (data.team?.members || []).map((email: string, idx: number) => ({
        id: idx,
        name: email.split("@")[0], // take prefix as name
        email,
      })),
      team: data.team?.teamName || "Unknown Team",
      priority: data.priority
        ? data.priority.charAt(0) + data.priority.slice(1).toLowerCase()
        : "Medium",
      dueDate: data.endDate,
    };
    setProject(normalized);
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:8080/api/projects/${projectId}/tasks`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      toast.error("Failed to fetch tasks");
      return;
    }

    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchTasks();
    }
  }, [projectId]);

  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "border-gray-300",
      bgColor: "bg-gray-50",
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "border-blue-300",
      bgColor: "bg-blue-50",
    },
    {
      id: "completed",
      title: "Completed",
      color: "border-green-300",
      bgColor: "bg-green-50",
    },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    if (!newTaskAssignee) {
      toast.error("Please assign the task to someone");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:8080/api/projects/${projectId}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          assignee: newTaskAssignee,
          priority: newTaskPriority || "Medium",
          dueDate: newTaskDueDate,
        }),
      }
    );

    if (!res.ok) {
      toast.error("Failed to create task");
      return;
    }

    toast.success(`Task "${newTaskTitle}" created successfully!`);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskAssignee("");
    setNewTaskPriority("");
    setNewTaskDueDate("");
    setIsCreateTaskOpen(false);

    fetchTasks(); // refresh list
  };

  const handleTaskAction = (taskId: number, action: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      toast.success(`Task "${task.title}" ${action}`);
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDeleteTask = async (taskId: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:8080/api/projects/${projectId}/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      toast.error("Failed to delete task");
      return;
    }

    toast.success("Task deleted successfully");
    fetchTasks(); // refresh list
  };

  const handleStatusChange = async (taskId: number) => {
    const token = localStorage.getItem("token");
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus =
      task.status === "completed" ? "in-progress" : "completed";

    const res = await fetch(
      `http://localhost:8080/api/projects/${projectId}/tasks/${taskId}`,
      {
        method: "PUT",  
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!res.ok) {
      toast.error("Failed to update task status");
      return;
    }

    toast.success(`Task "${task.title}" marked as ${newStatus}`);
    fetchTasks(); // refresh list
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasks = tasks.length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh] text-gray-600">
          Loading project...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/projects")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-lg ${project.color} flex items-center justify-center text-white font-bold text-lg`}
              >
                {project.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-poppins font-bold text-gray-900">
                  {project.name}
                </h1>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </div>
          </div>

          <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle className="text-2xl font-poppins font-bold">
                  Create New Task
                </DialogTitle>
                <DialogDescription>
                  Add a new task to the project board.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <Label
                    htmlFor="taskTitle"
                    className="text-sm font-medium text-gray-700"
                  >
                    Task Title *
                  </Label>
                  <Input
                    id="taskTitle"
                    placeholder="Enter task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="taskDescription"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="taskDescription"
                    placeholder="What needs to be done?"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                      <User className="h-4 w-4 mr-2" />
                      Assignee *
                    </Label>
                    <Select
                      value={newTaskAssignee}
                      onValueChange={setNewTaskAssignee}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {project.members.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Due Date
                  </Label>
                  <Input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCreateTask}
                    className="btn-gradient flex-1"
                  >
                    Create Task
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateTaskOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {progressPercentage}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <Progress value={progressPercentage} className="mt-3" />
            </CardContent>
          </Card> */}

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalTasks}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <Circle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {completedTasks}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Team Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.members.length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div
                className={`rounded-lg border-2 ${column.color} ${column.bgColor} p-4`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {column.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {getTasksByStatus(column.id).length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {getTasksByStatus(column.id).map((task) => (
                    <Card
                      key={task.id}
                      className="glass-card border-white/20 hover:shadow-lg transition-all duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-900 line-clamp-2 flex-1">
                            {task.title}
                          </h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* <DropdownMenuItem
                                onClick={() =>
                                  handleTaskAction(task.id, "opened")
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem> */}
                              {/* <DropdownMenuItem
                                onClick={() =>
                                  handleTaskAction(task.id, "edited")
                                }
                              >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit Task
                              </DropdownMenuItem> */}
                              
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(task.id)
                                }
                              >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Mark as {column.id === "completed" ? "In Progress" : "Completed"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteTask(task.id)
                                }
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Task
                              </DropdownMenuItem>

                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </Badge>

                          {task.dueDate && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {getDaysUntilDue(task.dueDate) === 0
                                ? "Today"
                                : getDaysUntilDue(task.dueDate) === 1
                                ? "Tomorrow"
                                : getDaysUntilDue(task.dueDate) > 0
                                ? `${getDaysUntilDue(task.dueDate)} days`
                                : `${Math.abs(
                                    getDaysUntilDue(task.dueDate)
                                  )} days overdue`}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gradient-primary text-white text-xs">
                              {task.assignee.slice(0,1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {task.comments > 0 && (
                              <div className="flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {task.comments}
                              </div>
                            )}
                            {task.attachments > 0 && (
                              <div className="flex items-center">
                                <Paperclip className="h-3 w-3 mr-1" />
                                {task.attachments}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectBoard;
