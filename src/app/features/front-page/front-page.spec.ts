import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input } from '@angular/core';
import { provideRouter } from '@angular/router';

import { NzIconModule } from 'ng-zorro-antd/icon';

import { FrontPage } from './front-page';

@Component({
    selector: 'nz-icon',
    standalone: true,
    template: ''
})
class MockNzIconComponent {
    readonly nzType = input('');
    readonly nzTheme = input('');
}

describe('FrontPage', () => {
    let component: FrontPage;
    let fixture: ComponentFixture<FrontPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FrontPage],
            providers: [provideRouter([])]
        })
            .overrideComponent(FrontPage, {
                remove: {
                    imports: [NzIconModule]
                },
                add: {
                    imports: [MockNzIconComponent]
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(FrontPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the main home content', () => {
        const element = fixture.nativeElement as HTMLElement;

        expect(element.querySelector('.brand')?.textContent).toContain('Task Manager');
        expect(element.querySelector('.hero-title')?.textContent).toContain('Organize suas tarefas');
        expect(element.querySelector('.hero-description')?.textContent).toContain('Task Manager é a sua central de tarefas');
    });

    it('should render the four feature cards', () => {
        const element = fixture.nativeElement as HTMLElement;
        const cards = Array.from(element.querySelectorAll<HTMLElement>('.feature-card'));

        expect(cards).toHaveLength(4);
        expect(cards.map(card => card.querySelector('h3')?.textContent?.trim())).toEqual([
            'Organize',
            'Acompanhe',
            'Priorize',
            'Conquiste'
        ]);
    });


    it('should point account links to their correct routes', () => {
        const element = fixture.nativeElement as HTMLElement;

        const loginLink =
            element.querySelector<HTMLAnchorElement>('.btn-login');

        const registerLink =
            element.querySelector<HTMLAnchorElement>('.about .btn-primary');

        expect(loginLink?.getAttribute('href')).toBe('/login');
        expect(registerLink?.getAttribute('href')).toBe('/register');
    });


    it('should render the dashboard preview with accessible text', () => {
        const element = fixture.nativeElement as HTMLElement;
        const preview = element.querySelector<HTMLImageElement>('.preview-image');

        expect(preview).toBeTruthy();
        expect(preview?.getAttribute('src')).toBe('front-page/dashboard-preview.png');
        expect(preview?.getAttribute('alt')).toBe('Tela do Task Manager');
    });
});
