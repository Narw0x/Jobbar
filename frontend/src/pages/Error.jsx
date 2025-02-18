import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect } from "react";

const pathManAtTable = "/../Man_at_table.svg";

export default function ErrorPage({type = undefined}) {

    useEffect(() => {
        document.title = "Error | Jobbar";
    }, []);

    if(type){
        return(
            <section className="bg-custom_bg_gray py-8">
                <div className="max-w-[1440px] mx-auto bg-white p-8 rounded-lg shadow-md flex justify-center space-x-4 items-center">
                    <div className="flex flex-col space-y-4 ">
                        <h1 className="text-8xl text-custom_gray font-bold">Oops!</h1>
                        <p>
                            We couldn't find the page you were looking for.
                        </p>
                    </div>
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
                </div>
            </section>
        )
    }

    return (
         <>
            <Header />
            <main>
                <section className="bg-custom_bg_gray py-8">
                    <div className="max-w-[1440px] mx-auto bg-white p-8 rounded-lg shadow-md flex justify-center space-x-4 items-center">
                        <div className="flex flex-col space-y-4 ">
                            <h1 className="text-8xl text-custom_gray font-bold">Oops!</h1>
                            <p>
                                We couldn't find the page you were looking for.
                            </p>
                        </div>
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
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}