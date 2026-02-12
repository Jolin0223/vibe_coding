import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    
    // Read data
    const fileContents = await fs.readFile(filePath, 'utf8');
    const projects = JSON.parse(fileContents);
    
    // Find and update project
    const projectIndex = projects.findIndex((p: any) => p.id === id);
    
    if (projectIndex === -1) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }
    
    // Increment views
    projects[projectIndex].views = (projects[projectIndex].views || 0) + 1;
    
    // Write back
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      views: projects[projectIndex].views 
    });
  } catch (error) {
    console.error('Error updating views:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
