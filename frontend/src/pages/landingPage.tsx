import {Link} from "react-router-dom";
import logo from "@/assets/logo.svg";

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
            <div className="absolute top-4 left-4">
                <img src={logo} alt="Logo" className="h-12"/>
            </div>
            <h1 className="text-5xl font-bold text-green-600 mb-4">Welcome to Old Mutual Vehicle Insurance</h1>
            <p className="text-lg text-gray-700 mb-6">Get the best coverage for your vehicle today!</p>
            <Link to="/claim">
                <button
                    className="bg-green-600 text-white py-5 px-20 rounded-full hover:bg-green-900 transition duration-300 text-lg">
                    File a Claim Now
                </button>
            </Link>
        </div>
    );
};

export default LandingPage;
