'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

type Status = 'operational' | 'degraded' | 'down' | 'loading'

interface StatusData {
  status: Status
  message: string
}

export function StatusIndicator() {
  const [statusData, setStatusData] = useState<StatusData>({
    status: 'loading',
    message: 'Checking status...'
  })

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status')
        const data = await response.json()
        setStatusData(data)
      } catch (error) {
        setStatusData({
          status: 'down',
          message: 'Unable to check status'
        })
      }
    }

    fetchStatus()

    // Refresh status every 60 seconds
    const interval = setInterval(fetchStatus, 60000)

    return () => clearInterval(interval)
  }, [])

  const statusConfig = {
    operational: {
      icon: <CheckCircle2 className="h-3 w-3" />,
      color: 'text-green-500',
      dotColor: 'bg-green-500'
    },
    degraded: {
      icon: <AlertCircle className="h-3 w-3" />,
      color: 'text-yellow-500',
      dotColor: 'bg-yellow-500'
    },
    down: {
      icon: <XCircle className="h-3 w-3" />,
      color: 'text-red-500',
      dotColor: 'bg-red-500'
    },
    loading: {
      icon: <div className="h-3 w-3 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />,
      color: 'text-muted-foreground',
      dotColor: 'bg-muted-foreground'
    }
  }

  const config = statusConfig[statusData.status]

  return (
    <Link
      href="/status"
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
    >
      <div className="flex items-center gap-1.5">
        <div className={`h-2 w-2 rounded-full ${config.dotColor} animate-pulse`} />
        <span className={config.color}>Status</span>
      </div>
      <span className="hidden sm:inline group-hover:underline">
        {statusData.message}
      </span>
    </Link>
  )
}
