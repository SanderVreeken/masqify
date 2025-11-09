import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

/**
 * Lightweight Status Endpoint
 *
 * Returns a simple status summary for displaying in UI elements
 * like footers or headers. Much lighter than the full health check.
 */

type Status = 'operational' | 'degraded' | 'down'

interface StatusResponse {
  status: Status
  message: string
}

export async function GET() {
  try {
    // Quick database check
    const startTime = Date.now()
    await db.execute(sql`SELECT 1`)
    const responseTime = Date.now() - startTime

    // Determine status based on response time
    let status: Status = 'operational'
    let message = 'All systems operational'

    if (responseTime > 1000) {
      status = 'degraded'
      message = 'Some systems experiencing delays'
    }

    const response: StatusResponse = {
      status,
      message
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    })
  } catch (error) {
    const response: StatusResponse = {
      status: 'down',
      message: 'System experiencing issues'
    }

    return NextResponse.json(response, {
      status: 503,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
      }
    })
  }
}
