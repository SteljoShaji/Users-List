import { useState } from "react";
import { idb } from "./db";  // Correct the named import
import './Style.css'; // Style import

const Authentication = ({ setIsLoggedIn, setUsers }) => {
  const [isRegister, setIsRegister] = useState(false);  // State to toggle between Login and Register
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [loginError, setLoginError] = useState("");
  const [password, setPassword] = useState(""); // Optional: Add password field for future security
  
  // Handle Registration
  const handleRegister = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !age) {
      alert("Please fill in all fields.");
      return;
    }

    const dbPromise = idb.open("app-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("users", "readwrite");
      const store = tx.objectStore("users");
      const addUser = store.add({ firstName, lastName, email, age, isBlocked: false });

      addUser.onsuccess = () => {
        alert("User registered successfully.");
        setFirstName("");
        setLastName("");
        setEmail("");
        setAge("");
        setUsers((prev) => [...prev, { firstName, lastName, email, age, isBlocked: false }]);
      };

      addUser.onerror = () => {
        alert("Error adding user (maybe email already exists).");
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();

    const dbPromise = idb.open("app-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("users", "readonly");
      const store = tx.objectStore("users");
      const request = store.index("email").get(email);

      request.onsuccess = (event) => {
        const user = event.target.result;
        if (user && !user.isBlocked) {
          setIsLoggedIn(true);
          setLoginError("");
        } else if (user?.isBlocked) {
          setLoginError("User is blocked.");
        } else {
          setLoginError("User not found.");
        }
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  return (
    <div className="auth-form">
      {isRegister ? (
        // Registration Form
        <div className="register-form">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <button type="submit">Register</button>
          </form>
          <p>
            Already have an account?{" "}
            <button onClick={() => setIsRegister(false)} className="btn-link">Login Here</button>
          </p>
        </div>
      ) : (
        // Login Form
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
            
            <button type="submit">Login</button>
          </form>
          {loginError && <p>{loginError}</p>}
          <p>
            Don't have an account?{" "}
            <button onClick={() => setIsRegister(true)} className="btn-link">Register Here</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Authentication;
