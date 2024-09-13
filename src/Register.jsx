import { useState } from "react";
import { idb } from "./db";  // Correct the named import


const Register = ({ setUsers }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  

  const handleRegister = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      alert("Please fill in all fields.");
      return;
    }

    const dbPromise = idb.open("app-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("users", "readwrite");
      const store = tx.objectStore("users");
      const addUser = store.add({ firstName, lastName, email, isBlocked: false });

      addUser.onsuccess = () => {
        alert("User registered successfully.");
        setFirstName("");
        setLastName("");
        setEmail("");
       
        setUsers((prev) => [...prev, { firstName, lastName, email, isBlocked: false }]);
      };

      addUser.onerror = () => {
        alert("Error adding user (maybe email already exists).");
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  return (
    <div className="Register-Div">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          className="inputbox-Register"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <br />
        <input
         className="inputbox-Register"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <br />
        <input
         className="inputbox-Register"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <br />
        <button className="btn-Register" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
