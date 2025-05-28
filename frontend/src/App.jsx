import React from 'react';
import { UserProvider } from "./context/UserContext.jsx"

const App = () => {
  return (
    <UserProvider>
      <h1>App</h1>
    </UserProvider>
  )
}

export default App
