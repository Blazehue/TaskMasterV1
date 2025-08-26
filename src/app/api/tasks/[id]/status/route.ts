import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { tasks } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['backlog', 'todo', 'inprogress', 'complete']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update task status in database
    const updatedTask = await db
      .update(tasks)
      .set({
        status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tasks.id, parseInt(id)))
      .returning()

    if (updatedTask.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedTask[0])
  } catch (error) {
    console.error('Error updating task status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
