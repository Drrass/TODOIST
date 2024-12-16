import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { List, Button, message, Input, Checkbox, Dropdown, Menu } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SwapOutlined } from "@ant-design/icons";
const Todoist = ({ projectId, projectName, allProjects }) => {
    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
    const [error, setError] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_TOKEN);
    useEffect(() => {
        fetchTasks();
    }, [projectId]);
    const fetchTasks = async () => {
        try {
            const projectTasks = await api.getTasks({ projectId: projectId });
            setTasks(projectTasks);
        }
        catch (error) {
            console.error("Error fetching tasks:", error);
            setError("Failed to load tasks. Please try again later.");
        }
    };
    const handleAddTask = async () => {
        if (!newTaskName.trim()) {
            message.warning("Task name cannot be empty.");
            return;
        }
        try {
            const newTask = await api.addTask({
                content: newTaskName,
                description: newTaskDescription,
                projectId: projectId,
            });
            console.log(newTask);
            setTasks([...tasks, newTask]);
            setNewTaskName("");
            setNewTaskDescription("");
            setIsAddTaskVisible(false);
        }
        catch (error) {
            console.error("Error adding task:", error);
            setError("Failed to add task. Please try again later.");
        }
    };
    const handleDeleteTask = async (taskId) => {
        try {
            setTasks(tasks.filter((task) => task.id !== taskId));
            await api.deleteTask(taskId);
        }
        catch (error) {
            console.error("Error deleting task:", error);
            setError("Failed to delete task. Please try again later.");
        }
    };
    const handleEditClick = (task) => {
        setEditingTask({
            id: task.id,
            content: task.content,
            description: task.description || "",
        });
    };
    const handleUpdateTask = async () => {
        if (!editingTask)
            return;
        if (!editingTask.content.trim()) {
            message.warning("Task name cannot be empty.");
            return;
        }
        try {
            await api.updateTask(editingTask.id, {
                content: editingTask.content,
                description: editingTask.description,
            });
            setTasks(tasks.map((task) => task.id === editingTask.id
                ? { ...task, content: editingTask.content, description: editingTask.description }
                : task));
            setEditingTask(null);
        }
        catch (error) {
            console.error("Error updating task:", error);
            setError("Failed to update task. Please try again later.");
        }
    };
    const handleMoveTask = async (taskId, targetProjectId) => {
        try {
            const taskToMove = tasks.find(task => task.id === taskId);
            if (!taskToMove)
                return;
            await Promise.all([
                api.addTask({
                    content: taskToMove.content,
                    description: taskToMove.description || '',
                    projectId: targetProjectId
                }),
                api.deleteTask(taskId)
            ]);
            setTasks(tasks.filter(task => task.id !== taskId));
        }
        catch (error) {
            console.error("Error moving task:", error);
            setError("Failed to move task. Please try again later.");
        }
    };
    const moveMenu = (taskId) => (_jsx(Menu, { children: allProjects.map((project) => (_jsx(Menu.Item, { onClick: () => handleMoveTask(taskId, project.id), children: project.name }, project.id))) }));
    return (_jsxs("div", { style: { marginLeft: '80px', width: '700px' }, children: [_jsx("h2", { children: projectName }), error && _jsx("p", { style: { color: 'red' }, children: error }), _jsx(List, { dataSource: tasks, renderItem: (task) => (_jsx(List.Item, { children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', width: '100%' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', width: '100%' }, children: [_jsx(Checkbox, { checked: task.isCompleted, onChange: () => handleDeleteTask(task.id), style: { marginRight: '12px' } }), editingTask?.id === task.id ? (_jsxs("div", { style: { flex: 1 }, children: [_jsx(Input, { value: editingTask.content, onChange: (e) => setEditingTask({ ...editingTask, content: e.target.value }), style: { marginBottom: '8px' } }), _jsx(Input.TextArea, { value: editingTask.description, onChange: (e) => setEditingTask({ ...editingTask, description: e.target.value }), style: { marginBottom: '8px' } }), _jsx(Button, { type: "primary", onClick: handleUpdateTask, children: "Update Task" })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { style: { flex: 1, color: 'black', fontWeight: 'normal' }, children: task.content }), _jsx(EditOutlined, { onClick: () => handleEditClick(task), style: { cursor: 'pointer', marginLeft: '8px', color: 'grey', fontSize: '18px' } }), _jsx(Dropdown, { overlay: moveMenu(task.id), trigger: ['click'], children: _jsx(SwapOutlined, { style: { cursor: 'pointer', marginLeft: '8px', color: 'grey', fontSize: '18px' } }) }), _jsx(DeleteOutlined, { onClick: () => handleDeleteTask(task.id), style: { cursor: 'pointer', marginLeft: '8px', color: 'grey', fontSize: '18px' } })] }))] }), !editingTask && task.description && (_jsx("div", { style: { paddingLeft: '28px', marginTop: '4px' }, children: _jsx("p", { style: { color: 'grey', margin: 0 }, children: task.description }) }))] }) })), locale: {
                    emptyText: (_jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("img", { src: "https://img.freepik.com/premium-vector/vector-person-painting_844724-17899.jpg?w=360", alt: "No tasks", style: { width: '150px', marginBottom: '16px' } }), _jsx("h3", { children: "Start small (or dream big ...)" }), _jsx("p", { style: { color: 'grey' }, children: "Add a task or find a template to start with your project" })] }))
                } }), _jsx(Button, { type: "text", icon: _jsx(PlusOutlined, { style: { color: '#ff9933' } }), onClick: () => setIsAddTaskVisible(!isAddTaskVisible), style: { marginBottom: '16px' } }), isAddTaskVisible && (_jsxs("div", { children: [_jsx(Input, { placeholder: "Enter task name", value: newTaskName, onChange: (e) => setNewTaskName(e.target.value), style: { marginBottom: '8px' } }), _jsx(Input.TextArea, { placeholder: "Enter task description", value: newTaskDescription, onChange: (e) => setNewTaskDescription(e.target.value) }), _jsx(Button, { type: "text", icon: _jsx(PlusOutlined, { style: { color: '#ff9933' } }), onClick: handleAddTask, children: "Add Task" })] }))] }));
};
export default Todoist;
