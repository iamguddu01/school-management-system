/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Spin, Card, Tag, message } from 'antd';
import { CheckSquare, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';
import moment from 'moment';
import { fetchMyAttendance } from '@/service/auth.js';

const StudentAttendance = () => {
    const params = useParams();
    const slug = params?.id;

    const [info, setInfo] = useState({
        records: [],
        loading: true
    });

    const loadMyAttendance = useCallback(async () => {
        if (!slug) return;
        try {
            const res = await fetchMyAttendance(slug);
            setInfo(prev => ({
                ...prev,
                records: res?.data || [],
                loading: false
            }));
        } catch (error) {
            console.error("Error loading personal attendance", error);
            message.error("Failed to load your attendance logs.");
            setInfo(prev => ({ ...prev, loading: false }));
        }
    }, [slug]);

    useEffect(() => {
        loadMyAttendance();
    }, [slug]);

    const stats = useMemo(() => {
        const total = info.records.length;
        if (total === 0) return { total: 0, present: 0, absent: 0, late: 0, rate: 100 };

        let present = 0;
        let absent = 0;
        let late = 0;

        info.records.forEach(r => {
            if (r.status === "present") present++;
            if (r.status === "absent") absent++;
            if (r.status === "late") late++;
        });

        const rate = Math.round(((present + late) / total) * 100);

        return { total, present, absent, late, rate };
    }, [info.records]);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => <span className="font-semibold text-slate-700">{moment(date).format("MMMM DD, YYYY")}</span>
        },
        {
            title: 'Day',
            dataIndex: 'date',
            key: 'day',
            render: (date) => <span className="text-slate-500">{moment(date).format("dddd")}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = "green";
                if (status === "absent") color = "red";
                if (status === "late") color = "gold";
                return (
                    <Tag color={color} className="capitalize font-semibold rounded-full px-3 py-0.5">
                        {status}
                    </Tag>
                );
            }
        }
    ];

    if (info.loading) {
        return (
            <div className="py-32 text-center">
                <Spin size="large" />
                <p className="text-slate-400 mt-2 text-sm">Loading attendance logs...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-green-600 text-white flex items-center justify-center">
                        <CheckSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-snug">My Attendance</h1>
                        <p className="text-sm text-slate-500">View your daily class attendance history and analytics.</p>
                    </div>
                </div>
            </header>

            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-xs border-slate-200 rounded-2xl">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Attendance Rate</span>
                    <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        <span className="text-2xl font-extrabold text-slate-800">{stats.rate}%</span>
                    </div>
                </Card>

                <Card className="shadow-xs border-slate-200 rounded-2xl">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Logs</span>
                    <div className="flex items-center gap-2 mt-2">
                        <Calendar className="w-5 h-5 text-slate-500" />
                        <span className="text-2xl font-extrabold text-slate-800">{stats.total} days</span>
                    </div>
                </Card>

                <Card className="shadow-xs border-slate-200 rounded-2xl">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Days Present</span>
                    <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-2xl font-extrabold text-slate-800">{stats.present + stats.late}</span>
                    </div>
                </Card>

                <Card className="shadow-xs border-slate-200 rounded-2xl">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Days Absent</span>
                    <div className="flex items-center gap-2 mt-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-2xl font-extrabold text-slate-800">{stats.absent}</span>
                    </div>
                </Card>
            </div>

            {/* Attendance Logs Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">Historical Log Book</h2>
                
                <Table
                    dataSource={info.records}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    className="border border-slate-100 rounded-xl overflow-hidden text-sm"
                />
            </div>
        </div>
    );
};

export default memo(StudentAttendance);
