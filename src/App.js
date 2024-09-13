import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import UserList from "./UserList";
import "./App.css";
import { initializeIndexedDb } from "./db"; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [showLogin, setShowLogin] = useState(true);  // Track whether to show login or register form

  // Initialize IndexedDB when the component is mounted
  useState(() => {
    initializeIndexedDb();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false); // Reset the login state to false
    setShowLogin(true);  // Switch back to login page after logout
  };

  return (
    <div className="container">
      <h1 className="App">User List</h1>

      {isLoggedIn ? (
        <UserList users={users} setUsers={setUsers} handleLogout={handleLogout} />
      ) : (
        <div>
          {showLogin ? (
            <>
              <Login setIsLoggedIn={setIsLoggedIn} />
              <p>
                Don't have an account?{" "}
                <button onClick={() => setShowLogin(false)} className="btn btn-link">
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <Register setUsers={setUsers} />
              <p>
                Already have an account?{" "}
                <button onClick={() => setShowLogin(true)} className="btn btn-link">
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
