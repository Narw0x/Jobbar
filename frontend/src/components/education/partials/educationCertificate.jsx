import { Calendar } from "primereact/calendar"

export default function EducationCertificate({education, handleChange}) {
    return(
        <>
            <div className="flex flex-col">
                <label htmlFor="certificateName" className="text-lg text-custom_gray">Name of Certificate</label>
                <input type="text" name="certificateName" id="certificateName" value={education.certificateName} onChange={handleChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray" />
            </div>
            <div className="mt-2 flex flex-col">
                <label htmlFor="company" className="text-lg text-custom_gray">Issuing Company</label>
                <input type="text" name="company" id="company" value={education.company} onChange={handleChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray"/>
            </div>
            <div className="mt-2 flex flex-col">
                <label htmlFor="date" className="text-lg text-custom_gray">Issuing Date</label>
                <Calendar name="date" value={education.date} onChange={handleChange} maxDate={new Date()} dateFormat="mm/dd/yy"  readOnlyInput hideOnRangeSelection showButtonBar/>
            </div>
        </>
    )
}