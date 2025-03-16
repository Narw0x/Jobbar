import { Calendar } from "primereact/calendar";

import ExperienceImage from "./partials/experienceImage";
import ExperienceInputs from "./partials/experienceInputs";
import NavigationButtons from "../navigationButtons";


export default function ExperienceForm({experience, handleExprerienceChange, state}) {
    return (
        <>
            <div className="flex flex-col flex-1 mt-2">
                <ExperienceInputs experience={experience} handleExprerienceChange={handleExprerienceChange} />
                <div className="flex flex-col">
                    <label htmlFor="date" className="text-lg text-custom_gray">Date</label>
                    <Calendar name="date" value={experience.date} onChange={handleExprerienceChange} maxDate={new Date()} view="month" dateFormat="mm/yy"  selectionMode="range" readOnlyInput hideOnRangeSelection />
                </div>
                <div className="mt-2">
                    <label htmlFor="description" className="text-lg text-custom_gray">Description</label>
                    <textarea id="description" name="description" value={experience.description} onChange={handleExprerienceChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray p-2 my-2 text-lg w-full resize-none rounded" />
                </div>
            </div>
            <div className="flex flex-col flex-1 mt-[-1rem]">
                <div className="flex flex-col justify-end flex-wrap">
                    <ExperienceImage />
                </div>
                <div className="flex space-x-4 justify-end mt-4">
                    <NavigationButtons btnText={'Back'} route={`/profile/${state.user._id}`} />
                </div>
            </div>
        </>
    )
}