import { inputAtom } from "../../Atoms/Atom";
import { useRecoilState } from "recoil";

const InputPart = () => {
  const [input, setInput] = useRecoilState(inputAtom);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className="w-full md:w-1/2 mx-auto bg-neutral-900 p-6 rounded-lg shadow-lg">
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Input:</h4>
        <textarea
          className="w-full h-40 md:h-64 bg-neutral-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 resize-none"
          placeholder="Enter your input here..."
          value={input}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default InputPart;
