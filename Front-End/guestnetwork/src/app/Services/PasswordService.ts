const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getPassword = async () => {
    const storedToken = sessionStorage.getItem('admin');
    const token = storedToken ? JSON.parse(storedToken).token : null;
    return fetch(`${basicUrl}/password`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`       
        }
    });
};

const PasswordService = {
    getPassword
};

export default PasswordService;