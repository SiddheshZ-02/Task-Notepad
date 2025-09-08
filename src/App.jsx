import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "notes",
        element: <Note />
      },
      {
        path: "notes/:id",
        element: <ViewNote />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
