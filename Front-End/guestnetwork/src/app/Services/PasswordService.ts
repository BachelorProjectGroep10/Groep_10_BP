const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;


const getPassword = async () => {
    return fetch(`${basicUrl}/password`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'          
        }
    });
};

const PasswordService = {
    getPassword
};

export default PasswordService;