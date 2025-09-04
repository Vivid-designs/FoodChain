import Link from "next/link";
function WelcomeScreen() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gray-200 rounded-2xl p-8 text-center space-y-6 shadow-lg">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-700">Welcome to FoodChain </h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Take a picture, select your food items, and stop worrying about the bill!
                    </p>
                </div>

                <div className="py-4">
                    <Link href="./camerascreen">
                    <button className="w-full py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-gray-300 hover:text-blue-600 transition duration-300">
                        Take a Pic
                    </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default WelcomeScreen;