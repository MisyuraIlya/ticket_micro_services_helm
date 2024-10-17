import request from "supertest";
import { app } from "../../app";

it('clears the cookie after signing out', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@gmail.com',
            password: 'password'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    const cookie = response.get('Set-Cookie');
    
    expect(cookie).toBeDefined();  // Ensure Set-Cookie header is present
    expect(cookie![0]).toEqual(
        'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
});
