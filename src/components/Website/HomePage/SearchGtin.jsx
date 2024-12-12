import { Barcode } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchGtin() {
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (barcode.trim()) {
      navigate(`/search/${barcode.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-xl">
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Search a barcode by name or code"
        className="w-full px-6 py-3 text-gray-900 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/30 shadow-lg"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
      >
        <Barcode className="w-4 h-4" />
        Search
      </button>
    </form>
  );
}

export default SearchGtin;