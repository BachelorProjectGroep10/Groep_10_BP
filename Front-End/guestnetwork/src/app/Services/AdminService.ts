import { Admin } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;


const getAdmin = async (admin:Admin) => {
    return fetch(`${basicUrl}/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'          
        },
        body: JSON.stringify(admin)
    });
};

const AdminService = {
    getAdmin
};

export default AdminService;