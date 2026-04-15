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
    cy.get('button[type="submit"]').click({ force: true });
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should show error for invalid email format', () => {
    // Skenario: Sistem menampilkan error ketika format email tidak valid
    cy.get('input[type="email"]').clear({ force: true }).type('invalid-email', { force: true });
    cy.get('input[type="password"]').clear({ force: true }).type('password123', { force: true });

    // Submit form directly to ensure submit event is triggered
    cy.get('form').submit();

    // Wait for validation to complete
    cy.wait(2000);

    // Check for error in span with error-text class
    cy.get('span.error-text').should('contain', 'Email is invalid');
  });

  it('should show error for short password', () => {
    cy.get('input[type="email"]').type('test@example.com', { force: true });
    cy.get('input[type="password"]').type('123', { force: true });
    cy.get('button[type="submit"]').click({ force: true });
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should have link to register page', () => {
    // Skenario: Pengguna dapat mengakses halaman register dari form login
    cy.get('a[href="/register"]').should('contain', 'Register here');
  });

  it('should login successfully with valid credentials', () => {
    // Skenario: Pengguna berhasil login dengan email dan password yang valid, kemudian diarahkan ke dashboard
    // Use existing account to avoid bloating API data (as per reviewer note)
    const testEmail = 'testayam@gmail.com';
    const testPassword = 'adminadmin123';

    // Login with existing credentials
    cy.get('input[type="email"]').clear({ force: true }).type(testEmail, { force: true });
    cy.get('input[type="password"]').clear({ force: true }).type(testPassword, { force: true });
    cy.get('button[type="submit"]').click({ force: true });

    // Should redirect to home page
    cy.url({ timeout: 15000 }).should('eq', 'http://localhost:3000/');

    // Wait for page to load completely and check URL change (avoid overlay issues)
    cy.window().should('have.property', 'location').and('have.property', 'pathname', '/');
  });

  it('should show error for invalid credentials', () => {
    // Skenario: Sistem menampilkan error ketika kredensial login tidak valid
    cy.get('input[type="email"]').clear({ force: true }).type('wronguser@example.com', { force: true });
    cy.get('input[type="password"]').clear({ force: true }).type('wrongpassword123', { force: true });

    // Submit form directly to ensure submit event is triggered
    cy.get('form').submit();

    // Wait for API call to complete and check that we're still on login page (login failed)
    cy.wait(3000);
    cy.url().should('include', '/login');
  });
});