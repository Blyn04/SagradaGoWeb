import { useContext } from "react";
import { NavbarContext } from "../context/AllContext";
import SignInPage from "./SignInPage";

import Footer from '../components/Footer';

export default function Donate() {
  const { showSignin } = useContext(NavbarContext);
  return (
    <>
      <h1>Donate</h1>
      {showSignin && <SignInPage />}

      <Footer />
    </>
  );
}
