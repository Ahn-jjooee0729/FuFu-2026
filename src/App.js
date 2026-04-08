import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import MyPageScreen from "./pages/MyPageScreen.js";
import FollowingPageScreen from "./pages/FollowingPageScreen.js";
import Upload from "./pages/Upload.js";
import CategoryPage from "./pages/CategoryPage";
import MyCategoryPage from "./pages/MyCategoryPage.js";
import CommunityPage from "./pages/CommunityPage.js";


import {AuthProvider} from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "./pages/AppLayout";

function App(){
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
              <Route path="/home" element={<Home />} />
              <Route path="/followers" element={<FollowingPageScreen />} />
              <Route path="/mypage" element={<MyPageScreen />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/mypage/category/:categoryName" element={<MyCategoryPage />}/>
              <Route path="/category/:categoryName/community" element={<CommunityPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;