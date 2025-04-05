import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // --- Filter/Sort Params ---
  const filterPriority = searchParams.get('filterPriority'); // 'high', 'medium', 'low'
  const sortBy = searchParams.get('sortBy'); // 'createdAt', 'priority'
  const sortOrder = searchParams.get('sortOrder')?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'; // Default DESC

  // Validate userId
  if (!userId || isNaN(parseInt(userId))) {
    return NextResponse.json({ error: 'Valid userId query parameter is required' }, { status: 400 });
  }
  const userIdInt = parseInt(userId);

  // --- Build Dynamic Query ---
  let baseQuery = 'SELECT * FROM todos WHERE user_id = $1';
  const queryParams = [userIdInt];
  let paramIndex = 2; // Start next param index at $2

  // Filtering
  if (filterPriority && ['high', 'medium', 'low'].includes(filterPriority)) {
    baseQuery += ` AND priority = $${paramIndex++}`;
    queryParams.push(filterPriority);
  }

  // Sorting
  let orderByClause = 'ORDER BY ';
  if (sortBy === 'priority') {
    // Custom order for priority: High (1) > Medium (2) > Low (3) or vice-versa
    const priorityOrder = sortOrder === 'ASC'
      ? "CASE priority WHEN 'low' THEN 1 WHEN 'medium' THEN 2 WHEN 'high' THEN 3 ELSE 4 END"
      : "CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END";
    orderByClause += `${priorityOrder}, created_at DESC`; // Secondary sort by date
  } else {
    orderByClause += `created_at ${sortOrder}`;
  }
  baseQuery += ` ${orderByClause}`;

  console.log("Executing Query:", baseQuery, queryParams);

  try {
    const result = await query(baseQuery, queryParams);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch todos', details: error.message },
      { status: 500 }
    );
  }
}

// POST function
export async function POST(request) {
    try {
      const body = await request.json();
      const { title, description, priority, user_id } = body;

      if (user_id === undefined || user_id === null || isNaN(parseInt(user_id))) {
        return NextResponse.json(
          { error: 'Valid user_id is required in the request body' },
          { status: 400 }
        );
      }

      if (!title || title.trim() === '') {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }

      const insertQuery = `
        INSERT INTO todos (title, description, priority, user_id)
        VALUES ($1, $2, $3, $4) RETURNING *
      `;
      const values = [
          title,
          description || null,
          priority || 'medium',
          parseInt(user_id)
      ];

      const result = await query(insertQuery, values);
      return NextResponse.json(result.rows[0], { status: 201 });

    } catch (error) {
      if (error.code === '23503') {
          console.error('Foreign Key Violation:', error.detail);
          const userIdMatch = error.detail?.match(/\((\d+)\)/);
          const invalidUserId = userIdMatch ? userIdMatch[1] : 'provided';
          return NextResponse.json(
              {
                  error: 'Failed to add todo: Invalid user ID.',
                  details: `User with ID ${invalidUserId} does not exist.`
              },
              { status: 400 }
          );
      }
      return NextResponse.json(
          { error: 'Failed to add todo', details: error.message },
          { status: 500 }
      );
    }
  }