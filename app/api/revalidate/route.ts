import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  try {
    // Revalidate the main pages
    revalidatePath('/');
    revalidatePath('/latestnews');
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: (err as Error).message }, { status: 500 });
  }
} 