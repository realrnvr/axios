import React from 'react';
import { useRecoilValue } from "recoil";
import { codeErrorAtom, outputAtom } from "../../Atoms/Atom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal, Maximize2, X } from "lucide-react";

const OutputPart = () => {
  const codeError = useRecoilValue(codeErrorAtom);
  const output = useRecoilValue(outputAtom);
  const [isOpen, setIsOpen] = React.useState(false);

  const hasOutput = output && output.trim().length > 0;
  const outputLines = output.split('\n').length;
  const isLongOutput = outputLines > 5;

  const formatOutput = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index} className="block">
        {line || '\u00A0'}
      </span>
    ));
  };

  return (
    <div className="w-full md:w-1/2 mx-auto bg-neutral-900 rounded-lg shadow-lg border border-neutral-800">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-neutral-400" />
            <h4 className="text-lg font-semibold text-white">Output</h4>
          </div>
          {hasOutput && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh] max-h-96">
                <DialogHeader>
                  <DialogTitle>Full Output</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-auto">
                  {codeError ? (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription className="font-mono">
                        {formatOutput(output)}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <pre className="bg-neutral-950 p-6 rounded-lg font-mono  text-sm overflow-auto">
                      <code className="text-green-400">
                        {formatOutput(output)}
                      </code>
                    </pre>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                    className="gap-2"
                  >close
                    {/* <X className="h-4 w-4" /> */}
                  
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className={`relative ${isLongOutput ? 'max-h-[200px]' : ''} overflow-hidden`}>
          {codeError ? (
            <Alert variant="destructive">
              <AlertDescription className="font-mono">
                {formatOutput(output)}
              </AlertDescription>
            </Alert>
          ) : (
            <pre className={`w-full bg-neutral-950 text-green-400 p-4 rounded-lg font-mono text-sm ${isLongOutput ? 'overflow-hidden' : 'overflow-auto'}`}>
              <code>
                {formatOutput(output)}
              </code>
            </pre>
          )}
          
          {isLongOutput && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-900 to-transparent" />
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputPart;