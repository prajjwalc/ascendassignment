// ** React Imports
import React, { useContext } from "react"
// ** React Router v6 Imports
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// ** Components Imports
import Header from "@/components/Header"
import Home from "@/pages/Home"
import Signin from "@/pages/Signin"
import Signup from "@/pages/Signup"
import { Toaster } from "@/components/ui/toaster"

// ** Context
import AuthContextProvider from "@/context/AuthContext"
import UserContextProvider from "@/context/UserContext"
import { AuthContext } from "./context/AuthContext"

// Custom PrivateRoute component
function PrivateRoute({ element }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // If the user is not authenticated, redirect to the sign-in page
    return <Signin />;
  }

  return element
}

function App() {

  return (
    <>
      <Router>
        <AuthContextProvider>
          <UserContextProvider>
            <Toaster />
            <Header />
            <Routes>
              <Route path="/" element={<PrivateRoute element={<Home />} />} />
              <Route exact path="/signin" element={<Signin />} />
              <Route exact path="/signup" element={<Signup />} />
            </Routes>
          </UserContextProvider>
        </AuthContextProvider>
      </Router>
    </>
  )
}

export default App
