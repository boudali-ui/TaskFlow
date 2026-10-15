import "./Dashboard.css"
import TaskCard from "../components/TaskCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

const Dashboard = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleResponse = async (res) => {
        if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return null;
        }
        const data = await res.json();

        if (!res.ok) {
            setError(data.message);
            return null;
        }

        setError("");

        return data;
    };

    const getToken = () => {
        const token = localStorage.getItem("token");
        return token;
    }

    const addTask = () => {
        if (!title.trim() || !description.trim()) {
            return;
        }

        const token = getToken();
        if (!token) {
            return;
        }

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                description
            })
        }).then((res) => handleResponse(res))
            .then((data) => {
                if (!data) {
                    return;
                }
                setTasks([...tasks, data]);
                setTitle("");
                setDescription("");
            });
    }

    const deleteTask = (id) => {
        const token = getToken();
        if (!token) {
            return;
        }
        fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => handleResponse(res))
            .then((data) => {
                if (!data) {
                    return;
                }
                setTasks(tasks.filter((task) => task._id !== id));
            });
    }

    const startEdit = (id) => {
        const editing = tasks.find((task) => task._id === id);
        if (!editing) {
            return;
        }
        setEditingId(id);
        setTitle(editing.title);
        setDescription(editing.description);
    }

    const updateTask = () => {
        const editing = tasks.find((task) => task._id === editingId);
        if (!editing) {
            return;
        }

        const token = getToken();
        if (!token) {
            return;
        }

        fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                description,
                status: editing.status,
            })
        }).then((res) => handleResponse(res))
            .then((data) => {
                if (!data) {
                    return;
                }
                const updatedTasks = tasks.map((task) => {
                    if (task._id === data._id) {
                        return data;
                    }
                    return task;
                });
                setTasks(updatedTasks);
                setEditingId(null);
                setTitle("");
                setDescription("");
            });
    }

    const toggleStatus = (id) => {
        const findtask = tasks.find((task) => task._id === id);
        if (!findtask) {
            return;
        }

        const updatedTask = {
            ...findtask,
            status: findtask.status === "Pending" ? "Completed" : "Pending",
        }

        const token = getToken();
        if (!token) {
            return;
        }

        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedTask)
        }).then((res) => handleResponse(res))
            .then((data) => {
                if (!data) {
                    return;
                }
                const updatedStatus = tasks.map((task) => {
                    if (task._id === data._id) {
                        return data;
                    }
                    return task;
                })
                setTasks(updatedStatus);
            })
    }

    const filteredTasks = () => {
        return tasks.filter((task) => {
            const matchesFilter = filter === "All" || task.status === filter;
            const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }

    useEffect(() => {
        const token = getToken();
        if (!token) {
            return;
        }
        fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => handleResponse(res))
            .then((data) => {
                if (!data) {
                    return;
                }
                setTasks(data);
            });
    }, [navigate]);

    return (
        <div className="Dashboard">
            <div className="Header">
                <h1>TaskFlow Dashboard</h1>
                <div className="Title" >
                    <label htmlFor="name">Task Title:</label>
                    <input
                        id="name"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="description">
                    <label htmlFor="description">Task Description:</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button onClick={editingId === null ? addTask : updateTask}> {editingId === null ? "Add Task" : "Update Task"} </button>
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="filterButtons">
                    <button className={`filter-btn ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>All</button>
                    <button className={`filter-btn ${filter === "Pending" ? "active" : ""}`} onClick={() => setFilter("Pending")}>Pending</button>
                    <button className={`filter-btn ${filter === "Completed" ? "active" : ""}`} onClick={() => setFilter("Completed")}>Completed</button>
                </div>
                {error && <p>{error}</p>}
            </div>
            <div className="Tasks">
                {filteredTasks().map((task) => (
                    <TaskCard
                        key={task._id}
                        id={task._id}
                        title={task.title}
                        description={task.description}
                        status={task.status}
                        deleteTask={deleteTask}
                        startEdit={startEdit}
                        toggleStatus={toggleStatus}
                    />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;



