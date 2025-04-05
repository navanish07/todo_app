import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/todos/[id] - Fetch a single todo by ID AND its related notes
export async function GET(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  const { id } = params;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Valid Todo ID is required" }, { status: 400 });
  }
  const todoId = parseInt(id);

  try {
    // Query 1: Fetch the main todo
    const todoRes = await query("SELECT * FROM todos WHERE id = $1", [todoId]);

    if (todoRes.rows.length === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    const todo = todoRes.rows[0];

    // Query 2: Fetch related notes
    const notesRes = await query("SELECT * FROM notes WHERE todo_id = $1 ORDER BY created_at DESC", [todoId]);
    todo.notes = notesRes.rows;

    // Placeholders for additional data
    todo.tags = [];
    todo.assigned_users = []; 

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch todo details', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  const { id } = params;

  console.log(`--- PUT HANDLER ENTERED FOR /api/todos/${id} ---`);

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Valid Todo ID is required" }, { status: 400 });
  }
  const todoId = parseInt(id);

  try {
    const body = await request.json();
    const { title, description, priority, completed } = body;

    const fields = [];
    const values = [];
    let index = 1;

    if (title !== undefined) { fields.push(`title = $${index++}`); values.push(title); }
    if (description !== undefined) { fields.push(`description = $${index++}`); values.push(description || null); }
    if (priority !== undefined) {
      if (['low', 'medium', 'high'].includes(priority)) {
        fields.push(`priority = $${index++}`); values.push(priority);
      } else {
        return NextResponse.json({ error: "Invalid priority value" }, { status: 400 });
      }
    }
    if (completed !== undefined) {
      if (typeof completed === 'boolean') {
        fields.push(`completed = $${index++}`); values.push(completed);
      } else {
        return NextResponse.json({ error: "Invalid completed value (must be true or false)" }, { status: 400 });
      }
    }
    if (fields.length === 0) {
      return NextResponse.json({ error: "No valid fields provided to update" }, { status: 400 });
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    const updateQuery = `UPDATE todos SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;
    values.push(todoId);

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Todo not found or no changes made" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23514') {
      return NextResponse.json({ error: "Invalid value provided for a field (e.g., priority)", details: error.message }, { status: 400 });
    }
    console.error("Error in PUT /api/todos/[id]:", error);
    return NextResponse.json(
      { error: 'Failed to update todo', details: error.message }, { status: 500 }
    );
  }
}

export async function DELETE(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  const { id } = params;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Valid Todo ID is required" }, { status: 400 });
  }
  const todoId = parseInt(id);

  try {
    const result = await query("DELETE FROM todos WHERE id = $1 RETURNING id", [todoId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete todo', details: error.message }, { status: 500 }
    );
  }
}