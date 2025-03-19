import Image from "../image";
import NavigationButtons from "../navigationButtons";
import EducationCertificate from "./partials/educationCertificate";
import EducationSchool from "./partials/educationSchool";
import EducationSelect from "./partials/educationSelect";
import EducationSkill from "./partials/educationSkill";
import Button from "../button";

export default function EducationForm({education, handleChange, type, handleTypeChange=undefined, state, editing=false, handleDelete=undefined}) {
    return(
        <>
            <div className="flex flex-col flex-1 mt-2">
                {!editing && (
                    <div className="mt-2 flex flex-col">
                        <EducationSelect type={type} handleTypeChange={handleTypeChange} />
                    </div>
                )}
                {type === "school" && <EducationSchool education={education} handleChange={handleChange} />}
                {type === "certificate" && <EducationCertificate education={education} handleChange={handleChange} />}
                {type === "skill" && <EducationSkill education={education} handleChange={handleChange} />}
                {editing && (
                    <div>
                        <Button 
                            btnStyle="red-hover"
                            type="button"
                            onClick={handleDelete}
                        >
                            Delete Experience
                        </Button>
                    </div>
                )}
            </div>
            <div className="flex flex-col flex-1 mt-[-1rem]">
                <div className="flex flex-col justify-end flex-wrap">
                    <Image />
                </div>
                <div className="flex space-x-4 justify-end mt-4">
                    <NavigationButtons btnText={'Back'} route={`/profile/${state.user._id}`} />
                </div>
            </div>
        </>
    )
}