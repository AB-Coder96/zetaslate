import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Weather from "./pages/weather";
import Layout from "./components/Layout";
import TestGridPage from "./components/testgrid";   // ← ADD

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <header className="flex items-center justify-between p-4">
      <Weather location="New York" variant="compact" />
    </header>
        <Routes>
          {/* Home page now renders Home + TestGrid together */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <TestGridPage />
              </>
            }
          />
          <Route path="/post/:id" element={<Post />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
