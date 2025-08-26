import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
			<div className="container-fluid">
				<Link to="/">
					<span className="navbar-brand mx-2 my-2 h1">Home</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
