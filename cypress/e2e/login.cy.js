describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('form').should('be.visible');
    cy.get('h2').should('contain', 'Login');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Login');
  });

  it('should show validation errors for empty form submission', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should show error for invalid email format', () => {
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Email is invalid').should('be.visible');
  });

  it('should show error for short password', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('123');
    cy.get('button[type="submit"]').click();
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should have link to register page', () => {
    cy.get('a[href="/register"]').should('contain', 'Register here');
  });
});