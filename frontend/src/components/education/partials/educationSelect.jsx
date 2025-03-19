export default function EducationSelect({type, handleTypeChange}) {
    return (
        <>
            <label 
                htmlFor="educationType" 
                className="text-lg text-gray-700 mb-2"
            >
                Type of your education
            </label>
            <select
                id="educationType"
                name="educationType"
                value={type}
                onChange={handleTypeChange}
                className={`border border-black p-2 bg-white rounded  text-xl my-2 text-custom_gray`}
            >
                <option value="" disabled>Select education type</option>
                <option value="school">School</option>
                <option value="certificate">Certificate</option>
                <option value="skill">Skill</option>
            </select>
        </>
    )
}