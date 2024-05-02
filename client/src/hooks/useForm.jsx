import { useState } from "react";

const useForm = (initialValues) => {

    const [values, setValues] = useState(initialValues);

    const handleChange = (e) => {
        const valor = (e.target.type === 'checkbox') 
                        ? e.target.checked 
                        : e.target.value ;

        setValues({
            ...values,
            [e.target.name]: valor
        })
    }

    const clearData = () => {
        setValues(initialValues)
    }

    return {
        values,
        handleChange,
        clearData,
        setValues
    }
}

export default useForm