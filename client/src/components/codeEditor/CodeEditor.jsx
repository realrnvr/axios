import React from 'react';
import PropTypes from "prop-types";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { languageAtom, inputAtom, codeAtom, outputAtom, codeErrorAtom } from "../../Atoms/Atom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const SUPPORTED_LANGUAGES = {
  javascript: { label: "JavaScript", defaultCode: "console.log('Hello World!');" },
  python: { label: "Python", defaultCode: "print('Hello World!')" },
  cpp: { label: "C++", defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}' },
  java: { label: "Java", defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}' }
};

const CodeEditor = () => {
  const [language, setLanguage] = useRecoilState(languageAtom);
  const [input, setInput] = useRecoilState(inputAtom);
  const [code, setCode] = useRecoilState(codeAtom);
  const [output, setOutput] = useRecoilState(outputAtom);
  const [codeError, setCodeError] = useRecoilState(codeErrorAtom);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setCode(SUPPORTED_LANGUAGES[language]?.defaultCode || "");
  }, [language, setCode]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const API = axios.create({
    baseURL: "https://emkc.org/api/v1/piston",
  });

  const handleCodeRun = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 w-full gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleCodeRun}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              'Run Code'
            )}
          </Button>

          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-neutral-800 text-white rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {output && !codeError && (
          <div className="text-green-400 text-sm">
            Execution successful
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[400px]">
        <MonacoEditor
          language={language}
          theme="vs-dark"
          value={code}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
          onChange={handleEditorChange}
        />
      </div>

      {codeError && (
        <Alert variant="destructive">
          <AlertDescription className="font-mono whitespace-pre-wrap">
            {codeError}
          </AlertDescription>
        </Alert>
      )}

    
    </div>
  );
};

CodeEditor.propTypes = {
  meetingId: PropTypes.string,
};

export default CodeEditor;