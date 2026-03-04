import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import MyPageScreen from "./pages/MyPageScreen.js";
import FollowingPageScreen from "./pages/FollowingPageScreen.js";


import {AuthProvider} from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "./pages/AppLayout";

console.log("MyPageScreen typeof:", typeof MyPageScreen, MyPageScreen);
console.log("FollowingPageScreen typeof:", typeof FollowingPageScreen, FollowingPageScreen);
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
          </Route>
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;