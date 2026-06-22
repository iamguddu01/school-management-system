/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Tag, Select } from 'antd';
import { GraduationCap, Plus, Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import moment from 'moment';
import { fetchSchoolMembers, addSchoolMember, fetchSchoolInformation } from '@/service/auth.js';
import { nameShortner } from '@/helpers/index.js';

const Students = () => {
    const params = useParams();
    const slug = params?.id;
    const [form] = Form.useForm();
    const [info, setInfo] = useState({
        students: [],
        filteredStudents: [],
        searchText: "",
        modalOpen: false,
        loading: true,
        saving: false,
        availableClasses: []
    });

    const loadStudents = useCallback(async () => {
        if (!slug) return;
        setInfo(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetchSchoolMembers(slug, "student");
            const list = response?.data || [];
            setInfo(prev => ({
                ...prev,
                students: list,
                filteredStudents: list,
                loading: false
            }));
        } catch (error) {
            console.error("Error loading students", error);
            message.error("Failed to load student list.");
            setInfo(prev => ({ ...prev, loading: false }));
        }
    }, [slug]);

    const loadSchoolInfo = useCallback(async () => {
        if (!slug) return;
        try {
            const response = await fetchSchoolInformation(slug);
            const classes = response?.data?.details?.available_classes || [];
            setInfo(prev => ({ ...prev, availableClasses: classes }));
        } catch (error) {
            console.error("Error loading school info", error);
        }
    }, [slug]);

    useEffect(() => {
        loadStudents();
        loadSchoolInfo();
    }, [slug]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setInfo(prev => {
            const filtered = prev.students.filter(student => 
                student.name.toLowerCase().includes(value) || 
                student.email.toLowerCase().includes(value) ||
                (student.class && student.class.toLowerCase().includes(value))
            );
            return {
                ...prev,
                searchText: value,
                filteredStudents: filtered
            };
        });
    };

    const handleAddStudent = async (values) => {
        setInfo(prev => ({ ...prev, saving: true }));
        try {
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password || "Welcome@123", // default password
                role: "student",
                class: values.class
            };
            await addSchoolMember(slug, payload);
            message.success(`Student added successfully to ${values.class}. Default password is 'Welcome@123'`);
            setInfo(prev => ({ ...prev, modalOpen: false }));
            form.resetFields();
            loadStudents();
        } catch (error) {
            console.error("Error adding student", error);
            message.error(error?.response?.data?.message || "Failed to add student.");
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
                    <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
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
            title: 'Class',
            dataIndex: 'class',
            key: 'class',
            render: (text) => (
                <Tag color="blue" className="font-medium px-2.5 py-0.5 rounded-md">
                    {text || "Not assigned"}
                </Tag>
            )
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
            title: 'Admission Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => <span className="text-slate-400 text-xs">{moment(date).format("MMM DD, YYYY")}</span>
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-snug">Students</h1>
                        <p className="text-sm text-slate-500">Manage student database, profiles, and registrations.</p>
                    </div>
                </div>
                <Button
                    type="primary"
                    className="bg-blue-600 hover:bg-blue-700 font-semibold"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => {
                        form.resetFields();
                        setInfo(prev => ({ ...prev, modalOpen: true }));
                    }}
                >
                    Add Student
                </Button>
            </header>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
                <div className="max-w-md">
                    <Input
                        placeholder="Search student by name, email or class..."
                        prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
                        value={info.searchText}
                        onChange={handleSearch}
                        className="rounded-lg py-2"
                    />
                </div>

                <Table
                    dataSource={info.filteredStudents}
                    columns={columns}
                    rowKey="id"
                    loading={info.loading}
                    pagination={{ pageSize: 8 }}
                    className="border border-slate-100 rounded-xl overflow-hidden"
                />
            </div>

            <Modal
                title="Add New Student"
                open={info.modalOpen}
                onCancel={() => setInfo(prev => ({ ...prev, modalOpen: false }))}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddStudent}
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: "Please enter student's full name" }]}
                    >
                        <Input placeholder="e.g. John Doe" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: "Please enter email" },
                            { type: "email", message: "Please enter a valid email" }
                        ]}
                    >
                        <Input placeholder="e.g. johndoe@school.com" />
                    </Form.Item>

                    <Form.Item
                        name="class"
                        label="Class Assignment"
                        rules={[{ required: true, message: "Please select student's class" }]}
                    >
                        <Select placeholder="Select class">
                            {info.availableClasses.map(cls => (
                                <Select.Option key={cls} value={cls}>{cls}</Select.Option>
                            ))}
                        </Select>
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
                        <Button type="primary" htmlType="submit" loading={info.saving} className="bg-blue-600 hover:bg-blue-700">
                            Add Student
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default memo(Students);
