import React, { useState } from 'react';
import Layout from '../../components/layout';
import styles from './login.module.css';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

export default function CalendarPage() {
  // Define state variables for the input values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Layout>
      <div className={`${styles.loginContainer}`}>
        <div className={`${styles.loginHeading}`}>Login To Your Account</div>
        <div className={`${styles.inputContainer}`}>
          <label className={`${styles.inputLabel}`} htmlFor="username">
            Username
          </label>
          <div className={`${styles.iconContainer}`}>
            <PersonIcon className={`${styles.iconLogin}`} />
            <input
              className={`${styles.input}`}
              type="text"
              id="username"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <label className={`${styles.inputLabel}`} htmlFor="lname">
            Last name:
          </label>
          <div className={`${styles.iconContainer}`}>
            <LockIcon className={`${styles.iconLogin}`} />
            <input
              className={`${styles.input}`}
              type="text"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button className={`${styles.inputButton}`}>Submit</button>
        </div>
        <div className={`${styles.inputFooterText}`}>Don't Have an Account? Apply for one now!</div>
        <div>
          <button className={`${styles.inputButton}`}>Sign Up</button>
        </div>
      </div>
    </Layout>
  );
}
