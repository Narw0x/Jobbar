import Button from "../button"

export default function JobFormBody({applicant, acceptedApplicant, handleOpenModal, handleAddFavorite, jobId, state}){
    return(
        <div key={applicant.applicant._id} className="flex lg:flex-row flex-col gap-4 border-b py-2 justify-between">
            <div className="flex flex-row justify-between basis-1/2 items-center">
                <div className="flex basis-1/2 text-left">
                    {applicant.applicant.firstName}
                </div>
                <div className="flex basis-1/2 text-left justify-end lg:justify-start">
                    {applicant.applicant.email}
                </div>
            </div>
            <div className="flex gap-4 justify-end basis-1/2">
                <Button
                    btnStyle='red-default'
                    redirectPath={(`/profile/${applicant.applicant._id}`)}
                >
                    View Profile
                </Button>
                {!acceptedApplicant && (
                    <Button
                        btnStyle='red-hover'
                        type="button"
                        onClick={() =>
                            handleOpenModal(applicant.applicant.firstName, applicant.applicant.email, applicant.applicant._id, jobId)
                        }
                    >
                        Accept
                    </Button>
                )}
                <div className="flex items-center">
                    <button className="flex items-center justify-center text-custom_red h-6 w-6" type="button" onClick={() => handleAddFavorite(applicant.applicant._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={state.user.favoriteApplicants?.includes(applicant.applicant._id) ? 'currentColor': 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}