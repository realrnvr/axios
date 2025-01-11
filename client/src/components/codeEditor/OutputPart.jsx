import { codeErrorAtom, outputAtom } from "../../Atoms/Atom";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { Button } from "../ui/button";

const OutputPart = () => {
  const codeError = useRecoilValue(codeErrorAtom);
  const output = useRecoilValue(outputAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogToggle = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <div className="w-full md:w-1/2 mx-auto bg-neutral-900 p-6 rounded-lg shadow-lg">
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Output:</h4>
        <pre className="w-full bg-neutral-900 text-white p-4 rounded-lg break-words overflow-hidden">
  <span
    style={{ color: codeError ? "red" : "inherit" }}
    dangerouslySetInnerHTML={{
      __html: output.replace(/\n/g, "<br />"),
    }}
  />
</pre>

        {output && (
            <Button  className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleDialogToggle}>
            view       
            </Button>
         
        )}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-[90%] overflow-auto">
            <h4 className="text-lg font-semibold mb-4">Full Output:</h4>
            <pre className="bg-gray-800 p-4 rounded-lg">
              <span
                style={{ color: codeError ? "red" : "inherit" }}
                dangerouslySetInnerHTML={{
                  __html: output.replace(/\n/g, "<br />"),
                }}
              />
            </pre>
            <Button className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={handleDialogToggle}>
           Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputPart;
