import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, MessageSquare, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import analyticsService from '../../services/analyticsService';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import * as XLSX from 'xlsx';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [userAnalytics, setUserAnalytics] = useState(null);
    const [jobAnalytics, setJobAnalytics] = useState(null);
    const [eventAnalytics, setEventAnalytics] = useState(null);
    const [chatAnalytics, setChatAnalytics] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [summaryData, userData, jobData, eventData, chatData] = await Promise.all([
                analyticsService.getSummary(),
                analyticsService.getUserAnalytics(),
                analyticsService.getJobAnalytics(),
                analyticsService.getEventAnalytics(),
                analyticsService.getChatAnalytics()
            ]);

            setSummary(summaryData);
            setUserAnalytics(userData);
            setJobAnalytics(jobData);
            setEventAnalytics(eventData);
            setChatAnalytics(chatData);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        // Summary sheet
        const summarySheet = XLSX.utils.json_to_sheet([
            { Metric: 'Total Users', Value: summary?.users?.total || 0 },
            { Metric: 'Verified Alumni', Value: summary?.users?.verified || 0 },
            { Metric: 'Pending Alumni', Value: summary?.users?.pending || 0 },
            { Metric: 'Total Jobs', Value: summary?.jobs?.total || 0 },
            { Metric: 'Total Events', Value: summary?.events?.total || 0 },
            { Metric: 'Total Messages', Value: summary?.chats?.totalMessages || 0 }
        ]);
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

        XLSX.writeFile(wb, `Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '1.5rem' }}>Loading analytics...</div>
            </div>
        );
    }

    const statusBreakdown = summary?.jobs?.byStatus?.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, {}) || {};

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                        Analytics & Reports
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                        Comprehensive insights into your Alumni Hub
                    </p>
                </div>
                <button
                    onClick={exportToExcel}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#4f46e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Export to Excel
                </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <KPICard icon={Users} title="Total Users" value={summary?.users?.total || 0} color="#4f46e5" />
                <KPICard icon={CheckCircle} title="Verified Alumni" value={summary?.users?.verified || 0} color="#10b981" />
                <KPICard icon={Briefcase} title="Approved Jobs" value={statusBreakdown['Approved'] || 0} color="#f59e0b" />
                <KPICard icon={Calendar} title="Total Events" value={summary?.events?.total || 0} color="#ef4444" />
                <KPICard icon={Clock} title="Pending Jobs" value={statusBreakdown['Pending'] || 0} color="#8b5cf6" />
                <KPICard icon={MessageSquare} title="Total Messages" value={summary?.chats?.totalMessages || 0} color="#06b6d4" />
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
                {/* User Growth */}
                <ChartCard title="User Registration Trend">
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={userAnalytics?.growth?.map(item => ({
                            name: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                            users: item.count
                        })) || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Jobs by Company */}
                <ChartCard title="Top Companies (by Job Posts)">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={jobAnalytics?.byCompany?.slice(0, 5).map(item => ({
                            company: item._id,
                            jobs: item.count
                        })) || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="company" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="jobs" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Job Types */}
                <ChartCard title="Job Types Distribution">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={jobAnalytics?.byType?.map(item => ({
                                    name: item._id,
                                    value: item.count
                                })) || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => `${entry.name}: ${entry.value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {jobAnalytics?.byType?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Event Types */}
                <ChartCard title="Event Types Distribution">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={eventAnalytics?.byType?.map(item => ({
                                    name: item._id,
                                    value: item.count
                                })) || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => `${entry.name}: ${entry.value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {eventAnalytics?.byType?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

const KPICard = ({ icon: Icon, title, value, color }) => (
    <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                padding: '1rem',
                background: `${color}15`,
                borderRadius: '0.75rem'
            }}>
                <Icon size={24} color={color} />
            </div>
            <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {title}
                </div>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827' }}>
                    {value}
                </div>
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
    }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem' }}>
            {title}
        </h3>
        {children}
    </div>
);

export default AnalyticsDashboard;
