import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

const TABLE_NAME = 'jolin_vibecoding_projects';
export const runtime = 'edge'; // 👉 新增这一行

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    // 1. 先查出当前的浏览量
    const { data: project, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select('views')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const currentViews = project?.views || 0;

    // 2. 将浏览量 +1 并更新回数据库，同时返回最新浏览量
    const { data, error: updateError } = await supabase
      .from(TABLE_NAME)
      .update({ views: currentViews + 1 })
      .eq('id', id)
      .select('views')
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      views: data.views 
    });
  } catch (error: any) {
    console.error("增加浏览量失败:", error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}