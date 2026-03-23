import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase'; // 确保你按之前的步骤建了这个文件

const TABLE_NAME = 'jolin_vibecoding_projects';
export const dynamic = 'force-dynamic';

// GET: 获取所有项目
export async function GET() {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('sortOrder', { ascending: true })
      .order('createdAt', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("获取项目失败:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: 新增一个项目
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 兼容原有的分类逻辑
    if (!body.category && body.categories && body.categories.length > 0) {
       body.category = body.categories[0];
    }
    if (!body.categories) body.categories = ['全部作品'];
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([body])
      .select();

    if (error) throw error;
    
    return NextResponse.json({ success: true, project: data[0] });
  } catch (error: any) {
    console.error("新增项目失败:", error);
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}