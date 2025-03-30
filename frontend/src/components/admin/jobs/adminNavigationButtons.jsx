import Button from "../../button"

export default function AdminNavigationButtons({route, btnType = 'button', secoundRoute,btnText, secondBtnText}) {
    return (
        <>
            <Button 
                btnStyle="red-default"
                redirectPath={`${route}`}
            >
                {btnText}
            </Button>
            {btnType === 'button' && (
                <Button 
                    btnStyle="red-default"
                    type="button"
                    redirectPath={`${secoundRoute}`}
                >
                    {secondBtnText}
                </Button>
            )}
            {btnType === 'submit' && (
                <Button 
                    btnStyle="red-default"
                    type="submit"
                >
                    {secondBtnText}
                </Button>
            )}
        </>
    )
}