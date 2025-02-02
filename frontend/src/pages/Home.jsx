import { Link, useNavigate, useParams  } from "react-router-dom";
import Button from "../components/button";
import Features from "../components/features";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";


const pathManAtTable = "../Man_at_table.svg";



export default function HomePage(){

    const authState = useSelector(state => state.auth);
    const navigate = useNavigate();
    const {token} = useParams();

    useEffect(() => {
        if(token){
            async function checkVerifyToken(){
                try {
                    await axios.post('https://jobbar-5m8u.onrender.com/api/verify', { token })
                    .then((res) => {
                        return navigate('/');
                    })
                } catch (error) {
                    console.error('Error verifying token:', error);
                    return navigate('/');
                }
            
                return null;
            }
            checkVerifyToken();
        }
    }, [token])



    return(
        <>
            <section className="bg-custom_bg_gray w-[100%] pt-16">
                <div className="bg-custom_bg_gray flex max-w-[1440px] w-[70%] m-auto md:flex-row flex-col-reverse  justify-center gap-12">
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
                    <div className="flex flex-col justify-center text-custom_gray gap-4 md:max-w-[55%]">
                        <h1  className="lg:text-5xl text-4xl font-bold text-center md:text-left">We connect Jobs Seekers and Companies</h1>
                        <p className="text-custom_red text-center md:text-left">Find your dream job</p>
                        <div className="flex flex-row justify-center md:justify-start gap-4">
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
                <div className="flex md:flex-row flex-col max-w-[1440px] w-[70%] m-auto justify-between text-center mt-8 gap-8 lg:gap-0">
                    <div className=" md:w-[47%] flex flex-col justify-center m-auto mt-0">
                        <h3 className="text-custom_gray text-4xl  font-bold">Job seeker</h3>
                        <p className="text-custom_red">Searching for a better job or an internship?</p>
                        <div className="mt-8 ms-4">
                            <Features title={"Instant Notification"} description={"About new positions"} image={"notification"}/>
                            <Features title={"Reach out"} description={"To companies"} image={"agreement"}/>
                            <Features title={"Easy Apply"} description={"for job position"} image={"link"}/>
                            <Features title={"Manage Applies"} description={"Fast and easy"} image={"list-setting"}/>
                        </div>
                    </div>
                    <div className="md:w-[47%]  flex flex-col justify-center m-auto">
                        <h3 className="text-custom_gray text-4xl font-bold">Company</h3>
                        <p className="text-custom_red">Seeking fresh talent to elevate your team?</p>
                        <div className="mt-8 ms-4">
                            <Features title={"Candidate Matching"} description={"Based on skill"} image={"fire"}/>
                            <Features title={"Analytics"} description={"About posts, applies"} image={"analysis-text-link"}/>
                            <Features title={"Reach out"} description={"Job posts"} image={"navigation"}/>
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