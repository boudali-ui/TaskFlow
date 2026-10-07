const TaskCard = ({ id, title, description, status, deleteTask, startEdit, toggleStatus }) => {
    return (
        <div className="TaskCard">
            <h3> {title} </h3>
            <p className="description"> {description} </p>
            <p className={`status ${status === "Completed" ? "completed" : "pending"}`}> {status} </p>
            <div className="buttons">
                <button className="edit" onClick={() => { startEdit(id) }} >Edit</button>
                <button className="delete" onClick={() => { deleteTask(id) }} >Delete</button>
                <button className={`toggle ${status === "Pending" ? "complete" : "pending"}`} onClick={() => { toggleStatus(id) }}> {status === "Pending" ? "Mark Completed" : "Mark Pending"} </button>
            </div>
        </div>
    );
}

export default TaskCard;