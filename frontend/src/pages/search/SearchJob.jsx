import { useState } from "react";
import SearchJobConfig from "../../components/search/config";
import SearchJobSearch from "../../components/search/search";
import { useEffect } from "react";
import axios from "axios";


export default function SearchJobPage() {

    const [searchConfig, setSearchConfig] = useState({
        address: '',
        radius: '5',
        jobType: 'full-time',
        salary: '0',
        experience: '0-1',
        field: 'All'
    });
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [sendConfig, setSendConfig] = useState(searchConfig);

    useEffect(() => {
        setIsLoading(true);
        axios.post('https://jobbar-5m8u.onrender.com/api/jobs',{searchConfig: sendConfig, page} )
        .then(response => {
            setIsLoading(false);
            setJobs(response.data.payload.jobs);
            console.log(response);
            
        }).catch(err => {
            setIsLoading(false);
            console.log(err);
        });
    }, [sendConfig, page]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchConfig((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSendConfig(searchConfig);
    }

    return(
        <section className="bg-custom_bg_gray py-8 min-h-[61.5vh]">
            <div className="max-w-[1440px] lg:w-[70%] w-[90%] mx-auto flex  flex-col gap-8 ">
                <div className="border shadow-lg bg-white rounded-lg p-8 w-full">
                    <SearchJobConfig searchConfig={searchConfig} handleChange={handleChange} handleConfigSubmit={handleSubmit}  />
                </div>
                <div className="border shadow-lg bg-white rounded-lg p-8 w-full">
                    <SearchJobSearch jobs={jobs} isLoading={isLoading} page={page}  setPage={setPage}/>
                </div>
            </div>
        </section>
    )
}