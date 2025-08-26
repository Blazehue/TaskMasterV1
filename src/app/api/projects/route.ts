import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { projects, upcomingTasks } from '@/db/schema';
import { eq, like, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Single project by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }
      
      const project = await db.select()
        .from(projects)
        .where(eq(projects.id, parseInt(id)))
        .limit(1);
      
      if (project.length === 0) {
        return NextResponse.json({ 
          error: 'Project not found' 
        }, { status: 404 });
      }
      
      return NextResponse.json(project[0]);
    }
    
    // List projects with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    // Apply search filter and sorting
    const validSortFields = ['id', 'title', 'category', 'createdAt', 'updatedAt', 'dueDate'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order.toLowerCase() === 'asc' ? asc : desc;
    
    // Get the sort column
    const getSortColumn = (field: string) => {
      switch (field) {
        case 'id': return projects.id;
        case 'title': return projects.title;
        case 'category': return projects.category;
        case 'updatedAt': return projects.updatedAt;
        case 'dueDate': return projects.dueDate;
        default: return projects.createdAt;
      }
    };
    
    // Build query based on search filter
    const results = search 
      ? await db.select().from(projects)
          .where(
            or(
              like(projects.title, `%${search}%`),
              like(projects.category, `%${search}%`)
            )
          )
          .orderBy(sortOrder(getSortColumn(sortField)))
          .limit(limit)
          .offset(offset)
      : await db.select().from(projects)
          .orderBy(sortOrder(getSortColumn(sortField)))
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
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return NextResponse.json({ 
        error: "Title is required and must be a non-empty string",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }
    
    // Sanitize and prepare data
    const projectData = {
      title: body.title.trim(),
      description: body.description ? body.description.trim() : null,
      taskCount: body.taskCount || 0,
      completedTasks: body.completedTasks || 0,
      dueDate: body.dueDate || null,
      category: body.category ? body.category.trim() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newProject = await db.insert(projects)
      .values(projectData)
      .returning();
    
    // Handle upcoming tasks if provided
    if (body.upcomingTasks && Array.isArray(body.upcomingTasks) && body.upcomingTasks.length > 0) {
      const upcomingTasksData = body.upcomingTasks.map((task: any) => ({
        title: task.title,
        description: task.description || null,
        projectId: newProject[0].id,
        dueDate: task.dueDate || null,
        priority: task.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      await db.insert(upcomingTasks).values(upcomingTasksData);
    }
    
    return NextResponse.json(newProject[0], { status: 201 });
    
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
    
    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);
    
    if (existingProject.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 });
    }
    
    const body = await request.json();
    
    // Validate title if provided
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim() === '')) {
      return NextResponse.json({ 
        error: "Title must be a non-empty string",
        code: "INVALID_TITLE" 
      }, { status: 400 });
    }
    
    // Prepare update data
    const updates: any = {
      updatedAt: new Date().toISOString()
    };
    
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.description !== undefined) updates.description = body.description ? body.description.trim() : null;
    if (body.taskCount !== undefined) updates.taskCount = body.taskCount;
    if (body.completedTasks !== undefined) updates.completedTasks = body.completedTasks;
    if (body.dueDate !== undefined) updates.dueDate = body.dueDate;
    if (body.category !== undefined) updates.category = body.category ? body.category.trim() : null;
    
    const updatedProject = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, parseInt(id)))
      .returning();
    
    return NextResponse.json(updatedProject[0]);
    
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
    
    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);
    
    if (existingProject.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 });
    }
    
    const deletedProject = await db.delete(projects)
      .where(eq(projects.id, parseInt(id)))
      .returning();
    
    return NextResponse.json({
      message: 'Project deleted successfully',
      project: deletedProject[0]
    });
    
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}