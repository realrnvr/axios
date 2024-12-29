import { useState, useEffect } from 'react';
import { Plus, X, GripVertical, ArrowRight, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import './TaskPlanner.css';

const TaskPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [connections, setConnections] = useState([]);
  const [connectingMode, setConnectingMode] = useState(false);
  const [connectingStart, setConnectingStart] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const categories = [
    { value: 'todo', label: 'To Do', color: 'bg-blue-100' },
    { value: 'inProgress', label: 'In Progress', color: 'bg-yellow-100' },
    { value: 'done', label: 'Done', color: 'bg-green-100' },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-100' },
  ];

  useEffect(() => {
    console.log('Loading tasks and connections from localStorage...');
    const savedTasks = localStorage.getItem('tasks');
    const savedConnections = localStorage.getItem('connections');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedConnections) setConnections(JSON.parse(savedConnections));
  }, []);

  useEffect(() => {
    console.log('Saving tasks and connections to localStorage...');
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('connections', JSON.stringify(connections));
  }, [tasks, connections]);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const padding = 20; // Padding from edges
      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        description: '',
        category: 'todo',
        position: {
          x: Math.max(padding, Math.min(window.innerWidth - 320, Math.random() * (window.innerWidth - 320))),
          y: Math.max(padding + 80, Math.min(window.innerHeight - 220, Math.random() * (window.innerHeight - 220))),
        },
        dueDate: '',
      };
      
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const handleUpdateTask = (taskId, updates) => {
    console.log(`Updating task ${taskId}:`, updates);
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)));
  };

  const handleDeleteTask = (taskId) => {
    console.log(`Deleting task ${taskId}`);
    setTasks(tasks.filter((task) => task.id !== taskId));
    setConnections(connections.filter((conn) => conn.start !== taskId && conn.end !== taskId));
  };

  const handleDragStart = (e, taskId) => {
    if (!connectingMode) {
      console.log(`Started dragging task ${taskId}`);
      setDraggedTask(taskId);
      e.dataTransfer.setData('text/plain', '');
    }
  };

  const handleDrag = (e, taskId) => {
    if (draggedTask === taskId && e.clientX && e.clientY) { // Check if clientX and clientY exist
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          // Calculate new position with bounds checking
          const newX = Math.max(0, Math.min(window.innerWidth - 300, e.clientX - 150));
          const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - 30));
          
          return {
            ...task,
            position: {
              x: newX,
              y: newY,
            },
          };
        }
        return task;
      });
      setTasks(updatedTasks);
    }
  };
  const handleTaskClick = (taskId) => {
    if (connectingMode) {
      if (!connectingStart) {
        console.log(`Started connecting from task ${taskId}`);
        setConnectingStart(taskId);
      } else if (connectingStart !== taskId) {
        console.log(`Connecting tasks ${connectingStart} -> ${taskId}`);
        setConnections([...connections, { start: connectingStart, end: taskId }]);
        setConnectingStart(null);
        setConnectingMode(false);
      }
    } else {
      console.log(`Selecting task ${taskId}`);
      setSelectedTask(selectedTask === taskId ? null : taskId);
    }
  };

  const exportData = () => {
    console.log('Exporting tasks and connections...');
    const data = { tasks, connections };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task-planner-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="task-planner"  onDragOver={(e) => e.preventDefault()}>
      <div className="controls-container">
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
          className="w-64"
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button onClick={handleAddTask} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
        <Button variant={connectingMode ? 'secondary' : 'outline'} onClick={() => setConnectingMode(!connectingMode)}>
          <ArrowRight className="w-4 h-4 mr-2" />
          {connectingMode ? 'Cancel Connection' : 'Connect Tasks'}
        </Button>
        <Button variant="outline" onClick={exportData}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <svg className="connections">
        {connections.map((conn, idx) => {
          const startTask = tasks.find((t) => t.id === conn.start);
          const endTask = tasks.find((t) => t.id === conn.end);
          if (!startTask || !endTask) return null;

          const startX = startTask.position.x + 280;
          const startY = startTask.position.y + 30;
          const endX = endTask.position.x;
          const endY = endTask.position.y + 30;

          return (
            <path
              key={idx}
              className="connection-path"
              d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
              stroke="#94a3b8"
              strokeWidth="2"
              fill="none"
            />
          );
        })}
      </svg>

      {tasks.map((task) => (
        <div className="card-main-div" key={task}>
        <Card
          key={task.id}
          className={`task-card category-${task.category}`}
          style={{ 
            left: task.position.x, 
            top: task.position.y,
            position: 'absolute',
            transform: draggedTask === task.id ? 'scale(1.02)' : 'scale(1)',
            transition: 'transform 0.1s'
          }}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDrag={(e) => handleDrag(e, task.id)}
          onDragEnd={() => setDraggedTask(null)}
          onClick={() => handleTaskClick(task.id)}
        >
          <CardContent className="task-content">
            <div className="task-header">
              <GripVertical className="w-4 h-4" />
              <span className="task-title">{task.title}</span>
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
            {selectedTask === task.id && (
              <div className="task-details" onClick={(e) => e.stopPropagation()}>
                <Select
                  value={task.category}
                  onValueChange={(value) => handleUpdateTask(task.id, { category: value })}
                  className="task-select"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Add description..."
                  value={task.description}
                  onChange={(e) => handleUpdateTask(task.id, { description: e.target.value })}
                  className="task-textarea"
                />
                <Input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => handleUpdateTask(task.id, { dueDate: e.target.value })}
                  className="task-date"
                />
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      ))}
    </div>
  );
};

export default TaskPlanner;
