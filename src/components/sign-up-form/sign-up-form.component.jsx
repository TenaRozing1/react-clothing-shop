import { useState } from "react";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";
// u viticastim zagradama se importaju metode a bez zagrada komponente
import FormInput from "../form-input/form-input.component";
import "./sign-up-form.styles.scss";
import Button from "../button/button.component";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: ""
};
const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields; // ovo se naziva destrukturiranje kako
  // bi se iz objekta izvukli pojedinacni clanovi

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); // Ovo spriječava defaultno ponašanje forme, koje bi inače uzrokovalo osvježavanje stranice.
    // Time se omogućava da se sve rukuje na klijentskoj strani bez osvježavanja stranice,
    // što je uobičajeno u jednostraničnim aplikacijama (single page app)

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("cannot create user, email is already in use");
      }
      console.log("error", error);
    }
  };
  const handleChange = (event) => {
    // ova funkcija poziva se svaki puta kada korisnik unese nesto u polje forme
    const { name, value } = event.target; // ovo je isto destructuring, iz event objekta se izvlace name i value atributi
    setFormFields({ ...formFields, [name]: value }); // setFormFields se koristi za azuriranje stanja formFields
  }; // Kako biste zadržali prethodno stanje, koristi se ...formFields kako biste stvorili novi objekt
  // koji će zadržati sve postojeće vrijednosti i ažurirati samo odgovarajuće polje s novom vrijednošću.
  // [name]: value dio objekta postavlja vrijednost za ključ koji je jednak imenu polja (name) na vrijednost koju je korisnik unio (value).
  return (
    <div className="sign-up-container">
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="DisplayName"
          type="text"
          required
          onChange={handleChange}
          name="displayName"
          value={displayName}
        />
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
        <FormInput
          label="Confirm password"
          type="password"
          required
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
        />
        <Button buttonType="default" type="submit">
          Sign up
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
