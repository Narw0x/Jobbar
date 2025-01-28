import axios from "axios";
import { redirect } from "react-router-dom";

function checkVerifyTokenLoader({  }) {
    const { token } = useParams();

    if (!token) {
        return redirect('/');
    }

    try {
        const response = await axios.post('http://localhost:4000/api/verify', { token });
        console.log(response.data);
        redirect('/');
        return null;
    } catch (error) {
        console.error('Error verifying token:', error);
        return redirect('/');
    }

    return null;
}