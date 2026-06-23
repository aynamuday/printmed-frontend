
import Echo from 'laravel-echo';

export const echo = (token) => {
    return new Echo({
        broadcaster: 'pusher',
        key: '4b6776446dc7fcac030b',
        cluster: 'ap1',
        forceTLS: true,
        authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    })
}