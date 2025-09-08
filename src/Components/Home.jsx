import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToNotes, updateToNotes } from "../redux/noteSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("personal");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const noteId = searchParams.get("noteId");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allNotes = useSelector((state) => state.note.notes);

  useEffect(() => {
    if (noteId) {
      const note = allNotes.find((n) => n._id === noteId);
      if (note) {
        setTitle(note.title);
        setValue(note.content);
        setCategory(note.category || "personal");
      } else {
        toast.error("Note not found");
        setSearchParams({});
      }
    }
  }, [noteId, allNotes, setSearchParams]);

  const createNote = () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    if (!value.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }

    setIsLoading(true);

    const note = {
      title: title,
      content: value,
      category: category,
      _id: noteId || Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (noteId) {
        dispatch(updateToNotes(note));
      } else {
        dispatch(addToNotes(note));
      }
      
      setTitle("");
      setValue("");
      setCategory("personal");
      setSearchParams({});
      
      // Redirect to notes page after creating/updating
      setTimeout(() => {
        navigate("/notes");
      }, 1500);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {noteId ? "Edit Note" : "Create New Note"}
        </h1>
        
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            type="text"
            placeholder="Enter a descriptive title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="ideas">Ideas</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={value}
            placeholder="Write your note here..."
            onChange={(e) => setValue(e.target.value)}
            rows={12}
          />
        </div>

        <div className="flex justify-end">
          <button
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            } transition-colors`}
            onClick={createNote}
            disabled={isLoading}
          >
            {isLoading 
              ? "Processing..." 
              : noteId 
                ? "Update Note" 
                : "Save Note"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
