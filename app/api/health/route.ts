import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

/**
 * Health Check Endpoint
 *
 * Used by:
 * - Load balancers (to route traffic only to healthy instances)
 * - Monitoring systems (to alert on downtime)
 * - Coolify (for deployment health checks)
 *
 * Returns:
 * - 200 OK: All systems operational
 * - 503 Service Unavailable: Critical system down
 *
 * Checks:
 * - Database connectivity
 * - App uptime
 * - Timestamp for debugging
 */
type HealthStatus = 'healthy' | 'degraded' | 'unhealthy'

interface HealthCheck {
  status: HealthStatus
  responseTime: number
  error?: string
}

interface HealthResponse {
  status: HealthStatus
  timestamp: string
  uptime: number
  checks: {
    database: HealthCheck
    app: { status: HealthStatus }
  }
  responseTime?: number
}

export async function GET() {
  const startTime = Date.now()

  const health: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: { status: 'healthy', responseTime: 0 },
      app: { status: 'healthy' },
    },
  }

  try {
    // Check database connectivity with a simple query
    const dbStartTime = Date.now()
    await db.execute(sql`SELECT 1`)
    const dbResponseTime = Date.now() - dbStartTime

    health.checks.database = {
      status: 'healthy',
      responseTime: dbResponseTime,
    }

    // Database response time warning
    if (dbResponseTime > 1000) {
      health.checks.database.status = 'degraded'
      health.status = 'degraded'
    }
  } catch (error) {
    // Database connection failed - critical error
    health.status = 'unhealthy'
    health.checks.database = {
      status: 'unhealthy',
      responseTime: 0,
      error: error instanceof Error ? error.message : 'Database connection failed',
    }

    const totalResponseTime = Date.now() - startTime

    return NextResponse.json(
      {
        ...health,
        responseTime: totalResponseTime,
      },
      { status: 503 } // Service Unavailable
    )
  }

  const totalResponseTime = Date.now() - startTime

  // Return 200 for healthy/degraded, 503 for unhealthy
  const statusCode = health.status === 'unhealthy' ? 503 : 200

  return NextResponse.json(
    {
      ...health,
      responseTime: totalResponseTime,
    },
    { status: statusCode }
  )
}

/**
 * HEAD request for lightweight health checks
 * Some load balancers prefer HEAD requests
 */
export async function HEAD() {
  try {
    // Quick database check
    await db.execute(sql`SELECT 1`)
    return new Response(null, { status: 200 })
  } catch {
    return new Response(null, { status: 503 })
  }
}
