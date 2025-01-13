export default function SearchPageSelect({ subPage, setSubPage, text, icon }) {
    return (
        <div> 
            <button
                type="button"
                onClick={() => setSubPage(text.toLowerCase())}
                className={`flex flex-row w-full items-center gap-3 
                    text-custom_gray
                    ${subPage === `${text.toLowerCase()}` ? 'text-custom_red' : null}
                `}
            >
                {icon}
                <p className={`text-xl`}>
                    {text}
                </p>
            </button>
        </div>
    )
};