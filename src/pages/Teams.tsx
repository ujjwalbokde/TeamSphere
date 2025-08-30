import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Settings,
  Star,
  FolderOpen,
  Palette,
  Mail,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [newTeamColor, setNewTeamColor] = useState(
    "bg-gradient-to-br from-blue-500 to-purple-500"
  );
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [teams, setTeams] = useState([]);

  const fetchMyTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const res = await fetch("https://teamsphere-springboot.onrender.com/api/teams/my-teams", {
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
  //error showing null.Lowercase

  const filteredTeams = teams.filter(
    (team) =>
      (team && team.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (team &&
        team.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // ✅ grab JWT
      if (!token) {
        toast.error("You must be logged in");
        return;
      }

      const payload = {
        teamName: newTeamName,
        description: newTeamDescription,
        teamColor: newTeamColor,
        members: inviteEmails, // array of emails
      };

      const response = await fetch("https://teamsphere-springboot.onrender.com/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ send JWT
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create team");
      }

      const data = await response.json();
      console.log("Team created:", data);

      // ✅ success message
      const emailCount = inviteEmails.length;
      const successMessage =
        emailCount > 0
          ? `Team "${newTeamName}" created successfully! Invites sent to ${emailCount} ${
              emailCount === 1 ? "person" : "people"
            }.`
          : `Team "${newTeamName}" created successfully!`;

      toast.success(successMessage);

      // reset fields
      setNewTeamName("");
      setNewTeamDescription("");
      setInviteEmails([]);
      setCurrentEmail("");
      setNewTeamColor("bg-gradient-to-br from-blue-500 to-purple-500");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error(error.message || "Something went wrong");
    }
  };
  const [userInfo, setUserInfo] = useState(null);
  //call /me route for user info
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in");
        return;
      }

      const res = await fetch('https://teamsphere-springboot.onrender.com/user/me', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to fetch user info");
      }

      const data = await res.json();
      console.log("User info:", data);
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error(error.message || "Something went wrong");
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleAddEmail = () => {
    if (!currentEmail.trim()) return;

    if (!/\S+@\S+\.\S+/.test(currentEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (inviteEmails.includes(currentEmail)) {
      toast.error("Email already added");
      return;
    }

    setInviteEmails([...inviteEmails, currentEmail]);
    setCurrentEmail("");
    toast.success("Email added to invite list");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter((email) => email !== emailToRemove));
    toast.success("Email removed from invite list");
  };

  const handleViewTeam = (teamId: string) => {

    navigate(`/teams/${teamId}`);
  };

  const handleJoinTeam = (teamName: string) => {
    toast.success(`Joined ${teamName} successfully!`);
  };

  const handleStarTeam = (
    teamId: number,
    teamName: string,
    isStarred: boolean
  ) => {
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

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="btn-gradient mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle className="text-2xl font-poppins font-bold">
                  Create New Team
                </DialogTitle>
                <DialogDescription>
                  Start collaborating with a new team. You can invite members
                  immediately.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-6">
                <div>
                  <Label
                    htmlFor="teamName"
                    className="text-sm font-medium text-gray-700"
                  >
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
                  <Label
                    htmlFor="teamDescription"
                    className="text-sm font-medium text-gray-700"
                  >
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
                      "bg-gradient-to-br from-blue-500 to-purple-500",
                      "bg-gradient-to-br from-purple-500 to-pink-500",
                      "bg-gradient-to-br from-orange-500 to-red-500",
                      "bg-gradient-to-br from-green-500 to-emerald-500",
                      "bg-gradient-to-br from-cyan-500 to-blue-500",
                      "bg-gradient-to-br from-indigo-500 to-purple-500",
                      "bg-gradient-to-br from-teal-500 to-cyan-500",
                      "bg-gradient-to-br from-rose-500 to-pink-500",
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTeamColor(color)}
                        className={`w-12 h-12 rounded-lg ${color} ring-2 ring-offset-2 transition-all ${
                          newTeamColor === color
                            ? "ring-primary"
                            : "ring-transparent"
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
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddEmail()
                        }
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
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                            >
                              <span className="text-sm text-gray-700">
                                {email}
                              </span>
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
                      {inviteEmails.length === 0
                        ? "Add emails one by one"
                        : `${inviteEmails.length} email(s) added`}
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
            <Card
              key={team.id}
              className="glass-card border-white/20 hover:scale-105 transition-all duration-300 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-lg ${team.color} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-poppins font-semibold group-hover:gradient-text transition-all duration-300">
                        {team.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {/* {userInfo.email && <span>{userInfo.email}</span>}
                        {team.createdBy && <span>{team.createdBy}</span>} */}
                        {userInfo && userInfo.email === team.createdBy ? "Admin" : "Member"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleStarTeam(team.id, team.name, team.isStarred)
                      }
                      className={
                        team.isStarred ? "text-yellow-500" : "text-gray-400"
                      }
                    >
                      <Star
                        className={`h-4 w-4 ${
                          team.isStarred ? "fill-current" : ""
                        }`}
                      />
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
                    {team.members
                      .slice(0, 3)
                      .map((member: string, idx: number) => (
                        <Avatar
                          key={idx}
                          className="h-8 w-8 border-2 border-white"
                        >
                          <AvatarFallback className="bg-gradient-primary text-white text-xs">
                            {member ? member.slice(0, 1).toUpperCase() : "??"}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    {team.members.length > 3 && (
                      <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          +{team.members.length - 3}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewTeam(team.id)}
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
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first team"}
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
