import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  Settings,
  Mail,
  Copy,
  Link,
  Plus,
  Edit,
  Crown,
  Shield,
  User,
  ChevronLeft,
  FolderOpen,
  Calendar,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Layout from "@/components/Layout/Layout";
import toast from "react-hot-toast";

const TeamDetail = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState("");
  const [inviteList, setInviteList] = useState([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch team details from backend
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://teamsphere-springboot.onrender.com/api/teams/${teamId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch team details");
        const data = await res.json();
        setTeam(data);
        console.log("Fetched team details:", data);
      } catch (err) {
        toast.error(err.message || "Error loading team");
        navigate("/teams");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [teamId, navigate]);

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "Editor":
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(team.inviteLink);
    toast.success("Invite link copied to clipboard!");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(team.teamCode);
    toast.success("Team code copied to clipboard!");
  };

  const handleLeaveTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://teamsphere-springboot.onrender.com/api/teams/${teamId}/leave`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to leave team");
      toast.success(`You have left ${team.name}`);
      navigate("/teams");
    } catch (err) {
      toast.error(err.message || "Error leaving team");
    }
  };

  // Invite Members logic
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleAddEmail = () => {
    if (!emailInput.trim()) return;
    if (!validateEmail(emailInput)) {
      toast.error("Invalid email address");
      return;
    }
    if (inviteList.includes(emailInput.trim())) {
      toast.error("Email already added");
      return;
    }
    setInviteList([...inviteList, emailInput.trim()]);
    setEmailInput("");
  };

  const handleRemoveEmail = (email) => {
    setInviteList(inviteList.filter((e) => e !== email));
  };

  const handleSendInvites = async () => {
    if (inviteList.length === 0) {
      toast.error("Please add at least one email");
      return;
    }
    console.log("Sending invites to:", inviteList);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://teamsphere-springboot.onrender.com/api/teams/${teamId}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ members: inviteList }),
        }
      );

      if (!res.ok) throw new Error("Failed to send invites");

      toast.success(
        `Invites sent to ${inviteList.length} ${
          inviteList.length === 1 ? "person" : "people"
        }!`
      );
      setInviteList([]);
      setIsInviteDialogOpen(false);
    } catch (err) {
      toast.error(err.message || "Error sending invites");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8 text-center">Loading team details...</div>
      </Layout>
    );
  }

  if (!team) {
    return (
      <Layout>
        <div className="p-8 text-center text-red-500">Team not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/teams")}
            className="shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4 flex-1">
            <div
              className={`w-16 h-16 rounded-xl ${team.teamColor} flex items-center justify-center text-white font-bold text-2xl`}
            >
              {team.teamName[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-poppins font-bold text-gray-900">
                {team.teamName}
              </h1>
              <p className="text-gray-600 mt-1">{team.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog
              open={isInviteDialogOpen}
              onOpenChange={setIsInviteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="btn-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Members
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-poppins font-bold">
                    Invite Team Members
                  </DialogTitle>
                  <DialogDescription>
                    Add new members to {team.teamName} by entering their emails.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Email input + add button */}
                  <div>
                    <Label
                      htmlFor="inviteEmail"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="inviteEmail"
                        placeholder="Enter email address"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                      />
                      <Button variant="outline" onClick={handleAddEmail}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* List of added emails */}
                  {inviteList.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {inviteList.map((email, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 border rounded-md"
                        >
                          <span>{email}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveEmail(email)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSendInvites}
                      className="btn-gradient flex-1"
                      disabled={inviteList.length === 0}
                    >
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
                <DropdownMenuItem
                  onClick={handleLeaveTeam}
                  className="text-red-600"
                >
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
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {team.members.map((memberEmail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {memberEmail.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {memberEmail}
                          </p>
                          <p className="text-sm text-gray-600">{memberEmail}</p>
                          <p className="text-xs text-gray-500">
                            Joined Recently
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(
                          memberEmail === team.createdBy ? "Admin" : "Member"
                        )}
                        <Badge variant="outline" className="text-xs">
                          {memberEmail === team.createdBy ? "Admin" : "Member"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Team Stats & Actions */}
          <div className="space-y-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-poppins font-semibold">
                  Team Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-semibold">{team.members.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-semibold">{team.projectCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Team Created</span>
                  <span className="font-semibold">
                    {new Date(team.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Team Code</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{team.teamCode}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyCode}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamDetail;
