describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    // Skenario: Pengguna dapat melihat form login dengan semua elemen yang diperlukan
    cy.get('form').should('be.visible');
    cy.get('h2').should('contain', 'Login');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Login');
  });

  it('should show validation errors for empty form submission', () => {
    // Skenario: Sistem menampilkan error validasi ketika form login kosong disubmit
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should show error for invalid email format', () => {
    // Skenario: Sistem menampilkan error ketika format email tidak valid
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Email is invalid').should('be.visible');
  });

  it('should show error for short password', () => {
    // Skenario: Sistem menampilkan error ketika password terlalu pendek
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('123');
    cy.get('button[type="submit"]').click();
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should have link to register page', () => {
    // Skenario: Pengguna dapat mengakses halaman register dari form login
    cy.get('a[href="/register"]').should('contain', 'Register here');
  });

  it('should login successfully with valid credentials', () => {
    // Skenario: Pengguna berhasil login dengan email dan password yang valid, kemudian diarahkan ke dashboard
    // First register a test user
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'password123';

    cy.request('POST', 'https://forum-api.dicoding.dev/v1/register', {
      name: 'Test User',
      email: testEmail,
      password: testPassword,
    });

    // Then login
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type(testPassword);
    cy.get('button[type="submit"]').click();

    // Should redirect to home page
    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains('Welcome').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    // Skenario: Sistem menampilkan error ketika kredensial login tidak valid
    cy.get('input[type="email"]').type('nonexistent@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid credentials').should('be.visible');
  });
});