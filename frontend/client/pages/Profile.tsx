import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  Edit,
  Award,
  Users,
  Briefcase,
  Code,
  Lightbulb,
  Eye,
  MessageCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";

interface Skill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  years: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: "Completed" | "In Progress" | "Planning";
  equity: string;
  duration: string;
  skills: string[];
  founderName?: string;
  partnerName?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "certification" | "project" | "milestone" | "recognition";
}

export default function Profile() {
  // Determine user type from URL or context (in real app would come from auth)
  const userType =
    window.location.pathname.includes("entrepreneur") ||
    localStorage.getItem("userType") === "entrepreneur"
      ? "entrepreneur"
      : "developer";

  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app would come from API
  const userData = {
    entrepreneur: {
      name: "Priya Sharma",
      initials: "PS",
      title: "Serial Entrepreneur & Ed-Tech Innovator",
      location: "Mumbai, India",
      joinDate: "January 2023",
      email: "priya@email.com",
      phone: "+91 98765 43210",
      bio: "Passionate entrepreneur with 5+ years of experience in ed-tech. Founded two successful startups and looking to build the next generation of educational technology. I believe in empowering developers with equity partnerships to create innovative solutions.",
      stats: {
        ideasPosted: 8,
        collaborations: 12,
        totalEquityOffered: "15.5%",
        successfulProjects: 5,
      },
      skills: [
        { name: "Product Strategy", level: "Expert" as const, years: 6 },
        { name: "Market Research", level: "Advanced" as const, years: 5 },
        { name: "Team Leadership", level: "Expert" as const, years: 7 },
        { name: "Fundraising", level: "Advanced" as const, years: 4 },
        { name: "Business Development", level: "Expert" as const, years: 6 },
      ],
      projects: [
        {
          id: "1",
          title: "AI-Powered Education Platform",
          description:
            "Building an intelligent tutoring system that adapts to individual learning styles",
          status: "In Progress" as const,
          equity: "12%",
          duration: "8 months",
          skills: ["AI/ML", "Frontend", "Backend"],
          partnerName: "John Developer",
        },
        {
          id: "2",
          title: "Learning Analytics Dashboard",
          description: "Data visualization tool for educational institutions",
          status: "Completed" as const,
          equity: "8%",
          duration: "6 months",
          skills: ["Data Analytics", "React", "D3.js"],
          partnerName: "Sarah Chen",
        },
      ],
      achievements: [
        {
          id: "1",
          title: "Top Entrepreneur 2023",
          description: "Recognized by TechCrunch as emerging entrepreneur",
          date: "December 2023",
          type: "recognition" as const,
        },
        {
          id: "2",
          title: "Successful Exit",
          description: "Successfully sold EdTech startup to major corporation",
          date: "August 2023",
          type: "milestone" as const,
        },
      ],
    },
    developer: {
      name: "John Developer",
      initials: "JD",
      title: "Full-Stack Developer & Startup Enthusiast",
      location: "Bangalore, India",
      joinDate: "December 2022",
      email: "john@email.com",
      phone: "+91 98765 43210",
      bio: "Passionate full-stack developer with 4+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. I love working with startups and earning equity while building innovative products that make a difference.",
      stats: {
        projectsCompleted: 7,
        collaborations: 5,
        totalEquityEarned: "22%",
        avgRating: 4.8,
      },
      skills: [
        { name: "React", level: "Expert" as const, years: 4 },
        { name: "Node.js", level: "Advanced" as const, years: 3 },
        { name: "TypeScript", level: "Advanced" as const, years: 3 },
        { name: "AWS", level: "Intermediate" as const, years: 2 },
        { name: "PostgreSQL", level: "Advanced" as const, years: 3 },
      ],
      projects: [
        {
          id: "1",
          title: "FinTech for Rural India",
          description:
            "Mobile-first financial platform for underserved communities",
          status: "Completed" as const,
          equity: "10%",
          duration: "4 months",
          skills: ["React Native", "Node.js", "MongoDB"],
          founderName: "Vikram Singh",
        },
        {
          id: "2",
          title: "Health Monitoring App",
          description: "IoT-connected health tracking application",
          status: "In Progress" as const,
          equity: "3.5%",
          duration: "6 months",
          skills: ["React", "IoT", "Machine Learning"],
          founderName: "Dr. Sarah Chen",
        },
      ],
      achievements: [
        {
          id: "1",
          title: "AWS Certified Solutions Architect",
          description: "Professional level certification",
          date: "November 2023",
          type: "certification" as const,
        },
        {
          id: "2",
          title: "Project Excellence Award",
          description: "Delivered FinTech app 2 weeks ahead of schedule",
          date: "September 2023",
          type: "recognition" as const,
        },
      ],
    },
  };

  const data = userData[userType];

  const getSkillColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-green-100 text-green-800";
      case "Advanced":
        return "bg-blue-100 text-blue-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "certification":
        return <BadgeCheck className="w-5 h-5 text-blue-600" />;
      case "project":
        return <Briefcase className="w-5 h-5 text-green-600" />;
      case "milestone":
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      case "recognition":
        return <Award className="w-5 h-5 text-yellow-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  {userType === "entrepreneur" ? (
                    <Lightbulb className="w-5 h-5 text-white" />
                  ) : (
                    <Code className="w-5 h-5 text-white" />
                  )}
                </div>
                <span className="text-xl font-bold text-navy">
                  Skill Invest
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                to={`/${userType}-dashboard`}
                className="flex items-center space-x-2 text-gray-600 hover:text-navy transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/settings"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Link>
              <div className="w-8 h-8 bg-skyblue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {data.initials}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
            {/* Profile Picture & Basic Info */}
            <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
              <div className="w-32 h-32 bg-gradient-to-br from-skyblue to-navy rounded-full flex items-center justify-center text-white font-bold text-4xl mb-4">
                {data.initials}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  Verified Profile
                </span>
              </div>
              {userType === "developer" && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{data.stats.avgRating}</span>
                  <span className="text-gray-500 text-sm">(24 reviews)</span>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-navy mb-2">
                    {data.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">{data.title}</p>
                </div>
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View Public Profile</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{data.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {data.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{data.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{data.phone}</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{data.bio}</p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 text-gray-400 hover:text-skyblue transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 text-gray-400 hover:text-skyblue transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 text-gray-400 hover:text-skyblue transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 text-gray-400 hover:text-skyblue transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {userType === "entrepreneur" ? (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-skyblue mb-2">
                  {data.stats.ideasPosted}
                </div>
                <div className="text-gray-600">Ideas Posted</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {data.stats.collaborations}
                </div>
                <div className="text-gray-600">Collaborations</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {data.stats.totalEquityOffered}
                </div>
                <div className="text-gray-600">Total Equity Offered</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-navy mb-2">
                  {data.stats.successfulProjects}
                </div>
                <div className="text-gray-600">Successful Projects</div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-skyblue mb-2">
                  {data.stats.projectsCompleted}
                </div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {data.stats.collaborations}
                </div>
                <div className="text-gray-600">Collaborations</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {data.stats.totalEquityEarned}
                </div>
                <div className="text-gray-600">Total Equity Earned</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">
                  {data.stats.avgRating}
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "overview"
                    ? "border-skyblue text-skyblue"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "skills"
                    ? "border-skyblue text-skyblue"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "projects"
                    ? "border-skyblue text-skyblue"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "achievements"
                    ? "border-skyblue text-skyblue"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Achievements
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-navy mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium">
                          {userType === "entrepreneur"
                            ? "New proposal received"
                            : "Project milestone completed"}
                        </p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium">
                          {userType === "entrepreneur"
                            ? "Message from developer"
                            : "Message from founder"}
                        </p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-500 mt-1" />
                      <div>
                        <p className="font-medium">
                          {userType === "entrepreneur"
                            ? "Contract signed"
                            : "Proposal submitted"}
                        </p>
                        <p className="text-sm text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-navy mb-4">
                    Top Skills
                  </h3>
                  <div className="space-y-3">
                    {data.skills.slice(0, 3).map((skill, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              {skill.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {skill.years} years
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-skyblue h-2 rounded-full"
                              style={{
                                width:
                                  skill.level === "Expert"
                                    ? "100%"
                                    : skill.level === "Advanced"
                                      ? "80%"
                                      : skill.level === "Intermediate"
                                        ? "60%"
                                        : "40%",
                              }}
                            ></div>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillColor(skill.level)}`}
                        >
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-navy">
                    Skills & Expertise
                  </h3>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>Edit Skills</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {data.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-navy">
                            {skill.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {skill.years} years of experience
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillColor(skill.level)}`}
                        >
                          {skill.level}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-skyblue h-3 rounded-full transition-all duration-300"
                          style={{
                            width:
                              skill.level === "Expert"
                                ? "100%"
                                : skill.level === "Advanced"
                                  ? "80%"
                                  : skill.level === "Intermediate"
                                    ? "60%"
                                    : "40%",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-navy">
                    {userType === "entrepreneur"
                      ? "My Projects"
                      : "Project Portfolio"}
                  </h3>
                  <Link
                    to={
                      userType === "entrepreneur"
                        ? "/post-idea"
                        : "/developer-dashboard"
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      {userType === "entrepreneur"
                        ? "Post New Idea"
                        : "Find Projects"}
                    </span>
                  </Link>
                </div>

                <div className="space-y-6">
                  {data.projects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-navy">
                              {project.title}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-skyblue/10 text-skyblue text-sm rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Equity:</span>
                          <p className="font-semibold text-skyblue">
                            {project.equity}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <p className="font-semibold">{project.duration}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            {userType === "entrepreneur"
                              ? "Partner:"
                              : "Founder:"}
                          </span>
                          <p className="font-semibold">
                            {userType === "entrepreneur"
                              ? project.partnerName
                              : project.founderName}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-3 mt-4">
                        <button className="flex items-center space-x-2 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          <span>View Live</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-navy">
                    Achievements & Recognition
                  </h3>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Award className="w-4 h-4" />
                    <span>Add Achievement</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {data.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-start space-x-4 p-6 border border-gray-200 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                        {getAchievementIcon(achievement.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-navy mb-2">
                          {achievement.title}
                        </h4>
                        <p className="text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{achievement.date}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              achievement.type === "certification"
                                ? "bg-blue-100 text-blue-800"
                                : achievement.type === "project"
                                  ? "bg-green-100 text-green-800"
                                  : achievement.type === "milestone"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {achievement.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
