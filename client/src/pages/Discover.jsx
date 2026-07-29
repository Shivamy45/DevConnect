import axios from "axios";
import { useEffect, useState } from "react";

const Discover = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const getResponse = async () => {
			const response = await axios.get(
				"https://jsonplaceholder.typicode.com/users",
			);
			setData(response.data);
		};
		getResponse();
	}, []);
	return (
		<div>
			{data.length > 0 &&
				data.map((user) => (
					<div key={user.id}>
						<p>{user.name}</p>
						<p>{user.email}</p>
					</div>
				))}
		</div>
	);
};

export default Discover;
