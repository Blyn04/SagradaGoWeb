import React, { useState, useEffect, useContext } from "react";
import { NavbarContext } from "../context/AllContext"; 
import "../styles/profile.css"; 
import { Modal, Button } from "antd";

export default function ProfilePage({ user, onLogout, updateUser }) {
  const { currentUser: contextUser } = useContext(NavbarContext); 
  const currentUser = contextUser || user; 

  const [formData, setFormData] = useState({
    first_name: currentUser?.first_name || "",
    middle_name: currentUser?.middle_name || "",
    last_name: currentUser?.last_name || "",
    email: currentUser?.email || "",
    contact_number: currentUser?.contact_number || "",
    birthday: currentUser?.birthday || "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || "",
        middle_name: currentUser.middle_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
        contact_number: currentUser.contact_number || "",
        birthday: currentUser.birthday || "",
      });
    }
  }, [currentUser]);

  if (!currentUser) return <p>Loading profile...</p>;

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "first_name":
      case "last_name":
        if (!value.trim()) error = `${field.replace("_", " ")} is required`;
        else if (!/^[a-zA-Z\s\-']+$/.test(value)) error = "Must contain only letters";
        else if (value.trim().length < 2) error = "Must be at least 2 characters";
        break;

      case "middle_name":
        if (value && !/^[a-zA-Z\s\-']+$/.test(value)) error = "Must contain only letters";
        break;

      case "contact_number":
        if (!value.trim()) error = "Contact number is required";
        else if (!/^[0-9]+$/.test(value)) error = "Must contain only digits";
        else if (value.length !== 11) error = "Must be exactly 11 digits";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";

        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
        break;

      default:
        break;
    }

    return error;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field] || errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, formData[field]) }));
  };

  const validateForm = () => {
    const fields = ["first_name", "last_name", "middle_name", "email", "contact_number"];
    let hasErrors = false;
    const newErrors = {};
    const newTouched = {};

    fields.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(newTouched);

    return !hasErrors;
  };

  const handleSave = async () => {
    if (!validateForm()) return alert("Please fix the errors in the form.");

    setIsSaving(true);
    try {
      if (!updateUser) return alert("updateUser function not provided.");

      const result = await updateUser(formData);
      if (result.success) {
        alert(result.message || "Profile updated successfully!");
        setIsEditing(false);

      } else {
        alert(result.message || "Failed to update profile.");
      }

    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");

    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || "",
        middle_name: currentUser.middle_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
        contact_number: currentUser.contact_number || "",
        birthday: currentUser.birthday || "",
      });
    }
    setErrors({});
    setTouched({});
    setIsEditing(false);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    if (onLogout) onLogout();
  };

  const fullName = `${currentUser?.first_name || ""} ${currentUser?.middle_name || ""} ${currentUser?.last_name || ""}`;

  return (
    <div className="profileContainer">
      <h2>{fullName}</h2>
      <p>{currentUser?.email}</p>

      <div className="formGroup">
        <label>First Name</label>
        <input
          type="text"
          value={formData.first_name}
          onChange={(e) => handleInputChange("first_name", e.target.value)}
          onBlur={() => handleBlur("first_name")}
          disabled={!isEditing}
        />
        {errors.first_name && <span className="error">{errors.first_name}</span>}
      </div>

      <div className="formGroup">
        <label>Middle Name</label>
        <input
          type="text"
          value={formData.middle_name}
          onChange={(e) => handleInputChange("middle_name", e.target.value)}
          onBlur={() => handleBlur("middle_name")}
          disabled={!isEditing}
        />
        {errors.middle_name && <span className="error">{errors.middle_name}</span>}
      </div>

      <div className="formGroup">
        <label>Last Name</label>
        <input
          type="text"
          value={formData.last_name}
          onChange={(e) => handleInputChange("last_name", e.target.value)}
          onBlur={() => handleBlur("last_name")}
          disabled={!isEditing}
        />
        {errors.last_name && <span className="error">{errors.last_name}</span>}
      </div>

      <div className="formGroup">
        <label>Contact Number</label>
        <input
          type="text"
          value={formData.contact_number}
          onChange={(e) => handleInputChange("contact_number", e.target.value)}
          onBlur={() => handleBlur("contact_number")}
          disabled={!isEditing}
        />
        {errors.contact_number && <span className="error">{errors.contact_number}</span>}
      </div>

      <div className="formGroup">
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          disabled={!isEditing}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      {!isEditing ? (
        <Button type="primary" onClick={() => setIsEditing(true)}>
          Edit Profile
        </Button>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave} loading={isSaving}>
            Save
          </Button>
        </div>
      )}

      <Button type="default" danger style={{ marginTop: "20px" }} onClick={() => setShowLogoutModal(true)}>
        Logout
      </Button>

      <Modal
        visible={showLogoutModal}
        title="Confirm Logout"
        onCancel={() => setShowLogoutModal(false)}
        onOk={handleLogoutConfirm}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
}
