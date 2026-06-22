/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button, Form, Input, Modal, message, Segmented, Select } from 'antd';
import { Bell, Edit3, Megaphone, Plus, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import moment from "moment";
import {
    fetchSchoolAnnouncements,
    createSchoolAnnouncement,
    updateSchoolAnnouncement,
    deleteSchoolAnnouncement
} from '@/service/auth.js';

const tagsList = ["Urgent", "General", "Academic", "Event", "Holiday", "Sports"];
const scopeOptions = [
    { label: "School", value: "school" },
    { label: "Class", value: "class" }
];

const AnnouncementPage = () => {
    const params = useParams();
    const slug = params?.id;
    
    const [form] = Form.useForm();
    const [info, setInfo] = useState({
        announcements: [],
        editingId: null,
        activeId: null,
        modalOpen: false,
        filterScope: "all",
        loading: true,
        isAdmin: false
    });

    const checkAdminPrivilege = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            let membership = localStorage.getItem("membership");
            membership = membership ? JSON.parse(membership) : null;
            const isAdmin = membership?.roles === "admin";
            setInfo(prev => ({ ...prev, isAdmin }));
        } catch (error) {
            console.error("Error reading membership role", error);
        }
    }, []);

    const loadAnnouncements = useCallback(async () => {
        if (!slug) return;
        setInfo(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetchSchoolAnnouncements(slug);
            const list = response?.schoolAnnouncements || [];
            setInfo(prev => ({
                ...prev,
                announcements: list,
                activeId: list.length > 0 ? list[0]._id : null,
                loading: false
            }));
        } catch (error) {
            console.error("Error loading announcements", error);
            message.error("Failed to load announcements.");
            setInfo(prev => ({ ...prev, loading: false }));
        }
    }, [slug]);

    useEffect(() => {
        checkAdminPrivilege();
        loadAnnouncements();
    }, [slug]);

    const handleSubmit = async (values) => {
        try {
            const payload = {
                tag: values.tag,
                title: values.title,
                description: values.description,
                scope: values.scope,
                classes: values.scope === "class" ? values.classes : []
            };

            if (info.editingId) {
                await updateSchoolAnnouncement(slug, info.editingId, payload);
                message.success("Announcement updated successfully");
            } else {
                await createSchoolAnnouncement(slug, payload);
                message.success("Announcement created successfully");
            }
            handleModalClose();
            loadAnnouncements();
        } catch (error) {
            console.error("Error saving announcement", error);
            message.error(error?.response?.data?.message || "Failed to save announcement.");
        }
    };

    const handleEdit = (item) => {
        setInfo(prev => ({
            ...prev,
            editingId: item._id,
            modalOpen: true
        }));
        form.setFieldsValue({
            tag: item.tag,
            title: item.title,
            description: item.description,
            scope: item.scope,
            classes: item.classes || []
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteSchoolAnnouncement(slug, id);
            message.success("Announcement deleted successfully");
            loadAnnouncements();
        } catch (error) {
            console.error("Error deleting announcement", error);
            message.error(error?.response?.data?.message || "Failed to delete announcement.");
        }
    };

    const handleModalClose = () => {
        setInfo(prev => ({
            ...prev,
            modalOpen: false,
            editingId: null
        }));
        form.resetFields();
    };

    const sortedAnnouncements = useMemo(
        () => [...(info.announcements || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        [info.announcements]
    );

    const filteredAnnouncements = useMemo(() => {
        if (info.filterScope === "all") return sortedAnnouncements;
        return sortedAnnouncements.filter(item => item.scope === info.filterScope);
    }, [sortedAnnouncements, info.filterScope]);

    const activeAnnouncement = useMemo(
        () => filteredAnnouncements.find(a => a._id === info.activeId) || filteredAnnouncements[0] || null,
        [filteredAnnouncements, info.activeId]
    );

    // Watch scope to toggle classes field in Form
    const scopeValue = Form.useWatch('scope', form);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2 text-slate-900">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <span className="text-lg font-bold text-slate-800">School Announcements</span>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Segmented
                            size="middle"
                            options={[
                                { label: "All Notices", value: "all" },
                                { label: "School-wide", value: "school" },
                                { label: "Class-wide", value: "class" },
                            ]}
                            value={info.filterScope}
                            onChange={(val) => setInfo(prev => ({ ...prev, filterScope: val }))}
                        />
                        {info.isAdmin && (
                            <Button
                                type="primary"
                                className="bg-blue-600 hover:bg-blue-700 font-semibold"
                                icon={<Plus className="w-4 h-4" />}
                                onClick={() => {
                                    setInfo(prev => ({
                                        ...prev,
                                        editingId: null,
                                        modalOpen: true
                                    }));
                                    form.resetFields();
                                    form.setFieldsValue({ scope: "school", tag: "General" });
                                }}
                            >
                                Add Notice
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 min-h-[500px]">
                    {filteredAnnouncements.length === 0 ? (
                        <div className="flex-1 py-20 flex flex-col items-center justify-center text-slate-400">
                            <Megaphone className="w-12 h-12 text-slate-300 mb-2" />
                            <p className="text-sm">No announcements found matching the filter.</p>
                        </div>
                    ) : (
                        <>
                            {/* Left List */}
                            <div className="md:w-80 shrink-0 p-4 space-y-2 overflow-y-auto max-h-[550px]">
                                {filteredAnnouncements.map((item) => (
                                    <button
                                        key={item._id}
                                        onClick={() => setInfo(prev => ({ ...prev, activeId: item._id }))}
                                        className={`w-full text-left rounded-xl px-4 py-3.5 transition-all duration-150 flex flex-col gap-2 border ${
                                            (activeAnnouncement?._id === item._id)
                                                ? "bg-blue-50 border-blue-200 shadow-xs"
                                                : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                item.tag === "Urgent" 
                                                    ? "bg-red-50 text-red-600" 
                                                    : "bg-blue-50 text-blue-600"
                                            }`}>
                                                {item.tag}
                                            </span>
                                            <span className="text-slate-400 text-[10px]">
                                                {moment(item.createdAt).format("MMM DD, YYYY")}
                                            </span>
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold leading-snug break-words ${
                                                activeAnnouncement?._id === item._id ? "text-blue-700" : "text-slate-700"
                                            }`}>
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-slate-400 truncate mt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Right Detail Pane */}
                            <div className="flex-1 p-6 flex flex-col justify-between bg-slate-50/50">
                                {activeAnnouncement ? (
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 bg-white p-4 rounded-xl shadow-xs">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                                    {activeAnnouncement.tag}
                                                </span>
                                                <span className="text-slate-500 text-xs font-medium">
                                                    {moment(activeAnnouncement.createdAt).format("MMMM DD, YYYY [at] hh:mm A")}
                                                </span>
                                            </div>
                                            {info.isAdmin && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        className="text-slate-600 hover:text-blue-600"
                                                        icon={<Edit3 className="w-4 h-4" />}
                                                        onClick={() => handleEdit(activeAnnouncement)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        size="small"
                                                        icon={<Trash2 className="w-4 h-4" />}
                                                        onClick={() => handleDelete(activeAnnouncement._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4 bg-white p-6 rounded-xl shadow-xs">
                                            <h2 className="text-xl font-bold text-slate-900 leading-snug">
                                                {activeAnnouncement.title}
                                            </h2>
                                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                                {activeAnnouncement.description}
                                            </p>
                                            
                                            {activeAnnouncement.scope === "class" && activeAnnouncement.classes?.length > 0 && (
                                                <div className="pt-4 border-t border-slate-100 mt-4">
                                                    <span className="text-xs font-semibold text-slate-500 block mb-1">Targeted Classes:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {activeAnnouncement.classes.map(cls => (
                                                            <span key={cls} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                                                {cls}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                        <Megaphone className="w-10 h-10 text-slate-300 mb-2" />
                                        <p className="text-sm">Select an announcement to view details.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                title={info.editingId ? "Edit Announcement" : "Create Announcement"}
                open={info.modalOpen}
                onCancel={handleModalClose}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mt-4"
                >
                    <Form.Item
                        name="title"
                        label="Announcement Title"
                        rules={[{ required: true, message: "Please enter the title" }]}
                    >
                        <Input placeholder="Enter title e.g. Final Exams Schedule" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="tag"
                            label="Tag/Category"
                            rules={[{ required: true, message: "Please select a tag" }]}
                        >
                            <Select placeholder="Select category">
                                {tagsList.map(t => (
                                    <Select.Option key={t} value={t}>{t}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="scope"
                            label="Audience Scope"
                            rules={[{ required: true, message: "Please select audience scope" }]}
                        >
                            <Select placeholder="Select scope">
                                {scopeOptions.map(opt => (
                                    <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    {scopeValue === "class" && (
                        <Form.Item
                            name="classes"
                            label="Select Classes"
                            rules={[{ required: true, message: "Please select at least one class" }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select target classes"
                                style={{ width: '100%' }}
                                options={[
                                    "Nursery", "LKG", "UKG", 
                                    "CLASS 1", "CLASS 2", "CLASS 3", "CLASS 4", "CLASS 5",
                                    "CLASS 6", "CLASS 7", "CLASS 8", "CLASS 9", "CLASS 10",
                                    "CLASS 11", "CLASS 12"
                                ].map(cls => ({ label: cls, value: cls }))}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: "Please enter details" }]}
                    >
                        <Input.TextArea rows={5} placeholder="Write detail notice instructions..." />
                    </Form.Item>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <Button onClick={handleModalClose}>Cancel</Button>
                        <Button type="primary" htmlType="submit" className="bg-blue-600 htmlType-submit">
                            {info.editingId ? "Update" : "Publish"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default memo(AnnouncementPage);
