import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

const TABLE_NAME = 'jolin_vibecoding_projects';
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // 👉 就是缺了这一行！

// DELETE: 删除项目
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("删除项目失败:", error);
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}

// PUT: 更新项目
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(body)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: data[0] });
  } catch (error: any) {
    console.error("更新项目失败:", error);
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}