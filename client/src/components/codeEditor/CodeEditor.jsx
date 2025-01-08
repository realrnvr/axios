import { useState } from "react";
import PropTypes from "prop-types";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";

const CodeEditor = ({ meetingId }) => {
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState(""); // State for input
  const [code, setCode] = useState(""); // State for code
  const [output, setOutput] = useState(""); // State for output
  const [error, setError] = useState(""); // State for error

  // Handle changes to code editor content
  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  // Handle changes to input (text area) content
  const handleInputChange = (event) => {
    setInput(event.target.value); // Dynamically update input state
  };

  // Handle language selection change
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  // Create an Axios instance with base URL for the Piston API
  const API = axios.create({
    baseURL: "https://emkc.org/api/v1/piston",
  });

  // Handle code execution and API call
  const handleCodeRun = async () => {
    try {
      const response = await API.post("/execute", {
        language: language,
        source: code,
        stdin: input, // Pass the user input as stdin
        args: [],
      });

      const { output, error } = response.data;
      setOutput(output || "No output");
      setError(error || "");
    } catch (err) {
      setError("Error occurred while running code, sorry for the inconvenience.");
      setOutput("");
    }
  };

  return (
    <div className="h-full flex flex-col bg-black w-[350px]">
      {/* Language Selector */}
      <div className="mb-4 h-3">
        <select
          className="text-white bg-gray-700 p-1 rounded w-full"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Code Editor */}
      <div className="flex-1 mb-4 h-[60%]">
        <MonacoEditor
          language={language}
          theme="vs-dark"
          value={code}
          options={{
            selectOnLineNumbers: true,
            readOnly: false,
            fontSize: 14,
            automaticLayout: true,
          }}
          onChange={handleEditorChange}
        />
      </div>

      {/* Input and Output side by side */}
      <div className="flex mb-4 space-x-4">
        {/* Input Section */}
        <div className="w-1/2">
          <h4 className="text-white">Input:</h4>
          <textarea
            className="w-full h-full bg-gray-700 text-white p-2 rounded"
            placeholder="Enter your input"
            value={input}
            onChange={handleInputChange}
          />
        </div>

        {/* Output Section */}
        <div className="w-1/2">
          <h4 className="text-white">Output:</h4>
          <pre className="w-full h-full bg-gray-800 text-white p-2 rounded overflow-auto">
            {/* If error exists, show in red in output */}
            <span
              style={{ color: error ? "red" : "inherit" }}
              dangerouslySetInnerHTML={{
                __html: output.replace(/\n/g, "<br />"),
              }}
            />
          </pre>
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={handleCodeRun}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        Run
      </button>

      {/* Error Section */}
      {error && (
        <div className="mt-4 bg-red-700 p-2 rounded">
          <h4 className="text-white">Error:</h4>
          <pre className="text-white overflow-auto">{error}</pre>
        </div>
      )}
    </div>
  );
};

CodeEditor.propTypes = {
  meetingId: PropTypes.string,
};

export default CodeEditor;
