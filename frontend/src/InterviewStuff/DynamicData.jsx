import React, { useEffect, useState } from "react";

const DynamicData = () => {

    const [dogs, setdogs] = useState([]);
    

	function apiData() {
		fetch('https://official-joke-api.appspot.com/random_joke')
			.then((response) => response.json())
			.then((data) => setdogs((prev) => [...prev, data]) )
            .catch(err => console.log(err))
        

	}

	useEffect(() => {
		apiData();

        const interval = setInterval(apiData, 5000)

        return () => clearInterval(interval)
	}, []);

    

	return (
    <>
        {dogs.map((item) => (
            <div>{item.punchline}</div>
        ))}
    </>
    )
};

export default DynamicData;
