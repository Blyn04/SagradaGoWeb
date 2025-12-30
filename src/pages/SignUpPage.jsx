import { useContext, useState } from "react";
import Button from "../components/Button";
import { NavbarContext } from "../context/AllContext";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import "../styles/signup.css";
import axios from "axios";
import { API_URL } from "../Constants";

export default function SignUpPage() {
  const { setShowSignup, setShowSignin } = useContext(NavbarContext);


  const [inputFname, setInputFname] = useState("");
  const [inputMname, setInputMname] = useState("");
  const [inputLname, setInputLname] = useState("");
  // const [inputGender, setInputGender] = useState("");
  const [inputContactNumber, setInputContactNumber] = useState("");
  // const [inputCivilStatus, setInputCivilStatus] = useState("");
  const [inputBirthday, setInputBirthday] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputRepass, setInputRepass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showRepass, setShowRepass] = useState(false);



  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    try {

      if (!inputEmail || !inputPassword || !inputFname || !inputLname) {
        alert("Please fill out all required fields.");
        return;
      }
      if (inputPassword !== inputRepass) {
        alert("Passwords do not match!");
        return;
      }

      setLoading(true);


      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword
      );
      const user = userCredential.user;
      const uid = user.uid;



      await sendEmailVerification(user);
      alert("Account created successfully! Please verify your email.");

      await axios.post(`${API_URL}/createUser`, {
        first_name: inputFname,
        middle_name: inputMname,
        last_name: inputLname,
        // gender: inputGender,
        contact_number: inputContactNumber,
        // civil_status: inputCivilStatus,
        birthday: inputBirthday,
        email: inputEmail,
        password: inputPassword,
        uid: uid
      });


      // setInputFname("")
      // setInputMname("")
      // setInputLname("")
      // setInputGender("")
      // setInputContactNumber("")
      // setInputCivilStatus("")
      // setInputBirthday("")
      // setInputEmail("");
      // setInputPassword("");
      // setInputRepass("");
      setShowSignup(false);
    } catch (err) {
      console.error("Signup Error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-close">
          <button
            onClick={() => {
              setShowSignup(false);
              setShowSignin(false);
            }}
          >
            ✕
          </button>
        </div>

        <h1 className="modal-title">Create an Account</h1>
        <p className="modal-subtitle">Enter necessary details to register.</p>

        <div className="modal-grid">
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={inputFname}
              onChange={(e) => setInputFname(e.target.value)}
              className="modal-input"
            />
          </div>
          <div>
            <label>Middle Name</label>
            <input
              type="text"
              value={inputMname}
              onChange={(e) => setInputMname(e.target.value)}
              className="modal-input"
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              value={inputLname}
              onChange={(e) => setInputLname(e.target.value)}
              className="modal-input"
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label>Contact Number</label>
              <input
                type="text"
                value={inputContactNumber}
                onChange={(e) => setInputContactNumber(e.target.value)}
                className="modal-input"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Birthday</label>
              <input
                type="date"
                value={inputBirthday}
                onChange={(e) => setInputBirthday(e.target.value)}
                className="modal-input"
              />
            </div>
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              className="modal-input"
            />
          </div>
          <div>
            <label>Password</label>
            <div className="modal-password-wrapper">
              <input
                type={showPass ? "text" : "password"}
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="modal-input"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="password-toggle"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label>Re-type Password</label>
            <div className="modal-password-wrapper">
              <input
                type={showRepass ? "text" : "password"}
                value={inputRepass}
                onChange={(e) => setInputRepass(e.target.value)}
                className="modal-input"
              />
              <button
                type="button"
                onClick={() => setShowRepass(!showRepass)}
                className="password-toggle"
              >
                {showRepass ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        <button
          className="filled-btn"
          style={{ padding: '8px', fontSize: '14px' }}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <button
          onClick={() => {
            setShowSignup(false);
            setShowSignin(true);
          }}
          className="modal-link"
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>

  );
}
