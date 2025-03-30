import Button from "../button";

export default function JobOfferSkills({ skill, index, handleSkillChange, setJobOffer }) {
    return(
        <div key={index}  className='flex md:flex-row flex-col justify-between md:gap-4' >
            <input 
                type="text" 
                name="skillName" 
                id={`skillName-${index}`} 
                className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg flex-1"
                onChange={(e) => handleSkillChange(index, 'skillName', e.target.value)}
                value={skill.skillName}
            />
            <select 
                name="skillLevel" 
                id={`skillLevel-${index}`} 
                className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-xl "
                onChange={(e) => handleSkillChange(index, 'skillLevel', e.target.value)}
                value={skill.skillLevel}
            >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
            </select>
            {index > 0 && (
                <div className="flex flex-col justify-center">   
                    <Button 
                        btnStyle="red-hover" 
                        type="button" 
                        onClick={() => {
                            setJobOffer(prevState => ({
                                ...prevState,
                                skills: prevState.skills.filter((req, i) => i !== index)
                            }));
                        }}
                    >
                        Remove
                    </Button>
                </div>
            )}
        </div>
    )
}