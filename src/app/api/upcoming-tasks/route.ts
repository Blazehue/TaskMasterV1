import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { upcomingTasks, projects } from '@/db/schema'
import { eq, like, and, or, desc, asc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const projectId = searchParams.get('projectId');

    // Single upcoming task by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const task = await db.select()
        .from(upcomingTasks)
        .where(eq(upcomingTasks.id, parseInt(id)))
        .limit(1);

      if (task.length === 0) {
        return NextResponse.json({ error: 'Upcoming task not found' }, { status: 404 });
      }

      return NextResponse.json(task[0]);
    }

    // List upcoming tasks with filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const priority = searchParams.get('priority');
    const sort = searchParams.get('sort') || 'dueDate';
    const order = searchParams.get('order') || 'asc';

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(upcomingTasks.title, `%${search}%`),
          like(upcomingTasks.description, `%${search}%`)
        )
      );
    }

    if (projectId && !isNaN(parseInt(projectId))) {
      conditions.push(eq(upcomingTasks.projectId, parseInt(projectId)));
    }

    if (priority) {
      conditions.push(eq(upcomingTasks.priority, priority));
    }

    // Get sorting column
    const sortColumn = sort === 'title' ? upcomingTasks.title :
                      sort === 'priority' ? upcomingTasks.priority :
                      sort === 'dueDate' ? upcomingTasks.dueDate :
                      sort === 'updatedAt' ? upcomingTasks.updatedAt :
                      upcomingTasks.createdAt;

    const orderBy = order === 'asc' ? asc(sortColumn) : desc(sortColumn);

    // Execute query based on conditions
    const results = conditions.length > 0 
      ? await db.select().from(upcomingTasks)
          .where(and(...conditions))
          .orderBy(orderBy)
          .limit(limit)
          .offset(offset)
      : await db.select().from(upcomingTasks)
          .orderBy(orderBy)
          .limit(limit)
          .offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate projectId exists if provided
    if (body.projectId) {
      if (isNaN(parseInt(body.projectId))) {
        return NextResponse.json({ 
          error: "Valid project ID is required",
          code: "INVALID_PROJECT_ID" 
        }, { status: 400 });
      }

      const project = await db.select()
        .from(projects)
        .where(eq(projects.id, parseInt(body.projectId)))
        .limit(1);

      if (project.length === 0) {
        return NextResponse.json({ 
          error: "Project not found",
          code: "PROJECT_NOT_FOUND" 
        }, { status: 400 });
      }
    }

    // Sanitize and prepare data
    const taskData = {
      title: body.title.trim(),
      description: body.description ? body.description.trim() : null,
      projectId: body.projectId ? parseInt(body.projectId) : null,
      priority: body.priority || 'medium',
      dueDate: body.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newTask = await db.insert(upcomingTasks)
      .values(taskData)
      .returning();

    return NextResponse.json(newTask[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if task exists
    const existingTask = await db.select()
      .from(upcomingTasks)
      .where(eq(upcomingTasks.id, parseInt(id)))
      .limit(1);

    if (existingTask.length === 0) {
      return NextResponse.json({ error: 'Upcoming task not found' }, { status: 404 });
    }

    const body = await request.json();

    // Validate title if provided
    if (body.title !== undefined && (!body.title || body.title.trim() === '')) {
      return NextResponse.json({ 
        error: "Title cannot be empty",
        code: "INVALID_TITLE" 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (body.title !== undefined) {
      updateData.title = body.title.trim();
    }
    if (body.description !== undefined) {
      updateData.description = body.description ? body.description.trim() : null;
    }
    if (body.projectId !== undefined) {
      updateData.projectId = body.projectId ? parseInt(body.projectId) : null;
    }
    if (body.priority !== undefined) {
      updateData.priority = body.priority;
    }
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate;
    }

    const updated = await db.update(upcomingTasks)
      .set(updateData)
      .where(eq(upcomingTasks.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if task exists
    const existingTask = await db.select()
      .from(upcomingTasks)
      .where(eq(upcomingTasks.id, parseInt(id)))
      .limit(1);

    if (existingTask.length === 0) {
      return NextResponse.json({ error: 'Upcoming task not found' }, { status: 404 });
    }

    const deleted = await db.delete(upcomingTasks)
      .where(eq(upcomingTasks.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Upcoming task deleted successfully',
      task: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}
