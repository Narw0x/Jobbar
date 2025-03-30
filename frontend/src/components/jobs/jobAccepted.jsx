import Button from "../button"

export default function JobAccepted({ acceptedApplicant }) {
    return(
        <div>
            <h2 className="text-xl font-bold text-custom_gray my-4">Accepted Applicant</h2>
            <div className="flex lg:flex-row flex-col gap-4 border-b py-2 justify-between">
                <div className="flex flex-row justify-between basis-1/2 items-center">
                    <div className="flex basis-1/2 text-left">
                        {acceptedApplicant.applicant.firstName}
                    </div>
                    <div className="flex basis-1/2 text-left justify-end lg:justify-start">
                        {acceptedApplicant.applicant.email}
                    </div>
                </div>
                <div className="flex gap-4 justify-end basis-1/2">
                    <Button
                        btnStyle='red-default'
                        redirectPath={(`/profile/${acceptedApplicant.applicant._id}`)}
                    >
                        View Profile
                    </Button>
                </div>
            </div>
        </div>
    )
}