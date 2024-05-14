import React, { useState } from 'react';

const VerificationForm = () => {
  const [codes, setCodes] = useState(['', '', '', '', '', '']); // Array to hold each digit

  const handleChange = (index, value) => {
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Move focus to the next input if a digit is entered
    if (value && index < codes.length - 1) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = codes.join(''); // Combine the individual digits into a single code
    console.log('Verification code:', verificationCode);
    // Add your verification logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      {codes.map((code, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={code}
          onChange={(e) => handleChange(index, e.target.value)}
          id={`code-${index}`}
          style={{
            width: '30px',
            height: '30px',
            fontSize: "20px",
            marginRight: '10px',
            textAlign: 'center',
          }}
        />
      ))}
      <button type="submit" style={{margin: "20px"}}>Verify and Continue</button>
    </form>
  );
};

export default VerificationForm;
