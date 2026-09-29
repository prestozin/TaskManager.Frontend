import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FrontPage } from './front-page';

describe('FrontPage', () => {
    let component: FrontPage;
    let fixture: ComponentFixture<FrontPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FrontPage],
            providers: [provideRouter([])]
        }).compileComponents();

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

    it('should keep account links pointing to login', () => {
        const element = fixture.nativeElement as HTMLElement;
        const accountLinks = Array.from(
            element.querySelectorAll<HTMLAnchorElement>('.btn-login, .about .btn-primary')
        );

        expect(accountLinks).toHaveLength(2);
        expect(accountLinks.every(link => link.getAttribute('href') === '/login')).toBe(true);
    });

    it('should render the dashboard preview with accessible text', () => {
        const element = fixture.nativeElement as HTMLElement;
        const preview = element.querySelector<HTMLImageElement>('.preview-image');

        expect(preview).toBeTruthy();
        expect(preview?.getAttribute('src')).toBe('front-page/dashboard-preview.png');
        expect(preview?.getAttribute('alt')).toBe('Tela do Task Manager');
    });
});
