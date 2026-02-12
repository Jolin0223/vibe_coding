"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Zap } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import ProcessFlow from "@/components/ProcessFlow";

// 核心改动1：直接导入本地JSON文件（替换API请求）
import initialProjects from '@/data/projects.json';

// Define Project Type
type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  views: number;
  createdAt?: string;
  tags?: string[];
  prdUrl?: string;
  category?: string;
  categories?: string[];
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("全部作品");
  const [loading, setLoading] = useState(true);

  // 核心改动2：替换API请求为读取本地JSON
  useEffect(() => {
    const loadLocalProjects = async () => {
      try {
        // 直接使用导入的本地JSON数据
        if (Array.isArray(initialProjects)) {
          setProjects(initialProjects);
          setFilteredProjects(initialProjects);
        } else {
          console.error("JSON文件格式错误，不是数组:", initialProjects);
          setProjects([]);
          setFilteredProjects([]);
        }
      } catch (error) {
        console.error("加载本地作品数据失败", error);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadLocalProjects();
  }, []);

  // 保留原有分类过滤逻辑（无需改动）
  useEffect(() => {
    if (activeCategory === "全部作品") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => {
          if (p.categories && p.categories.length > 0) {
              return p.categories.includes(activeCategory);
          }
          return p.category === activeCategory;
      }));
    }
  }, [activeCategory, projects]);

  const defaultCategories = ["全部作品"];
  // Collect all unique categories from projects
  const projectCategories = Array.from(new Set(projects.flatMap(p => p.categories || (p.category ? [p.category] : [])).filter(Boolean)));
  // Merge default "全部作品" with other categories
  const categories = Array.from(new Set([...defaultCategories, ...projectCategories]));

  // Helper to count projects in a category
  const getCategoryCount = (categoryName: string) => {
      if (categoryName === "全部作品") return projects.length;
      return projects.filter(p => {
          if (p.categories && p.categories.length > 0) {
              return p.categories.includes(categoryName);
          }
          return p.category === categoryName;
      }).length;
  };

  return (
    <main className="min-h-screen relative flex flex-col font-sans text-slate-900 selection:bg-purple-200">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
         {/* CSS Gradient Background as requested */}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 mx-auto px-4 md:px-8 py-4 flex-grow flex flex-col max-w-[1280px]">
        {/* Navbar */}
        <nav className="flex justify-between items-center mb-6 h-[80px]">
            <div className="flex items-center gap-[7px]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(90deg, #5B86FF 0%, #2D9CFF 100%)', boxShadow: '0px 0.69px 1.03px -0.69px rgba(0, 0, 0, 0.1), 0px 1.72px 2.57px -0.51px rgba(0, 0, 0, 0.1)' }}>
                    <Zap size={18} fill="currentColor" />
                </div>
                <span className="text-[20px] font-bold text-[#1E293B] tracking-tight">AI产品实验室</span>
            </div>
            
            <div className="flex items-center gap-6 text-[14px] font-medium text-[#465467]">
                 <Link href="/admin/login" target="_blank" className="hover:text-blue-600 transition-colors">管理后台</Link>
                 <div className="h-4 w-px bg-[#A9ABAD]"></div>
                 <div className="flex items-center gap-[5px]">
                    <div className="w-[30px] h-[30px] rounded-full bg-slate-200 overflow-hidden relative border border-white shadow-sm">
                         <Image src="/avatar.png" alt="Avatar" fill className="object-cover" /> 
                    </div>
                    <span>佳玲</span>
                 </div>
            </div>
        </nav>

        {/* Hero Section */}
        <header className="mb-6 text-center max-w-4xl mx-auto mt-2 flex flex-col items-center">
          <h1 className="text-4xl md:text-[48px] font-extrabold mb-8 tracking-tight leading-[60px]" style={{ color: '#0F172A' }}>
            Jolin's <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #5B86FF 0%, #2D9CFF 100%)' }}>AI-Native Product Lab</span>
          </h1>
          <div className="flex flex-col items-center max-w-[826px] mx-auto text-center gap-[10px]">
             <p className="text-lg md:text-[20px] font-medium leading-[28px]" style={{ color: '#3D3D3D' }}>
            告别空想与低效沟通，以 AI 为笔，重构教育产品工作流。
          </p>
          <p className="text-sm md:text-[20px] font-light leading-[28px]" style={{ color: '#64748B' }}>
            在这里，见证我如何利用 Vibe Coding 将灵感光速落地，让产品在文档诞生前就已触手可及。
          </p>
          </div>
        </header>

        {/* Process Flow */}
        <ProcessFlow />

        {/* Categories */}
        <div className="flex justify-center mb-4 w-full mt-[-20px]">
            <div className="flex gap-[40px] text-sm font-medium text-slate-600">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`transition-all duration-300 ${
                            activeCategory === cat
                                ? "text-transparent bg-clip-text font-extrabold text-[20.8px] leading-[48px]" // Selected state
                                : "text-[#3D3D3D] text-[19.2px] leading-[28px] hover:text-slate-900" // Unselected state
                        }`}
                        style={activeCategory === cat ? { backgroundImage: 'linear-gradient(90deg, #5B86FF 0%, #2D9CFF 100%)' } : {}}
                    >
                        {activeCategory === cat ? `${cat} (${getCategoryCount(cat)})` : cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Projects Section */}
        <div className="min-h-[600px]">
            {loading ? (
                 <div className="col-span-full text-center py-20">
                    <p className="text-slate-400">Loading projects...</p>
                 </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="col-span-full text-center py-20 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm">
                    <p className="text-xl text-slate-400">暂时还没有该类别的作品展示，敬请期待！</p>
                </div>
            )}
        </div>
        
        {/* Footer */}
        <footer className="mt-auto py-8 text-center text-slate-400 text-xs md:text-sm">
            <p>&copy; 2026 Jolin's AI-Native Product Lab. Built with Vibe Coding.</p>
        </footer>
      </div>
    </main>
  );
}
