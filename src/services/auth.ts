import HttpClient from '../plugins/HttpClient';
const httpClient = new HttpClient();

type SignInPayload = {
    email: string;
    password: string;
};

export default class AuthService {
    static async signIn(email: string, password: string): Promise<any> {
        const payload: SignInPayload = { email, password };
        const res = await httpClient.post('/admin/auth/login', payload);
        return res;
    }
    static async getCurrentUser(): Promise<any> {
        const res = await httpClient.get('/admin/auth/me');
        return res;
    }
    static saveLocalToken(token: string) {
        return localStorage.setItem('access_token', token);
    }
    static saveLocalUserData(userData: UserData) {
        return localStorage.setItem('user_data', JSON.stringify(userData));
    }
    static getLocalUserData(): UserData | null {
        const userData = localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data') || '') : null;
        return userData;
    }
}
