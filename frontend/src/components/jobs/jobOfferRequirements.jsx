import Button from "../button";


export default function JobOfferRequirements({ requirement, setJobOffer, index, handleRequirementChange }) {
    return(
        <div key={index}  className='flex md:flex-row flex-col justify-between md:gap-4' >
            <input 
                type="text" 
                name="requirementName" 
                id={`requirementName-${index}`} 
                className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg flex-1"
                onChange={(e) => handleRequirementChange(index, 'requirementName', e.target.value)}
                value={requirement.requirementName}
            />
            <select 
                name="requirementType" 
                id={`requirementType-${index}`} 
                className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-xl "
                onChange={(e) => handleRequirementChange(index, 'requirementType', e.target.value)}
                value={requirement.requirementType}
            >
                <option value="required">Required</option>
                <option value="optional">Optional</option>
            </select>
            {index > 0 && (
                <div className="flex flex-col justify-center">   
                    <Button 
                        btnStyle="red-hover" 
                        type="button" 
                        onClick={() => {
                            setJobOffer(prevState => ({
                                ...prevState,
                                requirements: prevState.requirements.filter((req, i) => i !== index)
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