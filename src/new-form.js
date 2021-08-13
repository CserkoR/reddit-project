import { useRef, useState } from 'react';
import InputFieldSet from './InputFieldSet';
import db from './firebase/db';

export default function NewForm() {
    const [formWasValidated, setFormWasValidated] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        settlement: '',
        address: '',
        price: '',
    });

    const [fieldValues, setFieldValues] = useState({
        name: '',
        settlement: '',
        address: '',
        price: '',
    });

    const references = {
        name: useRef(),
        settlement: useRef(),
        address: useRef(),
        price: useRef(),
    };

    const [formAlertText, setFormAlertText] = useState('');
    const [formAlertType, setFormAlertType] = useState('');

    const validators = {
        name: {
            required: isNotEmpty,
            lessThan10: isLessThan10
        },
        settlement: {
            required: isNotEmpty
        },
        address: {
            required: isNotEmpty
        },
        price: {
            required: isNotEmpty
        }
    }

    const errorTypes = {
        required: "Hiányzó érték",
        lessThan10: "A mező hosszabb, mint 10"
    };

    function isLessThan10(value) {
        return value.length <= 10;
    }

    function isNotEmpty(value) {
        return value !== '';
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const isValid = isFormValid();

        if (isValid) {
            db.collection('restaurant').add(fieldValues)
                .then((docRef) => {
                    setFormAlertText(`Sikeres mentés`);
                    setFormAlertType('success');
                    setFieldValues({
                        name: '',
                        settlement: '',
                        address: '',
                        price: '',
                    });
                });
        }
    }

    function isFormValid() {
        let isFormValid = true;
        for (const fieldName of Object.keys(fieldValues)) {
            const isFieldValid = validateField(fieldName);
            if (!isFieldValid) {
                isFormValid = false;
            }
        }
        return isFormValid;
    }

    function handleInputChange(e) {
        const value = e.target.value;
        const fieldName = e.target.name;
        setFieldValues({
            ...fieldValues,
            [fieldName]: value
        });
        setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: ''
        }));
    }

    function validateField(fieldName) {
        const value = fieldValues[fieldName];
        let isValid = true;
        setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: ''
        }));
        references[fieldName].current.setCustomValidity('');

        if (validators[fieldName] !== undefined) {
            for (const [validationType, validatorFn] of Object.entries(validators[fieldName])) {
                if (isValid) {
                    isValid = validatorFn(value);
                    if (!isValid) {
                        const errorText = errorTypes[validationType];
                        setErrors((previousErrors) => {
                            return ({
                                ...previousErrors,
                                [fieldName]: errorText
                            })
                        });
                        references[fieldName].current.setCustomValidity(errorText);
                    }
                }
            }
        }
        return isValid;
    }

    return (
        <main className={"container"}>
            <h1>Új étterem felvitele</h1>
            <form onSubmit={handleSubmit} noValidate={true}
                className={`needs-validation ${formWasValidated ? 'was-validated' : ''}`}>
                <InputFieldSet
                    reference={references['name']}
                    name="name"
                    labelText="Megnevezés"
                    type="text"
                    errors={errors}
                    fieldValues={fieldValues}
                    // handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <InputFieldSet
                    reference={references['settlement']}
                    name="settlement"
                    labelText="Profil"
                    type="text"
                    errors={errors}
                    fieldValues={fieldValues}
                    // handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <InputFieldSet
                    reference={references['address']}
                    name="address"
                    labelText="Kerület"
                    type="text"
                    errors={errors}
                    fieldValues={fieldValues}
                    // handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <InputFieldSet
                    reference={references['price']}
                    name="price"
                    labelText="Kerület"
                    type="text"
                    errors={errors}
                    fieldValues={fieldValues}
                    // handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                />
                <button type="submit" className="btn btn-primary">Mentés</button>
            </form>
            {formAlertText &&
                <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
                    {formAlertText}
                </div>
            }
        </main>
    );
}