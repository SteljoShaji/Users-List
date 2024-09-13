import { useState, useEffect } from "react";
import { idb } from "./db";

const UserList = ({ users, setUsers, handleLogout }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [previousLogins, setPreviousLogins] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  // Fetch users from IndexedDB
  const fetchUsers = () => {
    const dbPromise = idb.open("app-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("users", "readonly");
      const store = tx.objectStore("users");
      const allUsers = store.getAll();

      allUsers.onsuccess = () => {
        setUsers(allUsers.result);
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle Block/Unblock User
  const toggleBlockUser = (userId, blockStatus) => {
    const dbPromise = idb.open("app-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("users", "readwrite");
      const store = tx.objectStore("users");
      const user = store.get(userId);

      user.onsuccess = (e) => {
        const data = e.target.result;
        data.isBlocked = blockStatus;
        store.put(data);
        fetchUsers();
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  // Add User
  const handleAddUser = () => {
    if (!firstName || !lastName || !email || !age) {
      alert("All fields are required.");
      return;
    }

    const dbPromise = idb.open("app-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("users", "readwrite");
      const store = tx.objectStore("users");

      const addUser = store.add({
        firstName,
        lastName,
        email,
        age,
        isBlocked: false,
        logins: [],
      });

      addUser.onsuccess = () => {
        alert("User added successfully!");
        fetchUsers();
        setFirstName("");
        setLastName("");
        setEmail("");
        setAge("");
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  // Edit User
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setAge(user.age);
  };

  const handleUpdateUser = () => {
    if (!firstName || !lastName || !email || !age) {
      alert("All fields are required.");
      return;
    }

    const dbPromise = idb.open("app-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("users", "readwrite");
      const store = tx.objectStore("users");

      const updateUser = store.put({
        id: editingUser.id,
        firstName,
        lastName,
        email,
        age,
        isBlocked: editingUser.isBlocked,
        logins: editingUser.logins,
      });

      updateUser.onsuccess = () => {
        alert("User updated successfully!");
        setEditingUser(null);
        setFirstName("");
        setLastName("");
        setEmail("");
        setAge("");
        fetchUsers();
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  // Remove User
  const handleDeleteUser = (userId) => {
    const dbPromise = idb.open("app-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("users", "readwrite");
      const store = tx.objectStore("users");

      const deleteUser = store.delete(userId);

      deleteUser.onsuccess = () => {
        alert("User removed successfully!");
        fetchUsers();
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  // View Previous Logins
  const handlePreviousLogins = (userId) => {
    const dbPromise = idb.open("app-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("users", "readonly");
      const store = tx.objectStore("users");

      const request = store.get(userId);
      request.onsuccess = (e) => {
        const user = e.target.result;
        if (user) {
          setPreviousLogins({ ...previousLogins, [userId]: user.logins });
        }
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  return (
    <div><button onClick={handleLogout} className="logout-Btn">
    Logout
  </button>
      <h2>User List</h2>
      


      {/* Logout Button */}
     
      <div>
        {users.map((user) => (
          <div key={user.id}>
            <table  className="userlist-table">

              <tr>
                <th>First Name</th> <th>Last Name</th> <th>Email Id</th> <th>Action</th>
                </tr>
            <tr>
                <td>{user.firstName}</td><td>{user.lastName}</td><td>{user.email}</td>
                
            <td className="button-td"> 
            <button className="table-btn" onClick={() => toggleBlockUser(user.id, !user.isBlocked)}>
              {user.isBlocked ? "Unblock" : "Block"}
            </button>
            <button className="table-btn" onClick={() => handleEditUser(user)}>Edit</button>
            <button className="table-btn" onClick={() => handleDeleteUser(user.id)}>Remove</button>
            <button className="table-btn" onClick={() => handlePreviousLogins(user.id)}>Previous Logins</button></td>
            </tr>

            </table>

           
            {previousLogins[user.id] && (
              <ul>
                {previousLogins[user.id].map((login, index) => (
                  <li key={index}>{login}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Add or Edit User Form */}
      <div className="userlist-edit">
        <div><h2 className="h2-add">{editingUser ? "Edit User" : "Add User"}</h2></div>
        <div className="Add-User-input-tags">
          
           <div >
              <input
              className="Add-User-input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
              <input
              className="Add-User-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
              <input
              className="Add-User-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
          
           </div>
         
          <button className="add-user-btn" onClick={editingUser ? handleUpdateUser : handleAddUser}>
            {editingUser ? "Update" : "Add"}
          </button>
      
        </div>
      </div>
    </div>
  );
};

export default UserList;
