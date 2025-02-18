import { useEffect } from 'react';
import Carousel from '../components/carousel.jsx';

const pathManAbout = "../about_person.svg";


export default function AboutPage(){

    useEffect(() => {
        document.title = "About Us | Jobbar";
    }, []);

    return(
        <>
            <section  className="bg-custom_bg_gray w-[100%] pt-16">
                <div className="bg-custom_bg_gray flex max-w-[1440px] w-[70%] m-auto lg:flex-row flex-col justify-center gap-12">
                    <div className="flex flex-col justify-end flex-wrap">
                        <img src={pathManAbout} alt="Man at the desk" /> 
                        <p className="text-right mt-[-1rem]">Designed by 
                        <a 
                            href="https://www.freepik.com" 
                            className="text-custom_red p-2" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Freepik
                        </a>
                        </p>
                    </div>
                    <div className="flex flex-col justify-center text-custom_gray gap-4 lg:max-w-[55%]">
                        <h1 className="md:text-5xl text-4xl font-bold text-center lg:text-left">Who we are?</h1>
                        <p className="text-custom_red text-justify">At Jobbar, our mission is to bridge the gap between talent and opportunity. We understand that finding the right job or the ideal candidate is more than just matching skills to a description—it’s about building connections that drive success. We are dedicated to transforming the job search experience by providing an intuitive, user-friendly platform that empowers job seekers and employers alike. Whether you’re a professional looking for your next big break or a company seeking the perfect addition to your team, Jobbar is here to make the process seamless and efficient.</p>
                    </div>
                </div>
            </section>
            <section  className="bg-custom_bg_gray w-[100%] py-16 pb-16">
                <Carousel/>
            </section>
        </>
    )
}