import React, { useState } from "react";

function FormInputs() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(`name: ${name}, value: ${value}`)
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Submitted form:", formData);

    if (
      formData.name === "bhupinder" &&
      formData.password === "secret"
    ) {
      setSuccessMessage("Success! Form submitted successfully.");
    } else {
      setSuccessMessage("Please enter valid name and password.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Form Inputs Component</h2>

      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Submit</button>

      {successMessage && <p>{successMessage}</p>}
    </form>
  );
}

export default FormInputs;