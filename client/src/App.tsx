import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import Blogs from "./pages/Blogs/Blogs";
import Blog from "./pages/Blog/Blog";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/authContext";
import { Publish } from "./pages/Publish/Publish";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { BlogProvider } from "./context/blogContext";

function App() {
  return (
    <>
      <AuthProvider>
        <BlogProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/signup" replace />} />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              ></Route>
              <Route
                path="/signin"
                element={
                  <PublicRoute>
                    <Signin />
                  </PublicRoute>
                }
              ></Route>
              <Route
                path="/blogs"
                element={
                  <PrivateRoute>
                    <Blogs />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/blogs/:id"
                element={
                  <PrivateRoute>
                    <Blog />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/publish"
                element={
                  <PrivateRoute>
                    <Publish />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/publish/:id"
                element={
                  <PrivateRoute>
                    <Publish />
                  </PrivateRoute>
                }
              />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </BrowserRouter>
        </BlogProvider>
      </AuthProvider>
    </>
  );
}

export default App;
