const getPassword = async () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/password`, {
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