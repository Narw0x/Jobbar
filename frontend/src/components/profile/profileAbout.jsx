export default function ProfileAbout({ aboutText }) {
    return (
            <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                <h2 className="text-lg text-custom_gray font-semibold">About</h2>
                <p className="text-sm text-gray-500 text-justify">{aboutText}</p>
            </div>
    )
}