/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, Radio, Input, Table, message, Alert, Tabs, Select } from 'antd';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Play } from 'lucide-react';
import { useParams } from 'next/navigation';
import { addSchoolMembersBulk, fetchSchoolInformation } from '@/service/auth.js';

const AddBulkUsers = () => {
    const params = useParams();
    const slug = params?.id;

    const [info, setInfo] = useState({
        role: "student",
        inputText: "",
        parsedUsers: [],
        importResults: null,
        loading: false,
        activeTab: "paste",
        availableClasses: [],
        selectedClass: ""
    });

    const loadSchoolInfo = useCallback(async () => {
        if (!slug) return;
        try {
            const response = await fetchSchoolInformation(slug);
            const classes = response?.data?.details?.available_classes || [];
            setInfo(prev => ({ 
                ...prev, 
                availableClasses: classes,
                selectedClass: classes.length > 0 ? classes[0] : ""
            }));
        } catch (error) {
            console.error("Error loading school info", error);
        }
    }, [slug]);

    useEffect(() => {
        loadSchoolInfo();
    }, [slug]);

    const handleTextChange = (e) => {
        setInfo(prev => ({ ...prev, inputText: e.target.value }));
    };

    const parseTextData = () => {
        const lines = info.inputText.split("\n");
        const users = [];

        lines.forEach((line, idx) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            const parts = trimmedLine.split(",").map(part => part.trim());
            const name = parts[0] || "";
            const email = parts[1] || "";
            const password = parts[2] || "Welcome@123";

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let status = "valid";
            let message = "Ready to import";

            if (!name) {
                status = "invalid";
                message = "Missing name";
            } else if (!email) {
                status = "invalid";
                message = "Missing email";
            } else if (!emailRegex.test(email)) {
                status = "invalid";
                message = "Invalid email format";
            }

            users.push({
                key: idx,
                name,
                email,
                password,
                status,
                message
            });
        });

        setInfo(prev => ({ ...prev, parsedUsers: users, importResults: null }));
        if (users.length > 0) {
            message.success(`Successfully parsed ${users.length} rows.`);
        } else {
            message.warning("No valid data found to parse.");
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result || "";
            setInfo(prev => ({ ...prev, inputText: text }));
            message.success("CSV file loaded. Click 'Parse Data' to preview.");
        };
        reader.readAsText(file);
    };

    const runImport = async () => {
        const validUsers = info.parsedUsers.filter(u => u.status === "valid");
        if (validUsers.length === 0) {
            message.error("No valid users to import.");
            return;
        }

        if (info.role === "student" && !info.selectedClass) {
            message.error("Please select a target class for the students.");
            return;
        }

        setInfo(prev => ({ ...prev, loading: true }));
        try {
            const payload = {
                role: info.role,
                members: validUsers.map(u => ({
                    name: u.name,
                    email: u.email,
                    password: u.password,
                    class: info.role === "student" ? info.selectedClass : undefined
                }))
            };
            const response = await addSchoolMembersBulk(slug, payload);
            setInfo(prev => ({
                ...prev,
                importResults: {
                    addedCount: response.addedCount,
                    errors: response.errors || []
                },
                loading: false
            }));
            message.success(`Import completed! Added ${response.addedCount} members.`);
        } catch (error) {
            console.error("Error executing bulk import", error);
            message.error("An error occurred during bulk import execution.");
            setInfo(prev => ({ ...prev, loading: false }));
        }
    };

    const previewColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Temporary Password',
            dataIndex: 'password',
            key: 'password'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    status === "valid" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                    {status === "valid" ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {record.message}
                </span>
            )
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-snug">Add Bulk Users</h1>
                        <p className="text-sm text-slate-500">Import multiple students or faculty members at once via CSV.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left controls panel */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">1. Select Target Role</label>
                        <Radio.Group
                            value={info.role}
                            onChange={(e) => setInfo(prev => ({ ...prev, role: e.target.value }))}
                            className="flex gap-2 w-full"
                        >
                            <Radio.Button value="student" className="flex-1 text-center font-semibold">Student</Radio.Button>
                            <Radio.Button value="teacher" className="flex-1 text-center font-semibold">Teacher</Radio.Button>
                        </Radio.Group>
                    </div>

                    {info.role === "student" && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Target Class Assignment</label>
                            <Select
                                placeholder="Select class for this batch"
                                value={info.selectedClass}
                                onChange={(val) => setInfo(prev => ({ ...prev, selectedClass: val }))}
                                className="w-full"
                            >
                                {info.availableClasses.map(cls => (
                                    <Select.Option key={cls} value={cls}>{cls}</Select.Option>
                                ))}
                            </Select>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">2. Input Data Method</label>
                        <Tabs
                            activeKey={info.activeTab}
                            onChange={(key) => setInfo(prev => ({ ...prev, activeTab: key }))}
                            items={[
                                {
                                    key: 'paste',
                                    label: 'Paste Spreadsheet Data',
                                    children: (
                                        <div className="space-y-4">
                                            <p className="text-xs text-slate-400">
                                                Paste rows from Excel or Notepad. Format: <strong>Name, Email, [Password]</strong> (One per line)
                                            </p>
                                            <Input.TextArea
                                                rows={8}
                                                placeholder="John Doe, john@school.com&#10;Sarah Jenkins, sjenkins@school.com, Password123"
                                                value={info.inputText}
                                                onChange={handleTextChange}
                                                className="font-mono text-xs rounded-xl"
                                            />
                                        </div>
                                    )
                                },
                                {
                                    key: 'file',
                                    label: 'Upload CSV File',
                                    children: (
                                        <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 text-center cursor-pointer transition-colors relative">
                                            <input
                                                type="file"
                                                accept=".csv,.txt"
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            />
                                            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                            <span className="text-xs font-medium text-slate-600 block">Click to upload or drag CSV file</span>
                                            <span className="text-[10px] text-slate-400 block mt-1">Files should be comma-delimited (.csv)</span>
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </div>

                    <Button
                        type="primary"
                        onClick={parseTextData}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 py-5 rounded-xl font-bold flex items-center justify-center gap-2"
                        icon={<Play className="w-4 h-4" />}
                    >
                        Parse Data
                    </Button>
                </div>

                {/* Right preview/results panel */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6 min-h-[450px]">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h2 className="text-base font-bold text-slate-800">Preview & Execution</h2>
                        {info.parsedUsers.length > 0 && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {info.parsedUsers.filter(u => u.status === "valid").length} valid rows
                            </span>
                        )}
                    </div>

                    {info.importResults && (
                        <Alert
                            message="Import Process Completed"
                            description={
                                <div className="space-y-2 text-xs">
                                    <p>Successfully added <strong>{info.importResults.addedCount}</strong> {info.role}s.</p>
                                    {info.importResults.errors.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            <p className="font-semibold text-red-600">Errors/Warnings:</p>
                                            <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                                                {info.importResults.errors.map((err, i) => (
                                                    <li key={i}>Row for <strong>{err.email}</strong>: {err.message}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            }
                            type={info.importResults.errors.length > 0 ? "warning" : "success"}
                            showIcon
                            closable
                            className="rounded-xl"
                        />
                    )}

                    {info.parsedUsers.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-16">
                            <FileText className="w-12 h-12 text-slate-300 mb-2" />
                            <p className="text-sm">Configure input details and parse data to see import preview.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Table
                                dataSource={info.parsedUsers}
                                columns={previewColumns}
                                pagination={{ pageSize: 6 }}
                                className="border border-slate-100 rounded-xl overflow-hidden text-xs"
                                size="small"
                            />
                            <div className="flex justify-end pt-3">
                                <Button
                                    type="primary"
                                    onClick={runImport}
                                    loading={info.loading}
                                    disabled={info.parsedUsers.filter(u => u.status === "valid").length === 0}
                                    className="bg-green-600 hover:bg-green-700 py-5 px-6 font-bold flex items-center gap-2"
                                >
                                    Import {info.parsedUsers.filter(u => u.status === "valid").length} Members
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(AddBulkUsers);
