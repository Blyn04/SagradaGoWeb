import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Constants";
import { auth } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import Button from "../../components/Button";

import { Table, Tag, Button as AntButton } from "antd";

export default function AccountManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); 
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    contact_number: "",
    birthday: "",
    email: "",
    password: "",
    confirmPassword: "",
    is_priest: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterType]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/getAllUsers`);
      setUsers(response.data);

    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (filterType === "priests") {
      filtered = filtered.filter((user) => user.is_priest === true);

    } else if (filterType === "users") {
      filtered = filtered.filter((user) => user.is_priest === false);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(term) ||
          user.last_name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.contact_number?.includes(term)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = async () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.contact_number) newErrors.contact_number = "Contact number is required";
    if (!formData.birthday) newErrors.birthday = "Birthday is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      const uid = user.uid;

      await sendEmailVerification(user);

      await axios.post(`${API_URL}/createUser`, {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        contact_number: formData.contact_number,
        birthday: formData.birthday,
        email: formData.email,
        password: formData.password,
        uid: uid,
        is_priest: formData.is_priest,
      });

      alert("User created successfully!");
      setShowAddModal(false);
      resetForm();
      fetchUsers();

    } catch (error) {
      console.error("Error creating user:", error);

      if (error.response) {
        alert(error.response.data.message || "Failed to create user.");

      } else if (error.code === "auth/email-already-in-use") {
        alert("Email is already in use.");

      } else {
        alert("Failed to create user. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (uid, newRole) => {
    if (!window.confirm(`Are you sure you want to ${newRole ? 'make this user a priest' : 'remove priest role from this user'}?`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${API_URL}/updateUserRole`, {
        uid: uid,
        is_priest: newRole,
      });

      alert(`User role updated successfully!`);
      fetchUsers();

    } catch (error) {
      console.error("Error updating user role:", error);
      alert(error.response?.data?.message || "Failed to update user role.");

    } finally {
      setLoading(false);
    }
  };

  const handleDisableUser = async (uid, currentStatus) => {
    const action = currentStatus ? "disable" : "enable";
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${API_URL}/updateUserStatus`, {
        uid,
        is_active: !currentStatus,
      });

      alert(`User account has been ${!currentStatus ? "enabled" : "disabled"} successfully!`);
      fetchUsers();

    } catch (error) {
      console.error("Error updating user status:", error);
      alert(error.response?.data?.message || `Failed to ${action} user account.`);

    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      contact_number: "",
      birthday: "",
      email: "",
      password: "",
      confirmPassword: "",
      is_priest: false,
    });

    setErrors({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "first_name",
      key: "name",
      render: (_, user) => (
        <span className="font-medium text-gray-900">
          {user.first_name} {user.middle_name} {user.last_name}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact",
      dataIndex: "contact_number",
      key: "contact",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      render: (date) => <span>{formatDate(date)}</span>,
    },
    {
      title: "Role",
      dataIndex: "is_priest",
      key: "role",
      render: (is_priest) => (
        <Tag color={is_priest ? "purple" : "blue"}>
          {is_priest ? "Priest" : "User"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <div className="flex gap-2">
          <AntButton
            size="small"
            type={user.is_priest ? "default" : "primary"}
            ghost={!user.is_priest}
            onClick={() => handleUpdateRole(user.uid, !user.is_priest)}
            loading={loading}
          >
            {user.is_priest ? "Remove Priest" : "Make Priest"}
          </AntButton>

          <AntButton
            size="small"
            danger={user.is_active ?? true}
            type={(user.is_active ?? true) ? "primary" : "default"}
            onClick={() =>
              handleDisableUser(user.uid, user.is_active ?? true)
            }
            loading={loading}
          >
            {user.is_active ?? true ? "Disable" : "Enable"}
          </AntButton>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Account Management</h1>
            <p className="text-gray-600 mt-1">Manage users and priests</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-[#b87d3e] text-white rounded-lg hover:bg-[#a06d2e] transition"
            >
              + Add User/Priest
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or contact number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b87d3e]"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg transition ${
                  filterType === "all"
                    ? "bg-[#b87d3e] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("users")}
                className={`px-4 py-2 rounded-lg transition ${
                  filterType === "users"
                    ? "bg-[#b87d3e] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setFilterType("priests")}
                className={`px-4 py-2 rounded-lg transition ${
                  filterType === "priests"
                    ? "bg-[#b87d3e] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Priests
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading && !filteredUsers.length ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <Table
              dataSource={filteredUsers}
              rowKey="uid"
              pagination={{ pageSize: 10 }}
              className="antd-table-custom"
              columns={columns}
            />
          )}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
