import { useState } from 'react';
import SearchPageSelect from '../components/searchPageSelect';
import SearchPageConfig from '../components/searchConfig';
import SearchJobView from '../components/searchJobView';
import SearchBookmarksView from '../components/searchBookmarksView';





export default function SearchPage(){
    const [subPage, setSubPage] = useState('job offers');

    return (
        <section className="bg-custom_bg_gray py-8">
            <div className="max-w-[1440px] lg:w-[70%] w-[90%] mx-auto flex lg:flex-row flex-col-reverse gap-8">
                <div className="lg:basis-3/4 border shadow-lg bg-white rounded-lg p-8">
                    <div className="mt-8">
                        {subPage === 'job offers' && (
                            <SearchJobView />
                        )}
                        {subPage === 'my preferencies' && (
                            <SearchPageConfig />
                        )}
                        {subPage === 'my applications' && (
                            <SearchBookmarksView />
                        )}
                    </div>

                </div>
                <div className="lg:basis-1/4 border shadow-lg bg-white rounded-lg p-8">
                    <div className="flex flex-col gap-4 ">
                        <SearchPageSelect
                            subPage={subPage} 
                            setSubPage={setSubPage} 
                            text="Job Offers" 
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='h-6 w-6'>
                                    <path d="M21 6H3"/>
                                    <path d="M10 12H3"/>
                                    <path d="M10 18H3"/>
                                    <circle cx="17" cy="15" r="3"/>
                                    <path d="m21 19-1.9-1.9"/>
                                </svg>
                            }
                        />
                        <SearchPageSelect
                            subPage={subPage} 
                            setSubPage={setSubPage} 
                            text="My Applications" 
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill='none'  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='h-6 w-6'>
                                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                                </svg>
                            }
                        />
                        <SearchPageSelect
                            subPage={subPage} 
                            setSubPage={setSubPage} 
                            text="My Preferencies" 
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='h-6 w-6'>
                                    <circle cx="18" cy="15" r="3"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M10 15H6a4 4 0 0 0-4 4v2"/>
                                    <path d="m21.7 16.4-.9-.3"/>
                                    <path d="m15.2 13.9-.9-.3"/>
                                    <path d="m16.6 18.7.3-.9"/>
                                    <path d="m19.1 12.2.3-.9"/>
                                    <path d="m19.6 18.7-.4-1"/>
                                    <path d="m16.8 12.3-.4-1"/>
                                    <path d="m14.3 16.6 1-.4"/>
                                    <path d="m20.7 13.8 1-.4"/>
                                </svg>
                            }
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}