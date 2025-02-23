export default function ProfileContact({ contact }) {
    return(
        <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
            <h2 className="text-lg  text-custom_gray font-semibold">Contact</h2>
            <div className="text-sm text-gray-500 flex gap-1 flex-col">
                {contact.phoneNumber && (
                    <p>Phone number: <span className="text-custom_red">{contact.phoneNumber}</span></p>
                )}
                {contact.email && (
                    <p>Email: <span className="text-custom_red">{contact.email}</span></p>
                )}
                {contact.website && (
                    <p>Website: <a href={contact.website} className="text-custom_red">{contact.website}</a></p>
                )}
                <div className="flex flex-row gap-2">
                    {contact.socialMedia.twitter && (
                        <a href={`https://x.com/${contact.socialMedia.twitter}`} className="hover:text-custom_red transition-colors duration-300 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="none">
                                <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" fill="currentColor"/>
                            </svg>
                        </a>
                    )}
                    {contact.socialMedia.github && (
                        <a href={`https://github.com/${contact.socialMedia.github}`} className="hover:text-custom_red transition-colors duration-300 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                                <path d="M9 18c-4.51 2-5-2-7-2"/>
                            </svg>
                        </a>
                    )}
                    {contact.socialMedia.instagram && (
                        <a href={`https://www.instagram.com/${contact.socialMedia.instagram}`} className="hover:text-custom_red transition-colors duration-300 cursor-pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M16 11.3701C16.1234 12.2023 15.9812 13.0523 15.5937 13.7991C15.2062 14.5459 14.5931 15.1515 13.8416 15.5297C13.0901 15.908 12.2384 16.0397 11.4077 15.906C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1903 8.22768 13.4229 8.09402 12.5923C7.96035 11.7616 8.09202 10.91 8.47028 10.1584C8.84854 9.40691 9.45414 8.7938 10.2009 8.4063C10.9477 8.0188 11.7977 7.87665 12.63 8.00006C13.4789 8.12594 14.2648 8.52152 14.8716 9.12836C15.4785 9.73521 15.8741 10.5211 16 11.3701Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
)}