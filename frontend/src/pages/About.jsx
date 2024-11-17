import { Link } from 'react-router-dom';
import Carousel from '../components/carousel.jsx';

const pathManAbout = "./about_person.svg";


export default function AboutPage(){
    return(
        <>
            <section  className="bg-custom_bg_gray w-[100%] pt-16">
                <div className="bg-custom_bg_gray flex max-w-[1440px] w-[70%] m-auto justify-center gap-12">
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
                    <div className="flex flex-col justify-center text-custom_gray gap-4 max-w-[55%]">
                        <h1 className="text-5xl font-bold">Who we are?</h1>
                        <p className="text-custom_red text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultricies lacus lectus, nec semper risus pellentesque at. Nunc dapibus mi diam, at tempus diam ultrices ac. Ut dapibus finibus augue vitae vestibulum. Nullam pellentesque malesuada leo, id pulvinar elit euismod eu. Pellentesque volutpat nisl at sapien semper ornare. In blandit tempus velit, ut bibendum nisi porttitor ut.</p>
                    </div>
                </div>
            </section>
            <section  className="bg-custom_bg_gray w-[100%] py-16 pb-16">
                <Carousel/>
            </section>
        </>
    )
}