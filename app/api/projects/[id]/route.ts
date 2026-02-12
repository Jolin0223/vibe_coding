import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

async function getProjects() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveProjects(projects: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
}

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    let projects = await getProjects();
    const initialLength = projects.length;
    projects = projects.filter((p: any) => p.id !== id);

    if (projects.length === initialLength) {
        return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    await saveProjects(projects);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const { title, description, imageUrl, projectUrl, tags, prdUrl, categories, sortOrder } = body;

    const projects = await getProjects();
    const index = projects.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    // Update fields
    projects[index] = {
      ...projects[index],
      title: title || projects[index].title,
      description: description || projects[index].description,
      imageUrl: imageUrl || projects[index].imageUrl,
      projectUrl: projectUrl || projects[index].projectUrl,
      tags: tags !== undefined ? tags : projects[index].tags,
      prdUrl: prdUrl !== undefined ? prdUrl : projects[index].prdUrl,
      category: categories !== undefined ? (categories[0] || '全部作品') : projects[index].category, // Legacy
      categories: categories !== undefined ? categories : (projects[index].categories || [projects[index].category]),
      sortOrder: sortOrder !== undefined ? sortOrder : (projects[index].sortOrder || 0),
    };

    await saveProjects(projects);

    return NextResponse.json({ success: true, project: projects[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
