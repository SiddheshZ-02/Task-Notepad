import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Helper function to safely parse JSON from localStorage
const getSavedNotes = () => {
  try {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      
      // Ensure all notes have a category
      return parsedNotes.map(note => ({
        ...note,
        category: note.category || "personal"
      }));
    }
    return [];
  } catch (error) {
    console.error("Error loading notes from localStorage:", error);
    return [];
  }
};

// Helper function to safely save notes to localStorage
const saveNotesToStorage = (notes) => {
  try {
    localStorage.setItem("notes", JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error("Error saving notes to localStorage:", error);
    toast.error("Failed to save notes. Storage might be full.");
    return false;
  }
};

const initialState = {
  notes: getSavedNotes(),
  isLoading: false,
  error: null
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    addToNotes: (state, action) => {
      try {
        const note = {
          ...action.payload,
          category: action.payload.category || "personal"
        };
        
        state.notes.push(note);
        const saved = saveNotesToStorage(state.notes);
        
        if (saved) {
          toast.success("Note created successfully");
        }
      } catch (error) {
        console.error("Error adding note:", error);
        toast.error("Failed to create note");
      }
    },

    updateToNotes: (state, action) => {
      try {
        const note = {
          ...action.payload,
          category: action.payload.category || "personal",
          updatedAt: new Date().toISOString()
        };
        
        const index = state.notes.findIndex((item) => item._id === note._id);
        
        if (index >= 0) {
          state.notes[index] = note;
          const saved = saveNotesToStorage(state.notes);
          
          if (saved) {
            toast.success("Note updated successfully");
          }
        } else {
          toast.error("Note not found");
        }
      } catch (error) {
        console.error("Error updating note:", error);
        toast.error("Failed to update note");
      }
    },

    resetAllNotes: (state) => {
      try {
        state.notes = [];
        localStorage.removeItem("notes");
        toast.success("All notes have been deleted");
      } catch (error) {
        console.error("Error resetting notes:", error);
        toast.error("Failed to delete all notes");
      }
    },

    removeFromNotes: (state, action) => {
      try {
        const noteId = action.payload;
        const index = state.notes.findIndex((item) => item._id === noteId);
        
        if (index >= 0) {
          state.notes.splice(index, 1);
          const saved = saveNotesToStorage(state.notes);
          
          if (saved) {
            toast.success("Note deleted successfully");
          }
        } else {
          toast.error("Note not found");
        }
      } catch (error) {
        console.error("Error removing note:", error);
        toast.error("Failed to delete note");
      }
    },
    
    filterNotesByCategory: (state, action) => {
      // This is a UI-only action, actual filtering is done in the component
      // But we could add additional state management here if needed
    }
  },
});

// Action creators are generated for each case reducer function
export const { 
  addToNotes, 
  updateToNotes, 
  resetAllNotes, 
  removeFromNotes,
  filterNotesByCategory
} = noteSlice.actions;

export default noteSlice.reducer;
