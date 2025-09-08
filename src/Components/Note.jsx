import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromNotes } from "../redux/noteSlice";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Note = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const notes = useSelector((state) => state.note.notes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get excerpt from content
  const getExcerpt = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Filter notes by search term and category
  const filteredData = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || note.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Sort notes by creation date (newest first)
  const sortedNotes = [...filteredData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const confirmDelete = (noteId) => {
    setNoteToDelete(noteId);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (noteToDelete) {
      dispatch(removeFromNotes(noteToDelete));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const handleCopy = (copy) => {
    if (copy) {
      navigator.clipboard.writeText(copy);
      toast.success("Copied to clipboard");
    } else {
      toast.error("Nothing to copy");
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      personal: "bg-purple-100 text-purple-800",
      work: "bg-blue-100 text-blue-800",
      study: "bg-green-100 text-green-800",
      ideas: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Notes</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                type="search"
                placeholder="Search notes by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="study">Study</option>
              <option value="ideas">Ideas</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Link to="/">
              <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create New Note
              </button>
            </Link>
          </div>
        </div>

        {sortedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                <div className="p-4 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {note.title}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                        note.category
                      )}`}
                    >
                      {note.category || "Other"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {getExcerpt(note.content)}
                  </p>

                  <div className="text-xs text-gray-500 mb-2">
                    Created: {formatDate(note.createdAt)}
                  </div>
                </div>

                <div className="border-t border-gray-200 bg-gray-50 p-3 flex justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/notes/${note._id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/?noteId=${note._id}`)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCopy(note.content)}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => confirmDelete(note._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No notes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter !== "all"
                ? "Try changing your search or filter criteria"
                : "Get started by creating a new note"}
            </p>
            <div className="mt-6">
              <Link to="/">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create New Note
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this note?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Note;
