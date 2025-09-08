import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ViewNote = () => {
  const { id } = useParams();
  const allNotes = useSelector((state) => state.note.notes);
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundNote = allNotes.find((n) => n._id === id);
      if (foundNote) {
        setNote(foundNote);
      } else {
        toast.error("Note not found");
        setTimeout(() => {
          navigate("/notes");
        }, 1000);
      }
    }
    setLoading(false);
  }, [id, allNotes, navigate]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCategoryColor = (category) => {
    const colors = {
      personal: "bg-purple-100 text-purple-800",
      work: "bg-blue-100 text-blue-800",
      study: "bg-green-100 text-green-800",
      ideas: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[category] || colors.other;
  };

  const handleCopy = () => {
    if (note?.content) {
      navigator.clipboard.writeText(note.content);
      toast.success("Note content copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-500">Loading note...</div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Note not found</h2>
          <p className="text-gray-600 mb-6">The note you're looking for doesn't exist or has been deleted.</p>
          <Link to="/notes">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Back to Notes
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{note.title}</h1>
            <div className="flex items-center mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(note.category)}`}>
                {note.category || 'Other'}
              </span>
              <span className="text-sm text-gray-500 ml-4">
                Created: {formatDate(note.createdAt)}
              </span>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <span className="text-sm text-gray-500 ml-4">
                  Updated: {formatDate(note.updatedAt)}
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to={`/?noteId=${note._id}`}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit
              </button>
            </Link>
            <button 
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap">
          {note.content}
        </div>

        <div className="mt-6 flex justify-between">
          <Link to="/notes">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              Back to Notes
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewNote;