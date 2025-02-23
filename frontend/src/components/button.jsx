import { useNavigate } from 'react-router-dom';

export default function Button({ children, btnStyle, redirectPath = undefined, onClick = undefined, type = 'submit' }) {
    const navigate = useNavigate();
    let classList = '';
    switch (btnStyle) {
        case 'gray-default':
            classList = 'bg-white text-custom_gray border-custom_gray hover:bg-custom_gray hover:text-white';
            break;
        case 'gray-hover':
            classList = 'bg-custom_gray border-custom_gray text-white hover:bg-white hover:text-custom_gray';
            break;
        case 'red-default':
            classList = 'bg-white text-custom_red border-custom_red hover:bg-custom_red hover:text-white';
            break;
        case 'red-hover':
            classList = 'bg-custom_red text-white border-custom_red hover:bg-white hover:text-custom_red hover:border-custom_red';
            break;
        default:
            break;
    }
    const handleClick = () => {
        if (redirectPath) navigate(redirectPath);
        if (onClick) onClick();
    };
    return (
        <button
            className={`border-[1px] ${classList} py-2 px-4 rounded transition-all duration-300 ease-in-out`}
            onClick={handleClick}
            type={type}
        >
            {children}
        </button>
    );
}
