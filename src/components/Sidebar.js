import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { Layout, Typography, List, Button, Alert, Modal, Input, Menu, Dropdown, message } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import Todoist from "./Todoist";
const { Sider } = Layout;
const { Text } = Typography;
const Sidebar = () => {
    const [projects, setProjects] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [editProjectId, setEditProjectId] = useState(null);
    const [editProjectName, setEditProjectName] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_TOKEN);
    useEffect(() => { fetchProjects(); }, []);
    const fetchProjects = async () => {
        try {
            const allProjects = await api.getProjects();
            setProjects(allProjects);
            setFavorites(allProjects.filter((project) => project.isFavorite));
        }
        catch {
            setError("Failed to load projects. Please try again later.");
        }
    };
    const handleAddProject = async () => {
        if (!newProjectName.trim()) {
            message.warning("Project name cannot be empty.");
            return;
        }
        try {
            const newProject = await api.addProject({ name: newProjectName });
            setProjects([...projects, newProject]);
            console.log();
            if (newProject.isFavorite) {
                setFavorites([...favorites, newProject]);
            }
            setIsAddModalOpen(false);
            setNewProjectName("");
            message.success("Project added successfully.");
        }
        catch {
            setError("Failed to add project. Please try again later.");
        }
    };
    const handleDeleteProject = async (id) => {
        try {
            setProjects(projects.filter((project) => project.id !== id));
            setFavorites(favorites.filter((project) => project.id !== id));
            await api.deleteProject(id);
            message.success("Project deleted successfully.");
        }
        catch {
            setError("Failed to delete project. Please try again later.");
        }
    };
    const handleEditProject = async () => {
        if (!editProjectName.trim()) {
            message.warning("Project name cannot be empty.");
            return;
        }
        try {
            const updatedProject = await api.updateProject(editProjectId, { name: editProjectName });
            //console.log(updatedProject);
            setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
            setFavorites((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
            setIsEditModalOpen(false);
            setEditProjectId(null);
            setEditProjectName("");
            message.success("Project updated successfully.");
        }
        catch {
            setError("Failed to update project. Please try again later.");
        }
    };
    const toggleFavorite = async (projectId, isFavorite) => {
        try {
            const currentProject = projects.find(p => p.id === projectId);
            if (!currentProject)
                return;
            const updatedProject = await api.updateProject(projectId, {
                name: currentProject.name,
                isFavorite
            });
            setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
            if (isFavorite) {
                setFavorites((prev) => [...prev, updatedProject]);
            }
            else {
                setFavorites((prev) => prev.filter((p) => p.id !== updatedProject.id));
            }
            message.success("Favorite status updated.");
        }
        catch (error) {
            console.error(error);
            setError("Failed to update favorite status. Please try again later.");
        }
    };
    const menu = (projectId, projectName, isFavorite) => (_jsxs(Menu, { children: [_jsx(Menu.Item, { onClick: () => { setEditProjectId(projectId); setEditProjectName(projectName); setIsEditModalOpen(true); }, children: "Edit" }, "1"), _jsx(Menu.Item, { onClick: () => toggleFavorite(projectId, !isFavorite), children: isFavorite ? "Remove from Favorites" : "Add to Favorites" }, "2"), _jsx(Menu.Item, { onClick: () => handleDeleteProject(projectId), children: "Delete" }, "3")] }));
    return (_jsxs(Layout, { style: { minHeight: "100vh" }, children: [_jsxs(Sider, { width: 250, style: { background: "#f5f5f5", padding: "16px" }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [_jsx(Typography.Title, { level: 3, children: "Himanshu Projects" }), _jsx(Button, { type: "primary", shape: "circle", icon: _jsx(PlusOutlined, {}), onClick: () => setIsAddModalOpen(true), style: { backgroundColor: "#ff9933", borderColor: "#ff9933" } })] }), error && _jsx(Alert, { message: error, type: "error", showIcon: true, closable: true }), _jsx(Text, { strong: true, style: { marginTop: "16px", display: "block" }, children: "Favorites" }), _jsx(List, { dataSource: favorites, renderItem: (project) => (_jsxs(List.Item, { onClick: () => setSelectedProject({ id: project.id, name: project.name }), children: [_jsxs(Text, { children: ["# ", project.name] }), _jsx(Dropdown, { overlay: menu(project.id, project.name, project.isFavorite), trigger: ["click"], children: _jsx(MoreOutlined, { style: { cursor: "pointer", marginLeft: "18px" } }) })] })) }), _jsx(Typography.Text, { strong: true, style: { marginTop: "16px", display: "block" }, children: "All Projects" }), _jsx(List, { dataSource: projects, renderItem: (project) => (_jsxs(List.Item, { onClick: () => setSelectedProject({ id: project.id, name: project.name }), children: [_jsxs(Text, { children: ["# ", project.name] }), _jsx(Dropdown, { overlay: menu(project.id, project.name, project.isFavorite), trigger: ["click"], children: _jsx(MoreOutlined, {}) })] })) }), _jsx(Modal, { title: "Add New Project", visible: isAddModalOpen, onCancel: () => setIsAddModalOpen(false), onOk: handleAddProject, children: _jsx(Input, { placeholder: "Enter project name", value: newProjectName, onChange: (e) => setNewProjectName(e.target.value) }) }), _jsx(Modal, { title: "Edit Project Name", visible: isEditModalOpen, onCancel: () => setIsEditModalOpen(false), onOk: handleEditProject, children: _jsx(Input, { placeholder: "Enter new project name", value: editProjectName, onChange: (e) => setEditProjectName(e.target.value) }) })] }), _jsx(Layout, { style: { padding: "16px", flex: 1, backgroundColor: "#fff" }, children: selectedProject && _jsx(Todoist, { projectId: selectedProject.id, projectName: selectedProject.name, allProjects: projects.filter((p) => p.id !== selectedProject.id) }) })] }));
};
export default Sidebar;
