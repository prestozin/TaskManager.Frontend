import { HttpClient } from '@angular/common/http';
import { inject, Injectable  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    
    private httpClient = inject(HttpClient);

    login(email: string, password: string) {

        const body = { email, password };
        
        return this.httpClient.post("https://api.example.com/login", body);
    }
}
