import React, { useEffect, useCallback } from 'react';
import PropTypes from "prop-types";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { languageAtom, inputAtom, codeAtom, outputAtom, codeErrorAtom } from "../../Atoms/Atom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import debounce from 'lodash/debounce';

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
  const [syncError, setSyncError] = React.useState(null);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = React.useState(0);
  const call = useCall();
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  // Initialize editor with default code
  useEffect(() => {
    setCode(SUPPORTED_LANGUAGES[language]?.defaultCode || "");
  }, [language, setCode]);

  // Debounced function to send code updates
  const debouncedSendCode = useCallback(
    debounce(async (newCode, newLanguage) => {
      try {
        const timestamp = Date.now();
        setLastUpdateTimestamp(timestamp);
        await call.sendCustomEvent({
          type: "code-update",
          data: {
            code: newCode,
            language: newLanguage,
            timestamp,
            sender: call.sessionId
          }
        });
        setSyncError(null);
      } catch (error) {
        setSyncError('Failed to sync code: ' + error.message);
        console.error('Error sending code:', error);
      }
    }, 1000),
    [call,language]
  );

  // Handle local code changes
  const handleEditorChange = (value) => {
    setCode(value);
    debouncedSendCode(value, language);
  };

  // Handle language changes
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    debouncedSendCode(code, newLanguage);
  };

  // Listen for remote code updates
  useEffect(() => {
    const handleRemoteUpdate = (event) => {
      if (event.type === "code-update" && 
          event.data.timestamp > lastUpdateTimestamp && 
          event.data.sender !== call.sessionId) {
        setCode(event.data.code);
        setLanguage(event.data.language);
      }
    };

    // Subscribe to custom events
    const unsubscribe = call.on('custom', handleRemoteUpdate);

    return () => {
      debouncedSendCode.cancel();
      unsubscribe();
    };
  }, [call, lastUpdateTimestamp,debouncedSendCode,setCode,setLanguage]);

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

      // Notify others about code execution result
      await call.sendCustomEvent({
        type: "code-execution",
        data: {
          output: output || "No output",
          error: error || "",
          executor: call.sessionId
        }
      });
    } catch (err) {
      setCodeError("Error occurred while running code, sorry for the inconvenience.");
      setOutput("");
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for remote code executions
  useEffect(() => {
    const handleCodeExecution = (event) => {
      if (event.type === "code-execution" && event.data.executor !== call.sessionId) {
        setOutput(event.data.output);
        setCodeError(event.data.error);
      }
    };

    const unsubscribe = call.on('custom', handleCodeExecution);
    return () => unsubscribe();
  }, [call,setCodeError,setOutput]);

  return (
    <div className="flex flex-col h-full bg-neutral-900 w-full gap-4 p-4 code-editior-wrapper">
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

          <div className="text-sm text-gray-400">
            {participants.length} participant{participants.length !== 1 ? 's' : ''} connected
          </div>
        </div>

        {output && !codeError && (
          <div className="text-green-400 text-sm">
            Execution successful
          </div>
        )}
      </div>

      {syncError && (
        <Alert variant="destructive">
          <AlertDescription>{syncError}</AlertDescription>
        </Alert>
      )}

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