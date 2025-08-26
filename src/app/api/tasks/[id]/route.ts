import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { tasks, projects } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 })
    }

    const task = await db.select()
      .from(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .limit(1)

    if (task.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task[0])
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 })
    }

    // Check if task exists
    const existingTask = await db.select()
      .from(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .limit(1)

    if (existingTask.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const body = await request.json()

    // Validate title if provided
    if (body.title !== undefined && (!body.title || body.title.trim() === '')) {
      return NextResponse.json({ 
        error: "Title cannot be empty",
        code: "INVALID_TITLE" 
      }, { status: 400 })
    }

    // Validate projectId if provided
    if (body.projectId !== undefined) {
      if (body.projectId !== null && isNaN(parseInt(body.projectId))) {
        return NextResponse.json({ 
          error: "Valid project ID is required",
          code: "INVALID_PROJECT_ID" 
        }, { status: 400 })
      }

      if (body.projectId !== null) {
        const project = await db.select()
          .from(projects)
          .where(eq(projects.id, parseInt(body.projectId)))
          .limit(1)

        if (project.length === 0) {
          return NextResponse.json({ 
            error: "Project not found",
            code: "PROJECT_NOT_FOUND" 
          }, { status: 400 })
        }
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    }

    if (body.title !== undefined) {
      updateData.title = body.title.trim()
    }
    if (body.description !== undefined) {
      updateData.description = body.description ? body.description.trim() : null
    }
    if (body.projectId !== undefined) {
      updateData.projectId = body.projectId ? parseInt(body.projectId) : null
    }
    if (body.status !== undefined) {
      updateData.status = body.status
    }
    if (body.priority !== undefined) {
      updateData.priority = body.priority
    }
    if (body.xpReward !== undefined) {
      updateData.xpReward = body.xpReward
    }
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate
    }
    if (body.position !== undefined) {
      updateData.position = body.position
    }

    const updated = await db.update(tasks)
      .set(updateData)
      .where(eq(tasks.id, parseInt(id)))
      .returning()

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 })
    }

    // Check if task exists
    const existingTask = await db.select()
      .from(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .limit(1)

    if (existingTask.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const deleted = await db.delete(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .returning()

    return NextResponse.json({
      message: 'Task deleted successfully',
      task: deleted[0]
    })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 })
  }
}
