
import Echo from 'laravel-echo';

export const echo = (token) => {
    return new Echo({
        broadcaster: 'pusher',
        key: '077b71ab49dceaed5696',
        cluster: 'ap1',
        forceTLS: true,
        authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    })
}