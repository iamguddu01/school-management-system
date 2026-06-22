/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Tag } from 'antd';
import { Users, Plus, Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import moment from 'moment';
import { fetchSchoolMembers, addSchoolMember } from '@/service/auth.js';
import { nameShortner } from '@/helpers/index.js';

const Teachers = () => {
    const params = useParams();
    const slug = params?.id;
    const [form] = Form.useForm();
    const [info, setInfo] = useState({
        teachers: [],
        filteredTeachers: [],
        searchText: "",
        modalOpen: false,
        loading: true,
        saving: false
    });

    const loadTeachers = useCallback(async () => {
        if (!slug) return;
        setInfo(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetchSchoolMembers(slug, "teacher");
            const list = response?.data || [];
            setInfo(prev => ({
                ...prev,
                teachers: list,
                filteredTeachers: list,
                loading: false
            }));
        } catch (error) {
            console.error("Error loading teachers", error);
            message.error("Failed to load teacher list.");
            setInfo(prev => ({ ...prev, loading: false }));
        }
    }, [slug]);

    useEffect(() => {
        loadTeachers();
    }, [slug]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setInfo(prev => {
            const filtered = prev.teachers.filter(teacher => 
                teacher.name.toLowerCase().includes(value) || 
                teacher.email.toLowerCase().includes(value)
            );
            return {
                ...prev,
                searchText: value,
                filteredTeachers: filtered
            };
        });
    };

    const handleAddTeacher = async (values) => {
        setInfo(prev => ({ ...prev, saving: true }));
        try {
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password || "Welcome@123", // default password
                role: "teacher"
            };
            await addSchoolMember(slug, payload);
            message.success("Teacher added successfully. Default password is 'Welcome@123'");
            setInfo(prev => ({ ...prev, modalOpen: false }));
            form.resetFields();
            loadTeachers();
        } catch (error) {
            console.error("Error adding teacher", error);
            message.error(error?.response?.data?.message || "Failed to add teacher.");
        } finally {
            setInfo(prev => ({ ...prev, saving: false }));
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {nameShortner(record.name || "")}
                    </div>
                    <span className="font-semibold text-slate-800">{record.name}</span>
                </div>
            )
        },
        {
            title: 'Email Address',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <span className="text-slate-600 text-sm">{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const color = status === "active" ? "green" : "orange";
                return (
                    <Tag color={color} className="capitalize font-medium rounded-full px-2.5 py-0.5">
                        {status || "active"}
                    </Tag>
                );
            }
        },
        {
            title: 'Joining Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => <span className="text-slate-400 text-xs">{moment(date).format("MMM DD, YYYY")}</span>
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-snug">Teachers</h1>
                        <p className="text-sm text-slate-500">Manage faculty staff database, profiles, and access.</p>
                    </div>
                </div>
                <Button
                    type="primary"
                    className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => {
                        form.resetFields();
                        setInfo(prev => ({ ...prev, modalOpen: true }));
                    }}
                >
                    Add Teacher
                </Button>
            </header>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
                <div className="max-w-md">
                    <Input
                        placeholder="Search faculty by name or email..."
                        prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
                        value={info.searchText}
                        onChange={handleSearch}
                        className="rounded-lg py-2"
                    />
                </div>

                <Table
                    dataSource={info.filteredTeachers}
                    columns={columns}
                    rowKey="id"
                    loading={info.loading}
                    pagination={{ pageSize: 8 }}
                    className="border border-slate-100 rounded-xl overflow-hidden"
                />
            </div>

            <Modal
                title="Add New Faculty Member"
                open={info.modalOpen}
                onCancel={() => setInfo(prev => ({ ...prev, modalOpen: false }))}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddTeacher}
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: "Please enter teacher's full name" }]}
                    >
                        <Input placeholder="e.g. Sarah Jenkins" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: "Please enter email" },
                            { type: "email", message: "Please enter a valid email" }
                        ]}
                    >
                        <Input placeholder="e.g. sjenkins@school.com" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Temporary Password"
                        help="Defaults to 'Welcome@123' if left blank. User will be forced to change it on first login."
                    >
                        <Input.Password placeholder="Enter custom password or leave blank" />
                    </Form.Item>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <Button onClick={() => setInfo(prev => ({ ...prev, modalOpen: false }))}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={info.saving} className="bg-indigo-600 hover:bg-indigo-700">
                            Add Teacher
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default memo(Teachers);
