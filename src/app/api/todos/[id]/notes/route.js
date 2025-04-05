import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request, { params }) {
  const { id } = params; // id of the todo
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
    }

    const insertQuery = `
      INSERT INTO notes (content, todo_id)
      VALUES ($1, $2) RETURNING *
    `;
    const result = await query(insertQuery, [content, id]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
