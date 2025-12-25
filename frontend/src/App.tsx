import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Weather from "./pages/weather";
import Layout from "./components/Layout";
import TestGridPage from "./components/testgrid";   // ← ADD
import AuthButtons from "./components/AuthButtons";

function App() {
  return (
    <BrowserRouter>
      <Layout>
      <header className="p-4">

      </header>
        <Routes>
          {/* Home page now renders Home + TestGrid together */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <TestGridPage />
                        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Weather location="New York"   variant="compact" className="w-full" />
          <Weather location="Los Angeles" variant="compact" className="w-full" />
          <Weather location="Sarajevo"   variant="compact" className="w-full" />
          <Weather location="London"     variant="compact" className="w-full" />
          <Weather location="Ankara"     variant="compact" className="w-full" />
          <Weather location="Beijing"    variant="compact" className="w-full" />
        </div>
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
