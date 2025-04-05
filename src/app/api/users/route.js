// src/app/api/users/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    // Query the database for all users - fetch id and username
    const result = await query('SELECT id, username FROM users ORDER BY username', []);
    return NextResponse.json(result.rows);
  } catch (error) {
    // Error is already logged by the query function
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}