import Button from "../button"

export default function SearchUser({searching, handleSubmit, handleChange, email}) {
    return(
        <>
            <h1  className="text-2xl text-custom_gray font-bold">Find {searching}</h1>
            <form className="flex md:flex-row flex-col gap-4 mt-8 w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 basis-[90%]">
                    <h2 className="text-xl text-custom_gray font-bold">Search {searching} By Email</h2>
                    <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 text-lg" type="email" name="email" id="email" value={email} onChange={handleChange} />
                </div>
                <div className="flex flex-col text-xl basis-[10%] mt-auto "> 
                    <Button btnStyle={'red-hover'}>Search</Button>
                </div>
            </form>
        </>
    )
}