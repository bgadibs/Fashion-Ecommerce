import React, { useEffect, useState } from "react";

import {
    getSuperAdmins,
    createSuperAdmin,
    updateSuperAdmin,
    activateSuperAdmin,
    deactivateSuperAdmin,
    deleteSuperAdmin
} from "../services/api";

import "../css/admin-management.css";

const AdminManagement = () => {

    const [admins, setAdmins] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingAdmin, setEditingAdmin] =
        useState(null);

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });


    // =====================================================
    // LOAD ADMINS
    // =====================================================

    const loadAdmins = async () => {

        try {

            setLoading(true);

            const response =
                await getSuperAdmins();

            if (response.data.success) {
                setAdmins(response.data.admins);
            }

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to load admins"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadAdmins();
    }, []);


    // =====================================================
    // INPUT
    // =====================================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // CREATE FORM
    // =====================================================

    const handleCreate = () => {

        setEditingAdmin(null);

        setFormData({
            name: "",
            email: "",
            phone: "",
            password: ""
        });

        setShowForm(true);
    };


    // =====================================================
    // EDIT FORM
    // =====================================================

    const handleEdit = (admin) => {

        setEditingAdmin(admin);

        setFormData({
            name: admin.name || "",
            email: admin.email || "",
            phone: admin.phone || "",
            password: ""
        });

        setShowForm(true);
    };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {

        setShowForm(false);

        setEditingAdmin(null);

        setFormData({
            name: "",
            email: "",
            phone: "",
            password: ""
        });
    };


    // =====================================================
    // SAVE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Name is required");
            return;
        }

        if (!formData.email.trim()) {
            alert("Email is required");
            return;
        }

        if (!editingAdmin && !formData.password) {
            alert("Password is required");
            return;
        }

        try {

            setSaving(true);

            let response;

            if (editingAdmin) {

                response = await updateSuperAdmin(
                    editingAdmin.id,
                    formData
                );

            } else {

                response =
                    await createSuperAdmin(formData);
            }

            if (response.data.success) {

                alert(response.data.message);

                closeForm();

                await loadAdmins();
            }

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to save admin"
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // ACTIVATE
    // =====================================================

    const handleActivate = async (id) => {

        try {

            const response =
                await activateSuperAdmin(id);

            alert(response.data.message);

            await loadAdmins();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to activate admin"
            );
        }
    };


    // =====================================================
    // DEACTIVATE
    // =====================================================

    const handleDeactivate = async (id) => {

        try {

            const response =
                await deactivateSuperAdmin(id);

            alert(response.data.message);

            await loadAdmins();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to deactivate admin"
            );
        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this admin?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const response =
                await deleteSuperAdmin(id);

            alert(response.data.message);

            await loadAdmins();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete admin"
            );
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="admin-management-loading">
                Loading administrators...
            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="admin-management">

            <div className="admin-management-header">

                <div>
                    <h1>Admin Management</h1>

                    <p>
                        Manage administrator accounts
                    </p>
                </div>

                <button
                    className="create-admin-btn"
                    onClick={handleCreate}
                >
                    + Create Admin
                </button>

            </div>


            {/* FORM */}

            {showForm && (

                <div className="admin-form-card">

                    <div className="form-header">

                        <h2>
                            {editingAdmin
                                ? "Edit Admin"
                                : "Create Admin"}
                        </h2>

                        <button
                            className="close-btn"
                            onClick={closeForm}
                        >
                            ×
                        </button>

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div>
                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Admin name"
                                />
                            </div>


                            <div>
                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Admin email"
                                />
                            </div>


                            <div>
                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone number"
                                />
                            </div>


                            <div>
                                <label>
                                    {editingAdmin
                                        ? "New Password"
                                        : "Password"}
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={
                                        editingAdmin
                                            ? "Optional"
                                            : "Password"
                                    }
                                />
                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closeForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingAdmin
                                        ? "Update Admin"
                                        : "Create Admin"}
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* ADMIN TABLE */}

            <div className="admin-table-card">

                <h2>Administrators</h2>

                {admins.length === 0 ? (

                    <div className="empty-admins">

                        <h3>
                            No admins found
                        </h3>

                        <p>
                            Create your first administrator.
                        </p>

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>


                            <tbody>

                                {admins.map((admin) => (

                                    <tr key={admin.id}>

                                        <td>
                                            {admin.id}
                                        </td>

                                        <td>
                                            {admin.name}
                                        </td>

                                        <td>
                                            {admin.email}
                                        </td>

                                        <td>
                                            {admin.phone || "-"}
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    admin.status === "active"
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }
                                            >
                                                {admin.status}
                                            </span>

                                        </td>

                                        <td>
                                            {new Date(
                                                admin.created_at
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>

                                            <div className="admin-actions">

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        handleEdit(admin)
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                {admin.status === "active" ? (

                                                    <button
                                                        className="deactivate-btn"
                                                        onClick={() =>
                                                            handleDeactivate(
                                                                admin.id
                                                            )
                                                        }
                                                    >
                                                        Deactivate
                                                    </button>

                                                ) : (

                                                    <button
                                                        className="activate-btn"
                                                        onClick={() =>
                                                            handleActivate(
                                                                admin.id
                                                            )
                                                        }
                                                    >
                                                        Activate
                                                    </button>

                                                )}


                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            admin.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
};

export default AdminManagement;