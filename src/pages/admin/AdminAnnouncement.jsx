import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axios from "axios";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const [form] = Form.useForm();

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/getAnnouncements");
      setAnnouncements(res.data.announcements || []);

    } catch (error) {
      console.log(error);
      message.error("Failed to load announcements");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openCreate = () => {
    setEditingData(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingData(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
    });

    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingData) {
        await axios.put(`/api/admin/updateAnnouncement/${editingData._id}`, values);
        message.success("Announcement updated");

      } else {
        await axios.post("/api/admin/createAnnouncement", values);
        message.success("Announcement created");
      }

      fetchAnnouncements();
      setIsModalOpen(false);

    } catch (error) {
      console.log(error);
      message.error("Error saving announcement");
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await axios.delete(`/api/admin/deleteAnnouncement/${id}`);
      message.success("Deleted successfully");
      fetchAnnouncements();

    } catch (error) {
      console.log(error);
      message.error("Failed to delete");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "25%",
    },
    {
      title: "Content",
      dataIndex: "content",
      render: (text) => <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>,
      width: "55%",
    },
    {
      title: "Actions",
      width: "20%",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => openEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this announcement?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteAnnouncement(record._id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Announcement Management"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchAnnouncements}>
            Refresh
          </Button>

          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Announcement
          </Button>
        </Space>
      }
    >
      <Table
        dataSource={announcements}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingData ? "Edit Announcement" : "Create Announcement"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Enter announcement title" />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Content is required" }]}
          >
            <Input.TextArea rows={6} placeholder="Enter announcement details" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
