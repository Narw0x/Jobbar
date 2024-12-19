import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Button from "../components/button";

const pathExperienceImage = "../../../experienceImage.svg";



export default function EditExperiencePage() {
    const [date, setDate] = useState(null);

    const navigate = useNavigate();

    const authState = useSelector((state) => state.auth);

    return (
        <section className="bg-custom_bg_gray py-8">
            <div className="max-w-[1440px] mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl text-custom_gray font-bold ">Edit Experience</h1>
                <div>
                    <form className="flex flex-row mt-4">
                        <div className="flex flex-col flex-1 mt-2">
                            <div>
                                <label htmlFor="jobTitle" className="text-lg text-custom_gray">Job Title</label>
                                <input type="text" id="jobTitle" className="w-full border border-gray-200 rounded-lg p-2" />
                            </div>
                            <div className="mt-2">
                                <label htmlFor="company" className="text-lg text-custom_gray">Company</label>
                                <input type="text" id="company" className="w-full border border-gray-200 rounded-lg p-2" />
                            </div>
                            <div className="mt-2">
                                <label className="text-lg text-custom_gray">Employment Type</label>
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <input type="radio" id="fullTime" name="employmentType" value="full-time" />
                                        <label htmlFor="fullTime" className="text-custom_gray">Full-time</label>
                                    </div>
                                    <div>
                                        <input type="radio" id="partTime" name="employmentType" value="part-time" />
                                        <label htmlFor="partTime" className="text-custom_gray">Part-time</label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 mt-2">
                                    <label htmlFor="Date" className="text-lg text-custom_gray">Date</label>
                                    <Calendar value={date} onChange={(e) => setDate(e.value)} view="month" dateFormat="mm/yy"  selectionMode="range" readOnlyInput hideOnRangeSelection className="border rounded "/>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="description" className="text-lg text-custom_gray">Description</label>
                                <textarea id="description" className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray p-2 my-2 text-lg w-full resize-none rounded-lg" />
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 mt-[-1rem]">
                            <div className="flex flex-col justify-end flex-wrap">
                                <img src={pathExperienceImage} alt="" /> 
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
                            <div className="flex space-x-4 justify-end mt-4">
                                <Button 
                                    style="red-hover"
                                    type="button"
                                    onClick={() => {
                                        navigate(`/profile/${authState.user._id}`);
                                    }}
                                >
                                    Back
                                </Button>
                                <Button 
                                    style="red-default"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}