import { createClient } from '@supabase/supabase-js';

// 通过环境变量获取 URL 和 Key，避免硬编码在代码里
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);