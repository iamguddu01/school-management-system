/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Select, DatePicker, message, Spin, Card, Radio } from 'antd';
import { Calendar, CheckSquare, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';
import moment from 'moment';
import { fetchSchoolInformation, fetchSchoolMembers, fetchAttendance, saveAttendance } from '@/service/auth.js';
import { nameShortner } from '@/helpers/index.js';

const Attendance = () => {
    const params = useParams();
    const slug = params?.id;

    const [info, setInfo] = useState({
        availableClasses: [],
        selectedClass: "",
        selectedDate: moment(),
        students: [],
        statusMap: {}, // mapping studentId -> status ("present" | "absent" | "late")
        loading: true,
        saving: false
    });

    const loadSchoolInfoAndStudents = useCallback(async () => {
        if (!slug) return;
        setInfo(prev => ({ ...prev, loading: true }));
        try {
            const schoolRes = await fetchSchoolInformation(slug);
            const classes = schoolRes?.data?.details?.available_classes || [];
            
            if (classes.length === 0) {
                setInfo(prev => ({ ...prev, loading: false }));
                message.warning("No classes found. Set up classes in School Information first.");
                return;
            }

            const defaultClass = classes[0];
            setInfo(prev => ({ 
                ...prev, 
                availableClasses: classes, 
                selectedClass: defaultClass 
            }));

            // Fetch students for the default class
            const studentsRes = await fetchSchoolMembers(slug, "student", defaultClass);
            const studentList = studentsRes?.data || [];

            // Fetch attendance records for the selected date
            const formattedDate = info.selectedDate.format("YYYY-MM-DD");
            const attendanceRes = await fetchAttendance(slug, formattedDate);
            const attendanceList = attendanceRes?.data || [];

            // Initialize status map
            const initialMap = {};
            studentList.forEach(student => {
                const record = attendanceList.find(r => r.studentId.toString() === student.userId.toString());
                initialMap[student.userId] = record ? record.status : "present"; // default to present
            });

            setInfo(prev => ({
                ...prev,
                students: studentList,
                statusMap: initialMap,
                loading: false
            }));

        } catch (error) {
            console.error("Error loading initial data", error);
            message.error("Failed to load classes or student directory.");
            setInfo(prev => ({ ...prev, loading: false }));
        }
    }, [slug]);

    useEffect(() => {
        loadSchoolInfoAndStudents();
    }, [slug]);

    // Load students & attendance whenever selectedClass or selectedDate changes
    const loadClassAttendanceData = async (targetClass, targetDate) => {
        if (!slug || !targetClass) return;
        setInfo(prev => ({ ...prev, loading: true }));
        try {
            const [studentsRes, attendanceRes] = await Promise.all([
                fetchSchoolMembers(slug, "student", targetClass),
                fetchAttendance(slug, targetDate.format("YYYY-MM-DD"))
            ]);

            const studentList = studentsRes?.data || [];
            const attendanceList = attendanceRes?.data || [];

            const initialMap = {};
            studentList.forEach(student => {
                const record = attendanceList.find(r => r.studentId.toString() === student.userId.toString());
                initialMap[student.userId] = record ? record.status : "present";
            });

            setInfo(prev => ({
                ...prev,
                students: studentList,
                statusMap: initialMap,
                loading: false
            }));
        } catch (error) {
            console.error("Error loading class attendance data", error);
            message.error("Failed to load attendance list.");
            setInfo(prev => ({ ...prev, loading: false }));
        }
    };

    const handleClassChange = (val) => {
        setInfo(prev => ({ ...prev, selectedClass: val }));
        loadClassAttendanceData(val, info.selectedDate);
    };

    const handleDateChange = (date) => {
        if (!date) return;
        setInfo(prev => ({ ...prev, selectedDate: date }));
        loadClassAttendanceData(info.selectedClass, date);
    };

    const handleStatusChange = (studentId, status) => {
        setInfo(prev => ({
            ...prev,
            statusMap: {
                ...prev.statusMap,
                [studentId]: status
            }
        }));
    };

    const markAll = (status) => {
        setInfo(prev => {
            const newMap = {};
            prev.students.forEach(student => {
                newMap[student.userId] = status;
            });
            return {
                ...prev,
                statusMap: newMap
            };
        });
        message.info(`Marked all students as ${status}.`);
    };

    const handleSubmitAttendance = async () => {
        setInfo(prev => ({ ...prev, saving: true }));
        try {
            const records = Object.keys(info.statusMap).map(studentId => ({
                studentId,
                status: info.statusMap[studentId]
            }));

            const payload = {
                date: info.selectedDate.format("YYYY-MM-DD"),
                records
            };

            await saveAttendance(slug, payload);
            message.success("Attendance saved successfully.");
        } catch (error) {
            console.error("Error saving attendance", error);
            message.error("Failed to save attendance.");
        } finally {
            setInfo(prev => ({ ...prev, saving: false }));
        }
    };

    // Derived stats
    const stats = useMemo(() => {
        const total = info.students.length;
        if (total === 0) return { total: 0, present: 0, absent: 0, late: 0, rate: 0 };
        
        let present = 0;
        let absent = 0;
        let late = 0;

        Object.values(info.statusMap).forEach(status => {
            if (status === "present") present++;
            if (status === "absent") absent++;
            if (status === "late") late++;
        });

        const rate = Math.round(((present + late) / total) * 100);

        return { total, present, absent, late, rate };
    }, [info.students, info.statusMap]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                        <CheckSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-snug">Attendance Marker</h1>
                        <p className="text-sm text-slate-500">Record daily student attendance, status, and track summary.</p>
                    </div>
                </div>
            </header>

            {/* Filter controls */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="space-y-1 w-full sm:w-48">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Class / Grade</span>
                        <Select
                            value={info.selectedClass}
                            onChange={handleClassChange}
                            className="w-full"
                        >
                            {info.availableClasses.map(cls => (
                                <Select.Option key={cls} value={cls}>{cls}</Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className="space-y-1 w-full sm:w-48">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Attendance Date</span>
                        <DatePicker
                            value={info.selectedDate}
                            onChange={handleDateChange}
                            allowClear={false}
                            className="w-full"
                            format="YYYY-MM-DD"
                        />
                    </div>
                </div>

                {info.students.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end">
                        <Button size="small" onClick={() => markAll("present")} className="border-green-200 text-green-700 hover:bg-green-50 font-medium">Mark All Present</Button>
                        <Button size="small" onClick={() => markAll("absent")} className="border-red-200 text-red-700 hover:bg-red-50 font-medium">Mark All Absent</Button>
                    </div>
                )}
            </div>

            {info.loading ? (
                <div className="py-20 text-center">
                    <Spin size="large" />
                    <p className="text-slate-400 mt-2 text-sm">Loading attendance list...</p>
                </div>
            ) : info.students.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm py-20 text-center text-slate-400">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm">No students assigned to <strong>{info.selectedClass}</strong>.</p>
                </div>
            ) : (
                <>
                    {/* Summary statistics grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="shadow-xs border-slate-200 rounded-2xl">
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Students</span>
                            <div className="flex items-center gap-2 mt-2">
                                <Users className="w-5 h-5 text-indigo-500" />
                                <span className="text-2xl font-bold text-slate-800">{stats.total}</span>
                            </div>
                        </Card>
                        <Card className="shadow-xs border-slate-200 rounded-2xl">
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Present</span>
                            <div className="flex items-center gap-2 mt-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-2xl font-bold text-slate-800">{stats.present}</span>
                            </div>
                        </Card>
                        <Card className="shadow-xs border-slate-200 rounded-2xl">
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Absent</span>
                            <div className="flex items-center gap-2 mt-2">
                                <XCircle className="w-5 h-5 text-red-500" />
                                <span className="text-2xl font-bold text-slate-800">{stats.absent}</span>
                            </div>
                        </Card>
                        <Card className="shadow-xs border-slate-200 rounded-2xl">
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completion Rate</span>
                            <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-5 h-5 text-amber-500" />
                                <span className="text-2xl font-bold text-slate-800">{stats.rate}%</span>
                            </div>
                        </Card>
                    </div>

                    {/* Marking sheet container */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
                        <h2 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">Class Attendance Sheet</h2>
                        
                        <div className="divide-y divide-slate-100">
                            {info.students.map((student) => {
                                const status = info.statusMap[student.userId] || "present";
                                return (
                                    <div key={student.userId} className="flex items-center justify-between py-3.5 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                {nameShortner(student.name || "")}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-800 text-sm block">{student.name}</span>
                                                <span className="text-slate-400 text-xs">{student.email}</span>
                                            </div>
                                        </div>

                                        <Radio.Group
                                            value={status}
                                            onChange={(e) => handleStatusChange(student.userId, e.target.value)}
                                            size="middle"
                                        >
                                            <Radio.Button value="present" className="px-4 font-semibold text-xs border-slate-200 checked:bg-green-600 checked:border-green-600 checked:text-white">Present</Radio.Button>
                                            <Radio.Button value="absent" className="px-4 font-semibold text-xs border-slate-200 checked:bg-red-600 checked:border-red-600 checked:text-white">Absent</Radio.Button>
                                            <Radio.Button value="late" className="px-4 font-semibold text-xs border-slate-200 checked:bg-amber-600 checked:border-amber-600 checked:text-white">Late</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
                            <Button
                                type="primary"
                                onClick={handleSubmitAttendance}
                                loading={info.saving}
                                className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8 py-5 rounded-xl flex items-center"
                            >
                                Save Class Attendance
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default memo(Attendance);
