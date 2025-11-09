'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle2, AlertCircle, XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

function StatusBadge({ status }: { status: HealthStatus }) {
  const variants: Record<HealthStatus, { label: string; className: string; icon: React.ReactNode }> = {
    healthy: {
      label: 'Operational',
      className: 'bg-green-500/10 text-green-500 border-green-500/20',
      icon: <CheckCircle2 className="h-4 w-4" />
    },
    degraded: {
      label: 'Degraded',
      className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      icon: <AlertCircle className="h-4 w-4" />
    },
    unhealthy: {
      label: 'Down',
      className: 'bg-red-500/10 text-red-500 border-red-500/20',
      icon: <XCircle className="h-4 w-4" />
    }
  }

  const variant = variants[status]

  return (
    <Badge className={`flex items-center gap-1.5 ${variant.className}`}>
      {variant.icon}
      {variant.label}
    </Badge>
  )
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)

  return parts.length > 0 ? parts.join(' ') : '< 1m'
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchHealth = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealth(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health status')
      setHealth({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: 0,
        checks: {
          database: { status: 'unhealthy', responseTime: 0, error: 'Failed to connect' },
          app: { status: 'unhealthy' }
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
              <p className="text-muted-foreground mt-2">
                Real-time operational status of Masqify
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHealth}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Status */}
        {health && (
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">Overall Status</h2>
                <StatusBadge status={health.status} />
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Uptime</div>
                <div className="text-2xl font-semibold">{formatUptime(health.uptime)}</div>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Response Time</div>
                <div className="text-2xl font-semibold">{health.responseTime || 0}ms</div>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Last Check</div>
                <div className="text-2xl font-semibold">
                  {new Date(health.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Service Status */}
        {health && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <div className="space-y-4">
              {/* Application */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-semibold">Application</h3>
                  <p className="text-sm text-muted-foreground">Core application services</p>
                </div>
                <StatusBadge status={health.checks.app.status} />
              </div>

              {/* Database */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">Database</h3>
                  <p className="text-sm text-muted-foreground">
                    PostgreSQL connectivity
                    {health.checks.database.responseTime > 0 && (
                      <span className="ml-2">({health.checks.database.responseTime}ms)</span>
                    )}
                  </p>
                  {health.checks.database.error && (
                    <p className="text-sm text-red-500 mt-1">{health.checks.database.error}</p>
                  )}
                </div>
                <StatusBadge status={health.checks.database.status} />
              </div>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !health && (
          <Card className="p-6 border-red-500/20">
            <div className="flex items-center gap-3 text-red-500">
              <XCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>This page automatically refreshes every 30 seconds</p>
          <p className="mt-1">
            For historical uptime data, visit our{' '}
            <a
              href={process.env.NEXT_PUBLIC_UPTIME_KUMA_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              monitoring dashboard
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
