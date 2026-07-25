import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	return (
		<div>
			<button onClick={() => navigate(-1)}>Go Home</button>
		</div>
	);
};

export default Login;
