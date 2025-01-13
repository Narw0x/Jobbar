import { Link  } from "react-router-dom";
import Button from "../components/button";
import Features from "../components/features";
import { useSelector } from "react-redux";

const pathManAtTable = "./Man_at_table.svg";



export default function HomePage(){

    const authState = useSelector(state => state.auth);

    return(
        <>
            <section className="bg-custom_bg_gray w-[100%] pt-16">
                <div className="bg-custom_bg_gray flex max-w-[1440px] w-[70%] m-auto justify-center gap-12">
                    <div className="flex flex-col justify-end flex-wrap">
                        <img src={pathManAtTable} alt="Man at the desk" /> 
                        <p className="text-right mt-[-2rem]">Designed by 
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
                        <h1  className="text-5xl font-bold">We connect Jobs Seekers and Companies</h1>
                        <p className="text-custom_red">Find your dream job</p>
                        <div>
                            <Button
                                style="red-default"
                                redirectPath={authState.token ? "/job/search" : "/login"}
                                >
                                Search
                            </Button>
                        </div>
                        
                    </div>
                </div>
            </section>
            <section className="bg-custom_bg_gray w-[100%] pt-16 pb-16">
                <h2 className="font-bold text-custom_gray text-center text-4xl">Introduce <span className="text-custom_red font-normal" >to Jobbar</span></h2>
                <div className="flex felx-row max-w-[1440px] w-[70%] m-auto justify-between text-center mt-8">
                    <div className="w-[30%] ">
                        <h3 className="text-custom_gray text-4xl font-bold">Job seeker</h3>
                        <p className="text-custom_red">Searching for a job or an internship?</p>
                        <div className="mt-8 ms-4">
                            <Features title={"Instant Notification"} description={"About new positions"} image={"notification"}/>
                            <Features title={"Reach out"} description={"To companies"} image={"agreement"}/>
                            <Features title={"Easy Apply"} description={"for job position"} image={"link"}/>
                            <Features title={"Manage Applies"} description={"Fast and easy"} image={"list-setting"}/>
                        </div>
                    </div>
                    <div className="w-[30%]">
                        <h3 className="text-custom_gray text-4xl font-bold">Company</h3>
                        <p className="text-custom_red">Seeking fresh talent to elevate your team?</p>
                        <div className="mt-8 ms-4">
                            <Features title={"Candidate Matching"} description={"Based on skill, experience"} image={"fire"}/>
                            <Features title={"Analytics and Insights"} description={"About posts, applies"} image={"analysis-text-link"}/>
                            <Features title={"Reach out"} description={"Company profile or posts"} image={"navigation"}/>
                            <Features title={"Manage Applies"} description={"Automatic response "} image={"folder-management"}/>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-custom_bg_gray py-16">
                <p className="text-center text-custom_gray text-xl">You can find out more about us 
                    <Link
                        to={"/about"}
                        className="text-custom_red ps-2"
                        
                    >
                        here
                    </Link>
                </p>
            </section>
        </>
    )
}