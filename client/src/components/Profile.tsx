import axios from 'axios';
import React from 'react';



const Profile = async () => {

    try {
        const response = await axios.get(
            'http://ingress-nginx-controller.ingress-nginx-controller.svc.cluster.local/api/users/currentuser',
            {
                headers: {
                    Host: 'ticketing.dev'
                }
            }
        )
        console.log('response',response)
    } catch(e) {
        console.log('e',e)
    }

    return (
        <div>
            <h1>Profile</h1>
        </div>
    );
};

export default Profile;