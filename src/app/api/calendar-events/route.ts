import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { calendarEvents, tasks } from '@/db/schema';
import { eq, gte, lte, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const taskId = searchParams.get('taskId');

    // Single calendar event by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const event = await db.select()
        .from(calendarEvents)
        .where(eq(calendarEvents.id, parseInt(id)))
        .limit(1);

      if (event.length === 0) {
        return NextResponse.json({ error: 'Calendar event not found' }, { status: 404 });
      }

      return NextResponse.json(event[0]);
    }

    // List calendar events with date filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where conditions
    const conditions = [];

    if (startDate && endDate) {
      conditions.push(
        and(
          gte(calendarEvents.startDate, startDate),
          lte(calendarEvents.startDate, endDate)
        )
      );
    } else if (startDate) {
      conditions.push(gte(calendarEvents.startDate, startDate));
    } else if (endDate) {
      conditions.push(lte(calendarEvents.startDate, endDate));
    }

    if (taskId && !isNaN(parseInt(taskId))) {
      conditions.push(eq(calendarEvents.taskId, parseInt(taskId)));
    }

    // Execute query based on conditions
    const results = conditions.length > 0 
      ? await db.select().from(calendarEvents)
          .where(and(...conditions))
          .orderBy(asc(calendarEvents.startDate))
          .limit(limit)
          .offset(offset)
      : await db.select().from(calendarEvents)
          .orderBy(asc(calendarEvents.startDate))
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

    if (!body.startDate) {
      return NextResponse.json({ 
        error: "Start date is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate taskId exists if provided
    if (body.taskId) {
      if (isNaN(parseInt(body.taskId))) {
        return NextResponse.json({ 
          error: "Valid task ID is required",
          code: "INVALID_TASK_ID" 
        }, { status: 400 });
      }

      const task = await db.select()
        .from(tasks)
        .where(eq(tasks.id, parseInt(body.taskId)))
        .limit(1);

      if (task.length === 0) {
        return NextResponse.json({ 
          error: "Task not found",
          code: "TASK_NOT_FOUND" 
        }, { status: 400 });
      }
    }

    // Sanitize and prepare data
    const eventData = {
      title: body.title.trim(),
      description: body.description ? body.description.trim() : null,
      taskId: body.taskId ? parseInt(body.taskId) : null,
      startDate: body.startDate,
      endDate: body.endDate || null,
      allDay: body.allDay || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newEvent = await db.insert(calendarEvents)
      .values(eventData)
      .returning();

    return NextResponse.json(newEvent[0], { status: 201 });
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

    // Check if event exists
    const existingEvent = await db.select()
      .from(calendarEvents)
      .where(eq(calendarEvents.id, parseInt(id)))
      .limit(1);

    if (existingEvent.length === 0) {
      return NextResponse.json({ error: 'Calendar event not found' }, { status: 404 });
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
    if (body.taskId !== undefined) {
      updateData.taskId = body.taskId ? parseInt(body.taskId) : null;
    }
    if (body.startDate !== undefined) {
      updateData.startDate = body.startDate;
    }
    if (body.endDate !== undefined) {
      updateData.endDate = body.endDate;
    }
    if (body.allDay !== undefined) {
      updateData.allDay = body.allDay;
    }

    const updated = await db.update(calendarEvents)
      .set(updateData)
      .where(eq(calendarEvents.id, parseInt(id)))
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

    // Check if event exists
    const existingEvent = await db.select()
      .from(calendarEvents)
      .where(eq(calendarEvents.id, parseInt(id)))
      .limit(1);

    if (existingEvent.length === 0) {
      return NextResponse.json({ error: 'Calendar event not found' }, { status: 404 });
    }

    const deleted = await db.delete(calendarEvents)
      .where(eq(calendarEvents.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Calendar event deleted successfully',
      event: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}
