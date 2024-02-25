import React from "react";
import Layout from "../components/layout";

export default function HomePage() {
  // const handleApiCall = async () => {
  //   const response = await fetch("/api/test/");
  //   const data = await response.json();
  //   console.log(data);
  // };

  // const createUser = async (email, password) => {
  //   const response = await fetch("/api/test/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ email, password }),
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // };

  return (
    <Layout>
      Welcome! Click the links above  
    </Layout>
    // code below was in the layout tags
    // <button onClick={handleApiCall}>Test API</button>
    // <button onClick={() => createUser("David", "password")}>
    //   Create User
    // </button>
  );
}
