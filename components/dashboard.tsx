'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { getDashboardStats } from '@/app/actions/audit'

const COLORS = ['#0f172a', '#1e293b', '#64748b', '#cbd5e1', '#e2e8f0']

interface DashboardStats {
  functionsCount: number
  entitiesCount: number
  regulationsCount: number
  applicationsCount: number
  strategiesCount: number
  meetingsCount: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>({
    functionsCount: 0,
    entitiesCount: 0,
    regulationsCount: 0,
    applicationsCount: 0,
    strategiesCount: 0,
    meetingsCount: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('[v0] Failed to fetch dashboard stats:', error)
        // Keep default stats on error
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-slate-600">Failed to load dashboard</p>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Active Audit Entities',
      value: stats.entitiesCount,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900',
      icon: '📊',
    },
    {
      label: 'Organization Functions',
      value: stats.functionsCount,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-900',
      icon: '🏢',
    },
    {
      label: 'Active Regulations',
      value: stats.regulationsCount,
      bgColor: 'bg-green-50',
      textColor: 'text-green-900',
      icon: '⚖️',
    },
    {
      label: 'Applications/Systems',
      value: stats.applicationsCount,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-900',
      icon: '💻',
    },
    {
      label: 'Audit Strategies',
      value: stats.strategiesCount,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-900',
      icon: '🎯',
    },
    {
      label: 'Scheduled Meetings',
      value: stats.meetingsCount,
      bgColor: 'bg-red-50',
      textColor: 'text-red-900',
      icon: '📅',
    },
  ]

  const chartData = [
    { name: 'Entities', value: stats.entitiesCount },
    { name: 'Functions', value: stats.functionsCount },
    { name: 'Regulations', value: stats.regulationsCount },
    { name: 'Applications', value: stats.applicationsCount },
    { name: 'Strategies', value: stats.strategiesCount },
    { name: 'Meetings', value: stats.meetingsCount },
  ]

  const pieData = [
    { name: 'Entities', value: stats.entitiesCount || 1 },
    { name: 'Functions', value: stats.functionsCount || 1 },
    { name: 'Regulations', value: stats.regulationsCount || 1 },
    { name: 'Applications', value: stats.applicationsCount || 1 },
  ]

  return (
    <div className="space-y-8 p-8 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Internal Audit Knowledge Base Overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg shadow p-6 border border-slate-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${stat.textColor}`}>
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Audit Records Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
              />
              <Bar dataKey="value" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Distribution by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Records</h3>
          <p className="text-4xl font-bold">
            {Object.values(stats).reduce((a, b) => a + b, 0)}
          </p>
          <p className="text-blue-100 text-sm mt-2">
            All audit knowledge base records
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Active Audits</h3>
          <p className="text-4xl font-bold">{stats.entitiesCount}</p>
          <p className="text-green-100 text-sm mt-2">
            Entities under audit review
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Compliance Coverage</h3>
          <p className="text-4xl font-bold">{stats.regulationsCount}</p>
          <p className="text-purple-100 text-sm mt-2">
            Regulations tracked
          </p>
        </div>
      </div>
    </div>
  )
}
