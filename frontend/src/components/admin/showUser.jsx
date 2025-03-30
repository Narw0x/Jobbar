import Button from "../button"

export default function ShowUser({searching, user, handleDelete}) {
    return (
        <div className="flex flex-col gap-4 mt-8">
            <h2 className="text-xl text-custom_gray font-bold">{searching} Information</h2>
            <div className="flex md:flex-row flex-col">
                <div className="flex basis-1/5">
                    <p className="text-custom_gray text-lg">Name: <span className="text-custom_red text-sm md:text-lg">{user.userName}</span></p>
                </div>
                <div className="flex flex-row basis-2/5">
                    <p className="text-custom_gray text-lg ">Email: <span className="text-custom_red text-sm md:text-lg">{user.email}</span></p>
                </div>
                <div className="flex flex-col md:flex-row basis-2/5 justify-end gap-4">
                    <Button btnStyle={'red-default'} redirectPath={`/xyz/users/${user._id}`}>View Profile</Button>
                    <Button btnStyle={'red-default'} redirectPath={`/xyz/users/edit/${user._id}`}>Edit</Button>
                    <Button btnStyle={'red-hover'} onClick={() => handleDelete(user._id)}>Delete</Button>
                </div>
            </div>
        </div>
    )
}