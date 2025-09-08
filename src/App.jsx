import "./App.css";
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Note from "./Components/Note";
import ViewNote from "./Components/ViewNote";

// Layout component with Navbar and content area
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="py-6">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="notes" element={<Note />} />
          <Route path="notes/:id" element={<ViewNote />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
