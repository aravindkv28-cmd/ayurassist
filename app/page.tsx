// app/page.tsx
'use client';
import { useState } from 'react';
import Image from 'next/image'; // Import the Image component

// Define the type for our search results
type SearchResult = {
  id: number;
  disease_name: string;
  ayurvedic_term: string;
  snomed_code: string;
  patient_explanation: string;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      {/* Ayurveda Logo with Green Background */}
      <div className="relative w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6 shadow-xl overflow-hidden">
        <Image
          src="/366-3666700_ayurveda-symbol-png-natural-medicine-logo.jpg" // Path to your logo in the public folder" // Path to your logo in the public folder
          alt="Ayurveda Symbol"
          width={60} // Adjust size as needed
          height={60} // Adjust size as needed
          objectFit="contain" // Ensures the image fits within the div
        />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-indigo-800">
        AyurAssist Portal
      </h1>

      {/* Search Bar */}
      <form 
        onSubmit={handleSearch} 
        className="w-full max-w-2xl flex shadow-lg shadow-indigo-100"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter an Ayurvedic or English term (e.g., 'Jvara' or 'Fever')"
          className="flex-grow p-4 border-2 border-indigo-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-lg"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-4 bg-indigo-600 text-white rounded-r-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 text-lg"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Results Section */}
      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Results:
        </h2>

        {isLoading && (
          <div className="text-center text-gray-600">Loading results...</div>
        )}

        {!isLoading && hasSearched && results.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-600 text-center">No results found for "{query}"</p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((result) => (
              <div 
                key={result.id} 
                className="bg-white p-6 rounded-lg shadow-lg shadow-indigo-50 border border-gray-200 transition-all hover:shadow-indigo-200"
              >
                <h3 className="text-xl font-bold text-indigo-700">
                  {result.disease_name} / {result.ayurvedic_term}
                </h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  <strong>SNOMED CT Code:</strong> {result.snomed_code}
                </p>
                <p className="text-gray-800 mt-3">
                  {result.patient_explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}