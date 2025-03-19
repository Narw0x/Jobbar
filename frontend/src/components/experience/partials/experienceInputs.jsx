export default function ExperienceInputs({experience, handleExprerienceChange}) {
    return (
        <>
            <div className="flex flex-col">
                <label htmlFor="jobTitle" className="text-lg text-custom_gray">Job Title</label>
                <input type="text" name="jobTitle" id="jobTitle" value={experience.jobTitle} onChange={handleExprerienceChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" />
            </div>
            <div className="mt-2 flex flex-col">
                <label htmlFor="company" className="text-lg text-custom_gray">Company</label>
                <input type="text" name="company" id="company" value={experience.company} onChange={handleExprerienceChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" />
            </div>
            <div className="mt-2">
                <label className="text-lg text-custom_gray">Employment Type</label>
                <div className="flex flex-row gap-4">
                    <div>
                        <input type="radio" id="fullTime" name="employmentType" value="Full-time" onChange={handleExprerienceChange} checked={experience.employmentType === 'Full-time'} className="mx-1 accent-custom_gray  checked:accent-custom_red"/>
                        <label htmlFor="employmentType" className="text-custom_gray">Full-time</label>
                    </div>
                    <div>
                        <input type="radio" id="partTime" name="employmentType" value="Part-time" onChange={handleExprerienceChange} checked={experience.employmentType === 'Part-time'} className="mx-1 accent-custom_gray  checked:accent-custom_red"/>
                        <label htmlFor="employmentType" className="text-custom_gray">Part-time</label>
                    </div>
                </div>
            </div>
        </>
    )
}