import { Link } from "react-router-dom";
const path_logo = "/jobbar_logo.svg";

export default function Footer() {
    return (
        <footer className="flex flex-col bg-white w-[100%]">
            <hr className="h-1 bg-custom_gray"/>
            <div className="flex lg:flex-row flex-col max-w-[1440px] w-[70%] m-auto my-8 md:mt-16 md:mb-16 gap-4 justify-between ">
                <div className="flex flex-col">
                    <img src={path_logo} alt="Jobbar logo"  className="h-40 p-2"/>
                </div>
                <div className="text-custom_gray flex flex-col justify-center">
                    <h2 className="font-bold text-3xl text-center">
                        Links
                    </h2>
                    <div className="flex flex-col text-lg justify-center">
                        <Link
                            to="/"
                            className="cursor-pointer hover:text-custom_red transition-colors duration-300 mt-2 text-center"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="cursor-pointer hover:text-custom_red transition-colors duration-300 text-center"
                        >
                            About us
                        </Link>
                    </div>
                    <div className="flex flex-row gap-3 mt-6 text-custom_gray justify-center">
                        <div className="hover:text-custom_red transition-colors duration-300 cursor-pointer">
                            {/* instagram */}
                            <Link
                                to="https://www.instagram.com/"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" />
                                    <path d="M16 11.3701C16.1234 12.2023 15.9812 13.0523 15.5937 13.7991C15.2062 14.5459 14.5931 15.1515 13.8416 15.5297C13.0901 15.908 12.2384 16.0397 11.4077 15.906C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1903 8.22768 13.4229 8.09402 12.5923C7.96035 11.7616 8.09202 10.91 8.47028 10.1584C8.84854 9.40691 9.45414 8.7938 10.2009 8.4063C10.9477 8.0188 11.7977 7.87665 12.63 8.00006C13.4789 8.12594 14.2648 8.52152 14.8716 9.12836C15.4785 9.73521 15.8741 10.5211 16 11.3701Z" stroke="currentColor" strokeWidth="2" />
                                    <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </Link>
                        </div>
                        <div className="hover:text-custom_red transition-colors duration-300 cursor-pointer">
                            {/* twitter */}
                            <Link
                                to="https://x.com"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="none">
                                    <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" fill="currentColor"/>
                                </svg>
                            </Link>
                        </div>
                        <div className="hover:text-custom_red transition-colors duration-300 cursor-pointer">
                            {/* youtube */}
                            <Link
                                to="https://www.youtube.com"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.50001 17C1.80143 13.7033 1.80143 10.2967 2.50001 7C2.5918 6.66521 2.76914 6.36007 3.01461 6.11461C3.26008 5.86914 3.56522 5.69179 3.90001 5.6C9.26346 4.71146 14.7366 4.71146 20.1 5.6C20.4348 5.69179 20.7399 5.86914 20.9854 6.11461C21.2309 6.36007 21.4082 6.66521 21.5 7C22.1986 10.2967 22.1986 13.7033 21.5 17C21.4082 17.3348 21.2309 17.6399 20.9854 17.8854C20.7399 18.1309 20.4348 18.3082 20.1 18.4C14.7366 19.2887 9.26344 19.2887 3.90001 18.4C3.56522 18.3082 3.26008 18.1309 3.01461 17.8854C2.76914 17.6399 2.5918 17.3348 2.50001 17Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M10 15L15 12L10 9V15Z" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </Link>
                        </div>
                        <div className="hover:text-custom_red transition-colors duration-300 cursor-pointer">
                            {/* facebook */}
                            <Link
                                to="https://www.facebook.com/"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="text-custom_gray text-center">
                    <h2 className="font-bold text-3xl">
                        Contact us
                    </h2>
                    <p className="mt-2">
                        Email: martin.synak123@gmail.com
                    </p>
                    <p className="mt-1">
                        Phone: +421 951 508 804
                    </p>
                </div>
            </div>
        </footer>
    )
}