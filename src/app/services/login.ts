import { HttpClient } from '@angular/common/http';
import { Service } from '@angular/core';

@Service()
export class Login {
    
    constructor(private httpClient: HttpClient) {}

    login(email: string, password: string) {
        const body = { email, password };
        return this.httpClient.post("https://api.example.com/login", body);
    }
}
