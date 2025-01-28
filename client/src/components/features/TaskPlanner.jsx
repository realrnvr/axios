import { useState, useEffect } from "react";
import { Plus, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MinimalTaskPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("simpleTasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("simpleTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="h-full">
      {tasks.length === 0 ? (
        <div>
          <h3 className="slider__intro-title">Welcome to Task Planner</h3>
          <div className="slider__text-container">
            <p className="slider__description">
              Organize your tasks efficiently with a simple two-column layout.
            </p>
            <p className="slider__description">
              <strong className="slider__strong">Quick Add:</strong> Type and press Enter to add tasks
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <div className="flex items-center gap-3 mb-6">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            placeholder="Add new task..."
            className="flex-1 bg-[#1c1917] border-none text-white placeholder:text-gray-400"
          />
          <Button 
            onClick={addTask}
            className="bg-[#eab308] hover:bg-[#ca9a06] text-yellow"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="slider__grid">
          {/* Pending Tasks Column */}
          <div className="rounded-lg p-4 bg-[#1c1917] border border-black">
            <h2 className="text-xl font-semibold mb-4 text-yellow">Pending</h2>
            <div className="space-y-3">
              {tasks.filter(t => !t.completed).map(task => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-2 bg-[#262626] p-3 rounded-md border border-black"
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleTask(task.id)}
                    className="hover:bg-[#eab308]/20"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <span className="flex-1 text-white">{task.text}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="hover:bg-red-500/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Tasks Column */}
          <div className="rounded-lg p-4 bg-[#1c1917] border border-black">
            <h2 className="text-xl font-semibold mb-4 text-white">Completed</h2>
            <div className="space-y-3">
              {tasks.filter(t => t.completed).map(task => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-2 bg-[#262626] p-3 rounded-md border border-black"
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleTask(task.id)}
                    className="hover:bg-[#eab308]/20"
                  >
                    <CheckCircle className="w-4 h-4 text-[#eab308]" />
                  </Button>
                  <span className="flex-1 line-through text-gray-400">{task.text}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="hover:bg-red-500/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalTaskPlanner;