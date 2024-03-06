import { useState } from "react";
import {
  signInWithGooglePopup,
  signInAuthUserWithEmailAndPassword,
} from "../../utils/firebase/firebase.utils";
// u viticastim zagradama se importaju metode a bez zagrada komponente
import FormInput from "../form-input/form-input.component";
import "./sign-in-form.styles.scss";
import Button from "../button/button.component";

const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields; // ovo se naziva destrukturiranje kako
  // bi se iz objekta izvukli pojedinacni clanovi

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    await signInWithGooglePopup();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await signInAuthUserWithEmailAndPassword(email, password);
      resetFormFields();
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          alert("incorrect password for email");
          break;
        case "auth/user-not-found":
          alert("no user associated with this email");
          break;
        default:
          console.log(error);
      }
    }
  };
  const handleChange = (event) => {
    // ova funkcija poziva se svaki puta kada korisnik unese nesto u polje forme
    const { name, value } = event.target;
    // ovo je isto destructuring, iz event objekta se izvlace name i value atributi
    setFormFields({ ...formFields, [name]: value }); // setFormFields se koristi za azuriranje stanja formFields
  }; // Kako biste zadržali prethodno stanje, koristi se ...formFields kako biste stvorili novi objekt
  // koji će zadržati sve postojeće vrijednosti i ažurirati samo odgovarajuće polje s novom vrijednošću.
  // [name]: value dio objekta postavlja vrijednost za ključ koji je jednak imenu polja (name) na vrijednost koju je korisnik unio (value).
  return (
    <div className="sign-up-container">
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />
        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password} //ono sto vidimo uneseno u input je VALUE
        />
        <div className="buttons-container">
          <Button type="submit">Sign in</Button>
          <Button type="button" buttonType="google" onClick={signInWithGoogle}>
            Google sign in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
