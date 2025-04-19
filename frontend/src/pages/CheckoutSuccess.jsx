import { Link } from "react-router-dom"; 

const CheckoutSuccess = () => {
  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-6 md:mx-auto shadow-lg rounded-md">
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.414 7.586l-6.707 6.707-3.293-3.293-1.414 1.414 4.707 4.707 8.121-8.121-1.414-1.414z"
          />
        </svg>

        <div className="text-center">
          <h3 className="text-2xl text-gray-900 font-semibold">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-2">
            Thank you for completing your secure online payment.
          </p>
          <p>Have a great day!</p>
          <div className="py-10">
            <Link
              to="/"
              className="px-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md"
            >
              Go Back To Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
