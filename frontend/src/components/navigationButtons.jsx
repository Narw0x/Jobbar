import { useNavigate } from "react-router-dom";
import Button from "./button";

export default function NavigationButtons({route, btnText}) {
    const navigate = useNavigate();
    return (
        <>
            <Button 
                btnStyle="red-hover"
                type="button"
                onClick={() => {
                    navigate(`${route}`);
                }}
            >
                {btnText}
            </Button>
            <Button 
                btnStyle="red-default"
                type="submit"
            >
                Save
            </Button>
        </>
    )
}