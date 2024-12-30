import { useState, useEffect, useRef } from "react";
import { Plus, X, GripVertical, Save, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import "./TaskPlanner.css";
import Navbar from "../navbar/Navbar";

const TaskPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const categories = [
    { value: "todo", label: "To Do", color: "bg-blue-100" },
    { value: "inProgress", label: "In Progress", color: "bg-yellow-100" },
    { value: "done", label: "Done", color: "bg-green-100" },
    { value: "blocked", label: "Blocked", color: "bg-red-100" },]

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error parsing tasks:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setTasks(prevTasks =>
          prevTasks.map(task => {
            if (task.id === dragging) {
              return {
                ...task,
                position: {
                  x: e.clientX - offset.x,
                  y: e.clientY - offset.y,
                },
              };
            }
            return task;
          })
        );
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  const startDragging = (e, taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setDragging(taskId);
    setOffset({
      x: e.clientX - task.position.x,
      y: e.clientY - task.position.y,
    });
    e.stopPropagation();
  };

  const handleSaveToLocal = () => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      alert("Tasks saved!");
    } catch (error) {
      alert("Error saving tasks: " + error.message);
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: "",
        category: "todo",
        position: {
          x: Math.random() * (window.innerWidth - 320),
          y: Math.random() * (window.innerHeight - 220) + 80,
        },
        dueDate: "",
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle("");
    }
  };

  const handleUpdateTask = (taskId, updates) => {
    setTasks(prev =>
      prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="task-container">
      <Navbar />
      <div className="task-planner" ref={containerRef}>
        <div className="controls-container">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-64"
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
          />
          <Button onClick={handleAddTask} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          <Button onClick={handleSaveToLocal} variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>

        {tasks.map((task) => (
          <Card
            key={task.id}
            className={`task-card category-${task.category}`}
            style={{
              position: 'absolute',
              left: task.position.x,
              top: task.position.y,
              cursor: dragging === task.id ? 'grabbing' : 'grab',
              zIndex: dragging === task.id ? 1000 : 1,
            }}
          >
            <CardContent className="task-content">
              <div 
                className="task-header"
                onMouseDown={(e) => startDragging(e, task.id)}
              >
                <GripVertical className="w-4 h-4" />
                <span className="task-title">{task.title}</span>
                <div className="task-buttons">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask(selectedTask === task.id ? null : task.id);
                    }}
                    className="expand-button"
                  >
                    {selectedTask === task.id ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(task.id);
                    }}
                    className="delete-button"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {selectedTask === task.id && (
                <div className="task-details">
                  <Select
                    value={task.category}
                    onValueChange={(value) =>
                      handleUpdateTask(task.id, { category: value })
                    }
                    className="task-select"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.value}
                          value={category.value}
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Add description..."
                    value={task.description}
                    onChange={(e) =>
                      handleUpdateTask(task.id, {
                        description: e.target.value,
                      })
                    }
                    className="task-textarea"
                  />
                  <Input
                    type="date"
                    value={task.dueDate}
                    onChange={(e) =>
                      handleUpdateTask(task.id, { dueDate: e.target.value })
                    }
                    className="task-date"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskPlanner;