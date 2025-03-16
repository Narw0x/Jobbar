const pathExperienceImage = "../../../experienceImage.svg";

export default function ExperienceImage() {
    return(
        <>
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
        </>
    )
}