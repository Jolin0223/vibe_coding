"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

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

export default function ProjectCard({ project }: { project: Project }) {
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const descRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (descRef.current) {
      setIsTruncated(descRef.current.scrollHeight > descRef.current.clientHeight);
    }
  }, [project.description]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const handlePrdClick = (e: React.MouseEvent) => {
    if (!project.prdUrl) {
      e.preventDefault();
      showToast("敬请期待");
    }
  };
  
  const handleViewIncrement = async () => {
    try {
      fetch(`/api/projects/${project.id}/view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to increment view count', error);
    }
  };

  return (
    <div className="group bg-white rounded-[12px] overflow-hidden border border-[#F1F5F9] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row h-auto md:h-[180px] w-full max-w-[608px] relative z-0 hover:z-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800/90 text-white px-4 py-2 rounded-lg text-sm shadow-xl backdrop-blur-sm animate-fade-in-down">
          {toast.message}
        </div>
      )}

      {/* Project Image */}
      <div className="relative w-full md:w-[321px] h-48 md:h-full flex-shrink-0 bg-slate-100 overflow-hidden rounded-l-[12px]">
        <Image
          src={project.imageUrl || "/background.png"}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Project Content */}
      <div className="p-4 flex flex-col flex-grow justify-between min-w-0 relative">
        <div>
            <div className="flex justify-between items-start mb-0">
                <Link
                    href={project.projectUrl}
                    target="_blank"
                    onClick={handleViewIncrement}
                    className="block transition-colors truncate w-full"
                >
                    <h3 className="text-[14px] font-medium text-[#3D3D3D] leading-[20px] truncate" title={project.title}>
                    {project.title}
                    </h3>
                </Link>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
                {project.tags && project.tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-[#EFF6FF] px-2 py-0.5 rounded-[2.7px] gap-1">
                        <span className="text-[10.8px] text-[#3B82F6] font-medium leading-[20px]">{tag}</span>
                    </div>
                ))}
            </div>
            
            {/* Description */}
            <div className="relative group/desc w-full mb-2">
                <p 
                    ref={descRef}
                    className="text-[12px] text-[rgba(61,61,61,0.7)] leading-[20px] line-clamp-2 h-[40px] w-full"
                >
                    {project.description}
                </p>
                {isTruncated && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[280px] p-3 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 text-xs rounded-xl shadow-2xl opacity-0 group-hover/desc:opacity-100 transition-all duration-200 pointer-events-none z-[9999] text-left">
                        {project.description}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white/95"></div>
                    </div>
                )}
            </div>

            {/* Divider Line */}
            <div className="w-full h-[1px] bg-[#D8D8D8] mb-2"></div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-3">
             <Link
                href={project.prdUrl || '#'}
                target={project.prdUrl ? "_blank" : "_self"}
                onClick={handlePrdClick}
                className="text-[14px] text-[#3D3D3D] hover:text-blue-600 flex items-center justify-center gap-1 transition-colors bg-white w-[107px] h-[31px] rounded-[31px] border"
                style={{ borderColor: 'rgba(169, 171, 173, 0.3)' }}
            >
                AI PRD -&gt;
            </Link>
          </div>

          <Link
            href={project.projectUrl}
            target="_blank"
            onClick={handleViewIncrement}
            className="flex items-center gap-1 text-[14px] text-white font-medium"
          >
             <div className="relative flex items-center justify-center w-[107px] h-[31px] rounded-[31px] hover:-translate-y-0.5 transition-transform"
                  style={{
                      background: 'linear-gradient(90deg, #5B86FF 0%, #2D9CFF 100%)',
                      boxShadow: '0px 0.69px 1.03px -0.69px rgba(0, 0, 0, 0.1), 0px 1.72px 2.57px -0.51px rgba(0, 0, 0, 0.1)'
                  }}
             >
                 体验demo -&gt;
             </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
