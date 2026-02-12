import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

// Helper to read data
async function getProjects() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper to write data
async function saveProjects(projects: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const projects = await getProjects();
  // Sort by sortOrder ASC
  projects.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, projectUrl, tags, prdUrl, categories, sortOrder } = body;

    const projects = await getProjects();
    const newProject = {
      id: uuidv4(),
      title,
      description,
      imageUrl: imageUrl || '',
      projectUrl: projectUrl || '#',
      tags: tags || [],
      prdUrl: prdUrl || '',
      category: (categories && categories[0]) || '全部作品', // Legacy support
      categories: categories || ['全部作品'],
      sortOrder: sortOrder || 0,
      views: 0, 
      createdAt: new Date().toISOString(),
    };

    projects.unshift(newProject);
    await saveProjects(projects);

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
