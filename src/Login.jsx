import { useState } from "react";
import { idb } from "./db";  // Correct the named import
import './Style.css';



const Login = ({ setIsLoggedIn }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const dbPromise = idb.open("app-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("users", "readonly");
      const store = tx.objectStore("users");
      const request = store.index("email").get(loginEmail);

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
    <div className="Login-Form" >
              <div className="Login "><h2>Login</h2></div>
          
             <div>
                  <form 
                  className="form"
                  onSubmit={handleLogin}>
                    <input
                      className="inputbox"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter email"
                      required
                    />
                    <button className="btn-login" type="submit">Login</button>
                  </form>
             </div>
         
          {loginError && <p>{loginError}</p>}
        
  
    </div>
  );
};

export default Login;
