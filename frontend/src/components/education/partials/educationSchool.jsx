import { Calendar } from "primereact/calendar"


export default function EducationSchool({education, handleChange}) {
    return (
        <>
            <div className="flex flex-col">
                <label htmlFor="schoolName" className="text-lg text-custom_gray">School Name</label>
                <input type="text" name="schoolName" id="schoolName"  value={education.schoolName} onChange={handleChange}  className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray" />
            </div>
            <div className="mt-2 flex flex-col">
                <label htmlFor="date" className="text-lg text-custom_gray">Years</label>
                <Calendar name="date" value={education.date} onChange={handleChange} maxDate={new Date()} view="year" dateFormat="yy"  selectionMode="range" readOnlyInput hideOnRangeSelection showButtonBar/>
            </div>
        </>
    )
}