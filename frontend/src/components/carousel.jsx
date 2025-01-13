import CarouselItem from './carousel-item.jsx';
import { useState } from 'react';

const CAROUSEL_USERS = [
    {
        author: "Martin Synák",
        title: "Great service",
        description: "I am very satisfied with the service. I will definitely use it again."
    },
    {
        author: "Fabian Vojár",
        title: "Amazing!!!",
        description: "Best service I have ever used. I will recommend it to all my friends."
    },
    {
        author: "Tomáš Zajac",
        title: "Very good",
        description: "This site helped me find my dream job. I am very grateful."
    }
];

export default function Carousel() {
    const [carouselItem, setCarouselItem] = useState(0); // Start at the first item
    const [isAnimating, setIsAnimating] = useState(false);

    const handleNext = () => {
        if (isAnimating) return; // Prevent animation conflicts
        setIsAnimating(true);
        setTimeout(() => {
            setCarouselItem((carouselItem + 1) % CAROUSEL_USERS.length); // Loop back to the start
            setIsAnimating(false);
        }, 500); // Match animation duration
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCarouselItem(
                (carouselItem - 1 + CAROUSEL_USERS.length) % CAROUSEL_USERS.length
            ); // Loop to the last item if at the start
            setIsAnimating(false);
        }, 500);
    };

    return (
        <div className="carousel ">
            <h2 className="text-5xl font-bold text-custom_gray text-center">
                What people say about us?
            </h2>
            <div className="border w-[70%] max-w-[1440px] flex m-auto my-8 justify-between p-8 rounded-lg shadow-md bg-white">
                <button
                    onClick={handlePrev}
                    className="text-3xl text-custom_gray font-bold"
                    disabled={isAnimating}
                >
                    <svg width="26" height="50" viewBox="0 0 26 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 1C25 1 1 18.6756 1 25C1 31.3248 25 49 25 49" stroke="#555555"/>
                    </svg>
                </button>
                <div className="carousel-container relative overflow-hidden w-full">
                    <div
                        className={`carousel-inner flex transition-transform duration-500 ease-in-out transform ${
                            isAnimating ? "animate-slide" : ""
                        }`}
                        style={{
                            transform: `translateX(-${carouselItem * 100}%)`
                        }}
                    >
                        {CAROUSEL_USERS.map((item, index) => (
                            <div
                                key={index}
                                className="carousel-item w-full flex-shrink-0"
                            >
                                <CarouselItem
                                    title={item.title}
                                    author={item.author}
                                    description={item.description}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleNext}
                    className="text-3xl text-custom_gray font-bold"
                    disabled={isAnimating}
                >
                    <svg width="26" height="50" viewBox="0 0 26 50" fill="none" className='rotate-180' xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 1C25 1 1 18.6756 1 25C1 31.3248 25 49 25 49" stroke="#555555"/>
                    </svg>
                </button>
            </div>
            <div className="dots flex justify-center gap-4 mt-4">
                {CAROUSEL_USERS.map((_, index) => (
                    <div
                        key={index}
                        className={`w-4 h-4 rounded-full cursor-pointer ${
                            carouselItem === index
                                ? "bg-custom_red"
                                : "bg-custom_gray"
                        }`}
                        onClick={() => setCarouselItem(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
}
