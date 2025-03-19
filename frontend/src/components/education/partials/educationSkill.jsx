export default function EducationSkill({education, handleChange}) {
    return(
        <>
            <div className="flex flex-col">
                <label htmlFor="skillName" className="text-lg text-custom_gray">Name</label>
                <input type="text" name="skillName" id="skillName" value={education.skillName} onChange={handleChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray" />
            </div>
            <div className="mt-2 flex flex-col">
                <label htmlFor="level" className="text-lg text-custom_gray">Level</label>
                <select name="level" id="level" value={education.level} onChange={handleChange} className="border border-black p-2 bg-white rounded mb-4 text-xl my-2 text-custom_gray">
                    <option value="" disabled>Select skill level</option>
                    <option value="Begginer">Begginer</option>
                    <option value="Intermidient">Intermidient</option>
                    <option value="Expert">Expert</option>
                </select>
            </div>
        </>
    )
}