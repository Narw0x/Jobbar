import Autocomplete from "../autocomplete"
import Button from "../button"

export default function SearchJobConfig({searchConfig, handleChange, handleConfigSubmit}) {



    return(
        <>
            <h1 className="text-custom_gray text-4xl font-bold">Search</h1>
            <form className="flex flex-col gap-4" onSubmit={handleConfigSubmit}>
                <div className='flex flex-col mt-4'>
                    <div className='flex flex-row gap-4 justify-between'>
                        <div className='flex flex-col w-full'>
                            <label className="text-custom_gray text-xl" htmlFor="address">Location: </label>
                            <Autocomplete
                                value={searchConfig.address}
                                onChange={handleChange}
                            />   
                        </div>
                        <div className='flex flex-col justify-between'>
                            <label className="text-custom_gray text-xl" htmlFor="radius">Radius: </label>
                            <select className="border border-custom_gray bg-white rounded p-2 text-xl text-custom_gray my-2" value={searchConfig.radius} onChange={handleChange} name="radius" id="radius">
                                <option value="5">5 km</option>
                                <option value="10">10 km</option>
                                <option value="25">25 km</option>
                                <option value="50">+50 km</option>
                            </select>                                             
                        </div>
                    </div>
                </div>
                <div className='flex md:flex-row flex-col gap-2'>
                    <div className='flex flex-col basis-1/3'>
                        <label className="text-custom_gray text-xl" htmlFor="jobType">Job Type: </label>
                        <select className="border border-custom_gray rounded p-2 bg-white text-lg text-custom_gray" value={searchConfig.jobType} onChange={handleChange} name="jobType" id="jobType">
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="temporary">Temporary</option>
                            <option value="internship">Internship</option>
                            <option value="contract">Contract</option>
                        </select>
                    </div>
                    <div className="flex flex-col basis-1/3">
                        <label className="text-custom_gray text-xl" htmlFor="field">Field: </label>
                        <select className="border border-custom_gray rounded p-2 bg-white text-lg text-custom_gray" value={searchConfig.field} onChange={handleChange} name="field" id="field">
                            <option value="all">All</option>
                            <option value="it">IT</option>
                            <option value="finance">Finance</option>
                            <option value="marketing">Marketing</option>
                            <option value="hr">HR</option>
                            <option value="sales">Sales</option>
                            <option value="engineering">Engineering</option>
                            <option value="design">Design</option>
                            <option value="education">Education</option>
                            <option value="health">Health</option>
                        </select>
                    </div>
                    <div className="flex flex-col basis-1/3">
                        <label className="text-custom_gray text-xl" htmlFor="salary">Minimal Salary: </label>
                        <input className="border border-custom_gray rounded p-2" type='number' value={searchConfig.salary} onChange={handleChange} name="salary" id="salary" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-custom_gray text-xl" htmlFor="experience">Experience: </label>
                        <select className="border border-custom_gray rounded p-2 bg-white text-lg text-custom_gray" value={searchConfig.experience} onChange={handleChange} name="experience" id="experience">
                            <option value="0-1">0-1</option>
                            <option value="1-3">1-3</option>
                            <option value="3-5">3-5</option>
                            <option value="5+">5+</option>
                        </select>
                    </div>
                    
                </div>
                <div className='flex justify-end gap-2'>
                    <Button
                        btnStyle={'red-default'}
                        type='submit'
                    >
                        Search
                    </Button>
                </div>
            </form>
        </>
    )
}