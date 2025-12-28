import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, Typography, Table, message, Button, Spin, Popconfirm, Input, Select, Row, Col, Space } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { API_URL } from "../../Constants";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function VolunteersList() {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);
  const [monthFilter, setMonthFilter] = useState(null);

  const uniqueRoles = useMemo(() => {
    const roles = new Set();
    volunteers.forEach((v) => {
      if (v.role) roles.add(v.role);
    });
    return Array.from(roles).sort();
  }, [volunteers]);

  const monthOptions = useMemo(() => {
    const months = [];
    const currentDate = dayjs();
    for (let i = 0; i < 12; i++) {
      const date = currentDate.subtract(i, 'month');
      const monthKey = date.format('YYYY-MM');
      const monthLabel = date.format('MMMM YYYY');
      months.push({ value: monthKey, label: monthLabel });
    }
    return months;
  }, []);

  const applyAllFilters = useCallback((volunteersList, search, status, role, month) => {
    let filtered = volunteersList;

    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((volunteer) => {
        const name = (volunteer.name || "").toLowerCase();
        const contact = (volunteer.contact || "").toLowerCase();
        const volunteerRole = (volunteer.role || "").toLowerCase();
        const volunteerStatus = (volunteer.status || "").toLowerCase();
        const eventTitle = (volunteer.eventTitle || "").toLowerCase();

        return (
          name.includes(searchLower) ||
          contact.includes(searchLower) ||
          volunteerRole.includes(searchLower) ||
          volunteerStatus.includes(searchLower) ||
          eventTitle.includes(searchLower)
        );
      });
    }

    if (status) {
      filtered = filtered.filter((volunteer) => volunteer.status === status);
    }

    if (role) {
      filtered = filtered.filter((volunteer) => volunteer.role === role);
    }

    if (month) {
      filtered = filtered.filter((volunteer) => {
        if (!volunteer.createdAt) return false;
        const volunteerMonth = dayjs(volunteer.createdAt).format('YYYY-MM');
        return volunteerMonth === month;
      });
    }

    return filtered;
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/getAllVolunteers`);
      const fetchedVolunteers = response?.data?.volunteers || [];

      const formattedVolunteers = fetchedVolunteers.map((v) => ({
        ...v,
        key: v._id,
        createdAtFormatted: v.createdAt
          ? new Date(v.createdAt).toLocaleDateString()
          : "N/A",
      }));

      setVolunteers(formattedVolunteers);
      setFilteredVolunteers(applyAllFilters(formattedVolunteers, searchText, statusFilter, roleFilter, monthFilter));

    } catch (err) {
      console.error("Error fetching volunteers:", err);
      message.error("Failed to fetch volunteers. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
  };

  const handleMonthFilterChange = (value) => {
    setMonthFilter(value);
  };

  const clearAllFilters = () => {
    setSearchText("");
    setStatusFilter(null);
    setRoleFilter(null);
    setMonthFilter(null);
  };


  useEffect(() => {
    setFilteredVolunteers(applyAllFilters(volunteers, searchText, statusFilter, roleFilter, monthFilter));
  }, [searchText, statusFilter, roleFilter, monthFilter, volunteers, applyAllFilters]);

  const handleStatusUpdate = async (volunteer_id, newStatus) => {
    setUpdating(true);
    try {
      await axios.post(`${API_URL}/updateVolunteerStatus`, { volunteer_id, status: newStatus });
      message.success(`Volunteer ${newStatus} successfully.`);
      fetchVolunteers();

    } catch (err) {
      console.error("Error updating volunteer:", err);
      message.error("Failed to update volunteer status.");

    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "gray";
        if (status === "confirmed") color = "green";
        else if (status === "pending") color = "orange";
        else if (status === "cancelled") color = "red";
        return <span style={{ color, fontWeight: 500 }}>{status}</span>;
      },
    },
    { title: "Event", dataIndex: "eventTitle", key: "eventTitle" },
    { title: "Signed Up", dataIndex: "createdAtFormatted", key: "createdAt" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {record.status !== "confirmed" && (
            <Popconfirm
              title="Confirm this volunteer?"
              onConfirm={() => handleStatusUpdate(record._id, "confirmed")}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" size="small" loading={updating}>
                Approve
              </Button>
            </Popconfirm>
          )}
          {record.status !== "cancelled" && (
            <Popconfirm
              title="Cancel this volunteer?"
              onConfirm={() => handleStatusUpdate(record._id, "cancelled")}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger" size="small" loading={updating}>
                Reject
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1550px", margin: "0 auto", marginTop: 20 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={2} style={{ fontFamily: 'Poppins' }}>All Volunteers</Title>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Spin size="large" />
            </div>
          ) : (
            <Card>
              <div style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Search
                      placeholder="Search volunteers..."
                      allowClear
                      enterButton={<SearchOutlined />}
                      size="large"
                      value={searchText}
                      onChange={(e) => handleSearch(e.target.value)}
                      onSearch={handleSearch}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={4}>
                    <Select
                      placeholder="Filter by Status"
                      allowClear
                      size="large"
                      style={{ width: "100%" }}
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      suffixIcon={<FilterOutlined />}
                    >
                      <Option value="confirmed">Confirmed</Option>
                      <Option value="pending">Pending</Option>
                      <Option value="cancelled">Cancelled</Option>
                    </Select>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={4}>
                    <Select
                      placeholder="Filter by Role"
                      allowClear
                      size="large"
                      style={{ width: "100%" }}
                      value={roleFilter}
                      onChange={handleRoleFilterChange}
                      suffixIcon={<FilterOutlined />}
                    >
                      {uniqueRoles.map((role) => (
                        <Option key={role} value={role}>
                          {role}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Select
                      placeholder="Filter by Month"
                      allowClear
                      size="large"
                      style={{ width: "100%" }}
                      value={monthFilter}
                      onChange={handleMonthFilterChange}
                      suffixIcon={<FilterOutlined />}
                    >
                      {monthOptions.map((month) => (
                        <Option key={month.value} value={month.value}>
                          {month.label}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={4}>
                    <Button
                      size="large"
                      onClick={clearAllFilters}
                      style={{ width: "100%" }}
                      disabled={!searchText && !statusFilter && !roleFilter && !monthFilter}
                    >
                      Clear Filters
                    </Button>
                  </Col>
                </Row>
              </div>
              <Table
                columns={columns}
                dataSource={filteredVolunteers}
                pagination={{ pageSize: 10 }}
                rowKey="_id"
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
