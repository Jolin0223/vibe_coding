"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Upload, Link as LinkIcon, FileText, Plus, Trash2, Edit2, X, Save, Zap, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  tags?: string[];
  prdUrl?: string;
  category?: string;
  categories?: string[];
  sortOrder?: number;
  views: number;
};

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [prdUrl, setPrdUrl] = useState('');
  // Category State
  const [categoryInput, setCategoryInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // For preview/keeping existing
  
  const [projectType, setProjectType] = useState<'url' | 'file'>('file');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectFile, setProjectFile] = useState<File | null>(null);
  
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

  // Helper for showing toast
  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setDescription('');
    setTags('');
    setPrdUrl('');
    setSelectedCategories([]);
    setCategoryInput('');
    setSortOrder(0);
    setImageFile(null);
    setCurrentImageUrl('');
    setProjectUrl('');
    setProjectFile(null);
    setProjectType('file');
  };

  const handleEdit = (project: Project) => {
    setIsEditing(true);
    setCurrentId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTags(project.tags ? project.tags.join(', ') : '');
    setPrdUrl(project.prdUrl || '');
    // Handle categories backward compatibility
    const cats = project.categories || (project.category ? [project.category] : []);
    setSelectedCategories(cats);
    setCategoryInput('');
    setSortOrder(project.sortOrder || 0);
    setCurrentImageUrl(project.imageUrl);
    setProjectUrl(project.projectUrl);
    // Determine if URL is local file or external
    if (project.projectUrl.startsWith('/uploads/')) {
        setProjectType('file');
    } else {
        setProjectType('url');
    }
    
    // Scroll to form
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      alert('Error deleting project');
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalImageUrl = currentImageUrl;
      let finalProjectUrl = projectUrl;

      // Upload Image if changed
      if (imageFile) {
        finalImageUrl = await handleFileUpload(imageFile);
      }

      // Upload Project HTML if selected
      if (projectType === 'file' && projectFile) {
        finalProjectUrl = await handleFileUpload(projectFile);
      }

      const body = {
        title,
        description,
        imageUrl: finalImageUrl,
        projectUrl: finalProjectUrl,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        prdUrl,
        categories: selectedCategories,
        sortOrder: Number(sortOrder),
      };

      let res;
      if (isEditing && currentId) {
        // Update
        res = await fetch(`/api/projects/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        // Create
        res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        resetForm();
        fetchProjects();
        showToast(isEditing ? 'Project updated successfully!' : 'Project added successfully!');
      } else {
        showToast('Failed to save project');
      }
    } catch (error) {
      console.error(error);
      showToast('Error saving project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
      // Simple cookie clearing for demo (in real app, call logout API)
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push('/admin/login');
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-900 bg-slate-50 selection:bg-blue-200">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800/90 text-white px-6 py-3 rounded-xl shadow-2xl backdrop-blur-sm animate-fade-in-down flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            {toast.message}
        </div>
      )}

      {/* Background */}
      <div className="fixed inset-0 z-0">
         <Image
          src="/background.png"
          alt="Background"
          fill
          className="object-cover object-center opacity-20 brightness-110 blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Zap size={20} fill="currentColor" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Vibe Coding Console</h1>
                    <p className="text-xs text-slate-500">Project Management Dashboard</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <Link href="/" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">
                    View Site
                </Link>
                <div className="h-4 w-px bg-slate-300"></div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Projects List Section */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-slate-800">Your Projects ({projects.length})</h2>
            </div>
           
            {loading ? (
              <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="group bg-white/80 backdrop-blur-md rounded-2xl p-4 flex gap-5 border border-white/50 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 relative flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                       <Image 
                        src={project.imageUrl || "/background.png"} 
                        alt={project.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                       />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-grow min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-slate-800 truncate pr-4">{project.title}</h3>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleEdit(project)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                  <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(project.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                  <Trash2 size={16} />
                              </button>
                          </div>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-2">{project.description}</p>
                      <div className="mt-auto flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                            <Zap size={10} /> {project.views} views
                        </span>
                        <a href={project.projectUrl} target="_blank" className="hover:text-blue-600 hover:underline">
                            Open Link
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                
                {projects.length === 0 && (
                    <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-400">No projects yet. Add your first one!</p>
                    </div>
                )}
              </div>
            )}
          </div>

          {/* Form Section */}
          <div ref={formRef} className="lg:col-span-5 order-1 lg:order-2 sticky top-8">
            <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-blue-900/5 border border-white/60">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {isEditing ? <Edit2 size={18} className="text-blue-600" /> : <Plus size={18} className="text-blue-600" />}
                        {isEditing ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    {isEditing && (
                        <button onClick={resetForm} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md transition-colors">
                            <X size={12} /> Cancel
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Image Upload */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cover Image</label>
                    <div className={`relative border-2 border-dashed rounded-xl p-1 transition-colors ${imageFile || currentImageUrl ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100'}`}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                        {imageFile ? (
                             <div className="relative w-full h-full rounded-lg overflow-hidden">
                                <Image src={URL.createObjectURL(imageFile)} alt="Preview" fill className="object-cover" />
                             </div>
                        ) : currentImageUrl ? (
                             <div className="relative w-full h-full rounded-lg overflow-hidden">
                                <Image src={currentImageUrl} alt="Current" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-medium">Click to Change</div>
                             </div>
                        ) : (
                            <>
                                <Upload size={24} className="mb-2" />
                                <span className="text-xs">Click to upload image</span>
                            </>
                        )}
                    </div>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Name</label>
                    <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Super Mario CSS"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Category Multi-select */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedCategories.map(cat => (
                            <span key={cat} className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                {cat}
                                <button type="button" onClick={() => setSelectedCategories(prev => prev.filter(c => c !== cat))} className="hover:text-blue-800">
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                    <input
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (categoryInput.trim() && !selectedCategories.includes(categoryInput.trim())) {
                                    setSelectedCategories(prev => [...prev, categoryInput.trim()]);
                                    setCategoryInput('');
                                }
                            }
                        }}
                        placeholder="Type and press Enter to add..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all mb-2"
                    />
                    {/* Suggested Categories */}
                    <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(projects.flatMap(p => p.categories || (p.category ? [p.category] : [])).filter(c => c && !selectedCategories.includes(c) && !["全部作品"].includes(c)))).map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategories(prev => [...prev, cat])}
                                className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                + {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your masterpiece..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                    />
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tags (comma separated)</label>
                    <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. 2.5h Build, Gemini 3 Pro, Interactive"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 mb-2"
                    />
                    {/* Suggested Tags */}
                    <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(projects.flatMap(p => p.tags || []).filter(t => t && !tags.includes(t)))).slice(0, 10).map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => setTags(prev => prev ? `${prev}, ${tag}` : tag)}
                                className="bg-slate-50 text-slate-500 text-xs px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PRD URL */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PRD Document URL</label>
                    <input
                    type="url"
                    value={prdUrl}
                    onChange={(e) => setPrdUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Sort Order */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sort Order (Lower = First)</label>
                    <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Source Selection */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Source</label>
                    <div className="bg-slate-100 p-1 rounded-xl flex mb-3">
                    <button
                        type="button"
                        onClick={() => setProjectType('file')}
                        className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${projectType === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Upload HTML
                    </button>
                    <button
                        type="button"
                        onClick={() => setProjectType('url')}
                        className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${projectType === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        External URL
                    </button>
                    </div>

                    {projectType === 'file' ? (
                        <div className="relative border border-slate-200 bg-white rounded-xl p-3 flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText size={20} />
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate">
                                    {projectFile ? projectFile.name : (isEditing && projectUrl.startsWith('/uploads/') ? 'Keep existing file' : 'No file chosen')}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {projectFile ? `${(projectFile.size / 1024).toFixed(1)} KB` : 'Supports .html single file'}
                                </p>
                            </div>
                            <input
                                type="file"
                                accept=".html"
                                onChange={(e) => setProjectFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    ) : (
                    <div className="relative">
                        <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="url"
                            value={projectUrl}
                            onChange={(e) => setProjectUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    ) : (
                        <>
                            {isEditing ? <Save size={18} /> : <Plus size={18} />}
                            {isEditing ? 'Save Changes' : 'Create Project'}
                        </>
                    )}
                </button>
                </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
