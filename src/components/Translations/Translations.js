import withUser from "../../hoc/withUser.jsx";
import styles from "./Translations.module.css";
import { useEffect } from "react";
import Input from "../Input/Input.jsx";
import TranslationsAPI from "../../api/TranslationsAPI";
import { useTranslationContext } from "../../context/TranslationContext";
import { useState } from "react";

const Translation = () => {
	const username = localStorage.getItem("username");
	const userId = localStorage.getItem("id");
	const { translationState, dispatch } = useTranslationContext();
	const [input, setInput] = useState("");

	// Catch input text to state
	function translate(e) {
		setInput(e.target.value);
	}
	// add input text to translationContext
	function saveTranslation(e) {
		e.preventDefault();
		if (input.trim() === "" || !input.toLowerCase().match(/[a-z ]/)) return;
		//Save to context
		dispatch({
			type: "ADD_TRANSLATION",
			payload: input.trim(),
		});
		setInput("");
	}
	//Get user from API and init context
	useEffect(() => {
		const initTranslationContext = async () => {
			const fetchUser = await TranslationsAPI.getUser(username);

			dispatch({
				type: "ADD_TRANSLATIONS",
				payload: fetchUser[0].translations,
			});
		};
		initTranslationContext();
	}, []);

	//Save new translation to api when state changes
	useEffect(() => {
		const translationsToApi = async () => {
			if (translationState.translations.length > 0) {
				console.log("translationsToApi: " + JSON.stringify(translationState.translations));
				await TranslationsAPI.updateTranslations(userId, translationState);
			}
		};
		translationsToApi();
	}, [translationState]);

	return (
		<>
			<div className={styles.container}>
				<div className={styles.inputContainer}>
					<Input id="translation" placeholder="Enter translation..." onInputChange={translate} onButtonSubmit={saveTranslation} value={input} maxLength="40" />
				</div>
			</div>
			<div className={styles.center}>
				<div className={styles.translationCard}>
					{/* {console.log("T-STATE:" + JSON.stringify(translationState))} */}
					{input.split("").map((character, index) => (character.toLowerCase().match(/[a-z ]/) ? <img src={"/signs/" + character + ".png"} key={index} alt="sign-language" onError={(event) => (event.target.style.display = "none")} className={styles.SignImage} /> : <span></span>))}
				</div>
			</div>
		</>
	);
};

export default withUser(Translation);
