import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: ({token}) => {
                return `<p>Hello Rana......</p>`
                
            }
        }
    },
    access: {
      read: () => true,
      create: () => true,  
    },
    fields: [
        {
            name: 'role',
            required: true,
            defaultValue: 'user',
            // admin: {
            //   condition: () => false
            // },
            type: 'select',
            options: [
                {
                    label: 'Admin',
                    value: 'admin',
                },
                {
                    label: 'User',
                    value: 'user',
                }
            ]
        }
    ]
}

export default Users