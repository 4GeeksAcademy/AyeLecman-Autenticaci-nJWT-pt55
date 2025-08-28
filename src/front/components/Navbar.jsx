import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-dark bg-dark mx-5 my-5 border-bottom border-2 border-white">
			<div className="container-fluid">
				<Link to="/" className="text-decoration-none">
					<span className="navbar-brand mx-2 my-2 h1">Home</span>
				</Link>
				<div className="ml-auto">
					<Link to="/private">
						<button className="btn btn-light me-2">Super Secret</button>
					</Link>
					<Link to="/signup">
						<button className="btn btn-light">Create New User</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
