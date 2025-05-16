import React, { useEffect, useState } from 'react';

export default function GroupSelectComponent() {
  const [message, setMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [timeNeeded, setTimeNeeded] = useState('');
  const [rows, setRows] = useState(5); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(timeNeeded) < 1) {
      alert('Days needed must be at least 1.');
      return;
    }

    setMessage(`✅ Group added successfully!`);
    setGroupName('');
    setTimeNeeded('');
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setRows(3);
      } else {
        setRows(5);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center w-full space-y-3 bg-white rounded-lg shadow-md p-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-x-8 gap-y-4 w-full form-grid-collapse"
      >
        <h3 className="text-xl font-bold pb-2 col-span-full text-center">Group registration</h3>

        {/* Left Column */}
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-medium">Group Name *</label>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-medium">Days Needed *</label>
          <input
            type="number"
            placeholder="7"
            value={timeNeeded}
            onChange={(e) => setTimeNeeded(e.target.value)}
            min={1}
            className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Message Display */}
        {message && (
          <div className="text-sm col-span-full text-center text-black px-4 rounded-md">
            {message}
          </div>
        )}

        {/* Submit Button - Full Width */}
        <div className="col-span-full flex justify-center">
          <button
            type="submit"
            className="bg-[#002757] text-white py-1 px-4 rounded-md text-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
