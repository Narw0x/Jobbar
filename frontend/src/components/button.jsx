export default function Button({ children, type }) {
    let classList = '';
  
    switch (type) {
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
  
    return (
      <button className={`border-[1px] ${classList} py-2 px-4 rounded transition-all duration-300 ease-in-out`}>
        {children}
      </button>
    );
  }
  