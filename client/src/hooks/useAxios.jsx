import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const useAxios = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(url, { withCredentials: true })
            .then((response) => {
                console.log(response.data)
                setData(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error);
                setIsLoading(false);
            });
    }, [url]);
    return { data, isLoading, error, setData };

}

export default useAxios