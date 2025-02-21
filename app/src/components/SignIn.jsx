import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const { setUser, googleSignIn } = useAuth();

  const handleGoogleSignIn = async () => {
    googleSignIn()
      .then((res) => {
        setUser(res.user);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Google
        </button>

        {/* Optional: Add other login methods or create an account link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
