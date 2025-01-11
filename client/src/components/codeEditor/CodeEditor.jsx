import { useState } from "react";
import PropTypes from "prop-types";
import MonacoEditor from "@monaco-editor/react";
import "./CodeEditor.css";
import axios from "axios";
import { useRecoilState } from "recoil";
import { languageAtom,inputAtom,codeAtom,outputAtom,codeErrorAtom} from "../../Atoms/Atom"
import OutputPart from "./OutputPart";
import InputPart from "./InputPart";
import { Button } from "../ui/button";
const CodeEditor = () => {
  const [language, setLanguage] = useRecoilState(languageAtom);
  const [input, setInput] = useRecoilState(inputAtom);
  const [code, setCode] = useRecoilState(codeAtom); 
  const [output, setOutput] = useRecoilState(outputAtom);
  const [codeError, setCodeError] = useRecoilState(codeErrorAtom);

  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const API = axios.create({
    baseURL: "https://emkc.org/api/v1/piston",
  });

  const handleCodeRun = async () => {
    try {
      setOutput("");
      const response = await API.post("/execute", {
        language: language,
        source: code,
        stdin: input,
        args: [],
      });

      const { output, error } = response.data;
      setOutput(output || "No output");
      setCodeError(error || "");
    } catch (err) {
      setCodeError("Error occurred while running code, sorry for the inconvenience.");
      setOutput("");
    }
  };

  return (
    <div className="h-full flex flex-col bg-neutral-900 w-[100%]  mx-auto ">
      {/* Header with Language Selector and Run Button */}
      {/* <div className="items-center mb-4">
        <select
          className="text-white bg-gray-700 p-2 rounded"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
    
        <button
          onClick={handleCodeRun}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Run
        </button>
      </div> */}
  <div className="code--buttons-div">
    <Button onClick={handleCodeRun}
          className="bg-blue-500 text-white  mx-3 ">Run</Button>
  <select
          className="text-white text-sm bg-neutral-800 mx-3 py-5px rounded "
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
      <div className="flex-1 mt-1">
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
    
      
      {/* Error Section */}
      {codeError && (
        <div className="mt-4 bg-red-700 p-2 rounded">
          <h4 className="text-white">Error:</h4>
          <pre className="text-white overflow-auto">{codeError}</pre>
        </div>
      )}
    </div>
  );
};

CodeEditor.propTypes = {
  meetingId: PropTypes.string,
};

export default CodeEditor;
